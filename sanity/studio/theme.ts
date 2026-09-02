export const OVERLAY_THEMES = [
  {title: 'Hijau - tenang dan formal', value: 'green'},
  {title: 'Marun - hangat dan tegas', value: 'maroon'},
  {title: 'Netral - gelap sederhana', value: 'neutral'},
] as const

export type OverlayTheme = (typeof OVERLAY_THEMES)[number]['value']
