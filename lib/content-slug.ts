export function slugify(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/&/g, ' dan ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 96)
    .replace(/-+$/g, '')
}

export function createUniqueSlug(baseSlug: string, usedSlugs: Iterable<string>) {
  const used = new Set(usedSlugs)
  let candidate = baseSlug
  let suffix = 2
  while (used.has(candidate)) {
    candidate = `${baseSlug}-${suffix}`
    suffix += 1
  }
  return candidate
}

export function shouldRegenerateSlug(publishedExists: boolean, slugLocked = false) {
  return !publishedExists && !slugLocked
}
