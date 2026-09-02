export const SANITY_CACHE_TAGS = {
  event: 'aktivitas',
  artikel: 'aktivitas',
  departemen: 'departemen',
  bidang: 'bidang',
  faq: 'faq',
  galeri: 'galeri',
  homePage: 'homePage',
  prestasi: 'prestasi',
  siteSettings: 'siteSettings',
  visiMisi: 'visiMisi',
} as const

export type SupportedSanityType = keyof typeof SANITY_CACHE_TAGS

export type SanityWebhookPayload = {
  _id: string
  _type: string
  projectId: string
  dataset: string
  operation: 'create' | 'update' | 'delete'
}

export function validateSanityWebhookPayload(
  value: unknown,
  expectedProjectId?: string,
  expectedDataset?: string,
): {ok: true; payload: SanityWebhookPayload; tag: string} | {ok: false; error: string} {
  if (!value || typeof value !== 'object') return {ok: false, error: 'Payload webhook tidak valid.'}

  const payload = value as Partial<SanityWebhookPayload>
  const requiredValues = [payload._id, payload._type, payload.projectId, payload.dataset, payload.operation]
  if (requiredValues.some((item) => typeof item !== 'string' || item.length === 0)) {
    return {ok: false, error: 'Payload webhook tidak lengkap.'}
  }

  if (payload.projectId !== expectedProjectId || payload.dataset !== expectedDataset) {
    return {ok: false, error: 'Project atau dataset webhook tidak cocok.'}
  }

  if (!['create', 'update', 'delete'].includes(payload.operation as string)) {
    return {ok: false, error: 'Operasi webhook tidak didukung.'}
  }

  const tag = SANITY_CACHE_TAGS[payload._type as SupportedSanityType]
  if (!tag) return {ok: false, error: 'Tipe dokumen webhook tidak didukung.'}

  return {ok: true, payload: payload as SanityWebhookPayload, tag}
}
