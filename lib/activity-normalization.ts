import {normalizeDateToIso} from './content-date'

export type SanityActivityTypeInput = 'event' | 'article' | 'artikel'

export function normalizeSanityActivityType(type: SanityActivityTypeInput): 'event' | 'article' {
  return type === 'artikel' || type === 'article' ? 'article' : 'event'
}

export function compareActivityDatesDesc(
  first: {date?: string | null},
  second: {date?: string | null},
) {
  const firstDate = normalizeDateToIso(first.date)
  const secondDate = normalizeDateToIso(second.date)

  if (firstDate && secondDate) return secondDate.localeCompare(firstDate)
  if (firstDate) return -1
  if (secondDate) return 1
  return 0
}
