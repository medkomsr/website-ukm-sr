const MONTHS: Record<string, number> = {
  januari: 1,
  februari: 2,
  maret: 3,
  april: 4,
  mei: 5,
  juni: 6,
  juli: 7,
  agustus: 8,
  september: 9,
  oktober: 10,
  november: 11,
  desember: 12,
}

const DATE_FORMATTER = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

type DateParts = {year: number; month: number; day: number}

function normalizeYear(value: number) {
  if (value >= 100) return value
  return 2000 + value
}

function isValidDate({year, month, day}: DateParts) {
  if (year < 1900 || year > 2200 || month < 1 || month > 12 || day < 1 || day > 31) return false
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

function toIso(parts: DateParts) {
  return `${parts.year.toString().padStart(4, '0')}-${parts.month.toString().padStart(2, '0')}-${parts.day.toString().padStart(2, '0')}`
}

export function normalizeDateToIso(value?: string | null): string | null {
  const input = value?.trim().toLowerCase()
  if (!input) return null

  const isoMatch = input.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (isoMatch) {
    const parts = {year: Number(isoMatch[1]), month: Number(isoMatch[2]), day: Number(isoMatch[3])}
    return isValidDate(parts) ? toIso(parts) : null
  }

  const namedMonthMatch = input.match(/^(\d{1,2})\s+([a-z]+)\s+(\d{2}|\d{4})$/)
  if (namedMonthMatch) {
    const month = MONTHS[namedMonthMatch[2]]
    const parts = {
      year: normalizeYear(Number(namedMonthMatch[3])),
      month,
      day: Number(namedMonthMatch[1]),
    }
    return month && isValidDate(parts) ? toIso(parts) : null
  }

  const numericMatch = input.match(/^(\d{1,2})(?:\/|-|\s+)(\d{1,2})(?:\/|-|\s+)(\d{2}|\d{4})$/)
  if (numericMatch) {
    const day = Number(numericMatch[1])
    const month = Number(numericMatch[2])
    if (day <= 12 && month <= 12) return null
    const parts = {
      year: normalizeYear(Number(numericMatch[3])),
      month,
      day,
    }
    return isValidDate(parts) ? toIso(parts) : null
  }

  return null
}

function isoToUtcDate(iso: string) {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

export function formatDateId(value?: string | null) {
  const iso = normalizeDateToIso(value)
  return iso ? DATE_FORMATTER.format(isoToUtcDate(iso)) : 'Tanggal perlu diperbaiki'
}

export function formatDateRangeId(startValue?: string | null, endValue?: string | null) {
  const startIso = normalizeDateToIso(startValue)
  const endIso = normalizeDateToIso(endValue)

  if (!startIso) return 'Tanggal perlu diperbaiki'
  if (endValue?.trim() && !endIso) return 'Rentang tanggal perlu diperbaiki'
  if (!endIso || endIso === startIso) return formatDateId(startIso)
  if (endIso < startIso) return 'Rentang tanggal perlu diperbaiki'

  const start = isoToUtcDate(startIso)
  const end = isoToUtcDate(endIso)
  const startDay = start.getUTCDate()
  const endDay = end.getUTCDate()
  const startMonth = start.toLocaleDateString('id-ID', {month: 'long', timeZone: 'UTC'})
  const endMonth = end.toLocaleDateString('id-ID', {month: 'long', timeZone: 'UTC'})
  const startYear = start.getUTCFullYear()
  const endYear = end.getUTCFullYear()

  if (startYear === endYear && start.getUTCMonth() === end.getUTCMonth()) {
    return `${startDay}-${endDay} ${endMonth} ${endYear}`
  }
  if (startYear === endYear) {
    return `${startDay} ${startMonth}-${endDay} ${endMonth} ${endYear}`
  }

  return `${formatDateId(startIso)} - ${formatDateId(endIso)}`
}
