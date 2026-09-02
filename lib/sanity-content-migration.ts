import {normalizeDateToIso} from './content-date'

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/
const OVERLAY_THEMES = new Set(['green', 'maroon', 'neutral'])

export type LegacySanityDocument = {
  _id: string
  _rev?: string
  _type: string
  wasPublished?: boolean
  title?: string
  date?: string
  endDate?: string
  time?: string
  description?: string
  longDescription?: string
  overlay?: string
  overlayTheme?: string
  programs?: string[]
  programDescriptions?: string[]
  programItems?: Array<{_key?: string; title?: string; description?: string}>
  slugLocked?: boolean
  jumlahAnggota?: string | number
  jumlahPenghargaan?: string | number
  jumlahKegiatan?: string | number
}

export type ContentMigrationPlan = {
  documentId: string
  documentRevision?: string
  documentType: string
  title: string
  set: Record<string, unknown>
  unset: string[]
  issues: string[]
}

function legacyOverlayTheme(value?: string) {
  if (!value) return null
  if (/13\s*,\s*42\s*,\s*26|green/i.test(value)) return 'green'
  if (/66\s*,\s*10\s*,\s*10|maroon/i.test(value)) return 'maroon'
  if (/17\s*,\s*24\s*,\s*39|neutral/i.test(value)) return 'neutral'
  return 'unknown'
}

function planPositiveInteger(
  plan: ContentMigrationPlan,
  field: 'jumlahAnggota' | 'jumlahPenghargaan' | 'jumlahKegiatan',
  value?: string | number,
) {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0) return
  if (typeof value === 'string' && /^\d+\+?$/.test(value.trim())) {
    const parsed = Number.parseInt(value, 10)
    if (parsed > 0) {
      plan.set[field] = parsed
      return
    }
  }
  plan.issues.push(`${field}: isi dengan bilangan bulat positif sebelum migrasi.`)
}

function planDateField(
  plan: ContentMigrationPlan,
  field: 'date' | 'endDate',
  value?: string,
  required = false,
) {
  if (!value?.trim()) {
    if (required) plan.issues.push(`${field}: tanggal wajib diisi sebelum konten dapat diterbitkan.`)
    return null
  }
  const normalized = normalizeDateToIso(value)
  if (!normalized) {
    plan.issues.push(`${field}: nilai “${value}” tidak dikenali dan dipertahankan untuk koreksi manual.`)
    return null
  }
  if (normalized !== value) plan.set[field] = normalized
  return normalized
}

export function planContentMigration(document: LegacySanityDocument): ContentMigrationPlan {
  const plan: ContentMigrationPlan = {
    documentId: document._id,
    documentRevision: document._rev,
    documentType: document._type,
    title: document.title ?? '(tanpa judul)',
    set: {},
    unset: [],
    issues: [],
  }

  const normalizedStart = document._type === 'event' || document._type === 'artikel'
    ? planDateField(plan, 'date', document.date, true)
    : null
  if (document._type === 'event') {
    const normalizedEnd = planDateField(plan, 'endDate', document.endDate)
    if (normalizedStart && normalizedEnd && normalizedEnd < normalizedStart) {
      plan.issues.push('endDate: tanggal selesai lebih awal daripada tanggal mulai; data dipertahankan untuk koreksi manual.')
      delete plan.set.endDate
    }

    if (typeof document.time === 'string') {
      const normalizedTime = document.time.trim()
      if (!normalizedTime || !TIME_PATTERN.test(normalizedTime)) {
        plan.issues.push(`time: nilai “${document.time}” bukan format HH:mm dan dipertahankan untuk koreksi manual.`)
      } else if (normalizedTime !== document.time) {
        plan.set.time = normalizedTime
      }
    }

    if (typeof document.longDescription === 'string') {
      const completeDescription = document.longDescription.trim()
      if (completeDescription && completeDescription !== document.description) {
        plan.set.description = completeDescription
      }
      plan.unset.push('longDescription')
    }
  }

  if (
    document.wasPublished &&
    ['event', 'artikel', 'bidang', 'departemen'].includes(document._type) &&
    document.slugLocked !== true
  ) {
    plan.set.slugLocked = true
  }

  if (document._type === 'bidang' || document._type === 'departemen') {
    const mappedTheme = legacyOverlayTheme(document.overlay)
    if (!document.overlayTheme) {
      plan.set.overlayTheme = mappedTheme && mappedTheme !== 'unknown' ? mappedTheme : 'green'
      if (mappedTheme === 'unknown') {
        plan.issues.push('overlay: CSS lama tidak dikenali; tema aman “green” akan digunakan.')
      }
    } else if (!OVERLAY_THEMES.has(document.overlayTheme)) {
      plan.set.overlayTheme = 'green'
      plan.issues.push(`overlayTheme: nilai “${document.overlayTheme}” tidak didukung; tema aman “green” akan digunakan.`)
    }
    if (document.overlay !== undefined) plan.unset.push('overlay')
  }

  const hasLegacyPrograms = Boolean(document.programs?.length || document.programDescriptions?.length)
  const hasProgramItems = Boolean(document.programItems?.length)
  if (document._type === 'departemen' && hasLegacyPrograms && hasProgramItems) {
    plan.issues.push('program kerja: data format baru dan lama sama-sama terisi; pilih data yang benar sebelum migrasi.')
  } else if (document._type === 'departemen' && hasLegacyPrograms) {
    const length = Math.max(document.programs?.length ?? 0, document.programDescriptions?.length ?? 0)
    const programItems = Array.from({length}, (_, index) => ({
      _key: `program-${index + 1}`,
      title: document.programs?.[index]?.trim() ?? '',
      description: document.programDescriptions?.[index]?.trim() ?? '',
    }))

    const incomplete = programItems.some((item) => !item.title || !item.description)
    if (incomplete) {
      plan.issues.push('program kerja: nama dan deskripsi lama tidak berpasangan; data dipertahankan untuk koreksi manual.')
    } else {
      plan.set.programItems = programItems
      plan.unset.push('programs', 'programDescriptions')
    }
  }

  if (document._type === 'siteSettings') {
    planPositiveInteger(plan, 'jumlahAnggota', document.jumlahAnggota)
    planPositiveInteger(plan, 'jumlahPenghargaan', document.jumlahPenghargaan)
    planPositiveInteger(plan, 'jumlahKegiatan', document.jumlahKegiatan)
  }

  return plan
}

export function hasMigrationChanges(plan: ContentMigrationPlan) {
  return Object.keys(plan.set).length > 0 || plan.unset.length > 0
}

export function isDraftDocumentId(documentId: string) {
  return documentId.startsWith('drafts.')
}
