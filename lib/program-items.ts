import type {SanityProgramItem} from '../sanity/types'

export function mergeProgramItems(
  programItems?: SanityProgramItem[] | null,
  programs?: string[] | null,
  programDescriptions?: string[] | null,
): SanityProgramItem[] {
  if (programItems?.length) return programItems

  const length = Math.max(programs?.length ?? 0, programDescriptions?.length ?? 0)
  return Array.from({length}, (_, index) => ({
    _key: `legacy-program-${index + 1}`,
    title: programs?.[index]?.trim() ?? '',
    description: programDescriptions?.[index]?.trim() ?? '',
  })).filter((item) => item.title && item.description)
}
