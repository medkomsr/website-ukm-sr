import type {OverlayTheme} from '@/sanity/types'

const OVERLAY_GRADIENTS: Record<OverlayTheme, string> = {
  green: 'linear-gradient(to bottom, rgba(13,42,26,0.15) 0%, rgba(13,42,26,0.92) 100%)',
  maroon: 'linear-gradient(to bottom, rgba(66,10,10,0.15) 0%, rgba(66,10,10,0.92) 100%)',
  neutral: 'linear-gradient(to bottom, rgba(17,24,39,0.15) 0%, rgba(17,24,39,0.90) 100%)',
}

export function getOverlayGradient(theme?: OverlayTheme | null) {
  return OVERLAY_GRADIENTS[theme ?? 'green'] ?? OVERLAY_GRADIENTS.green
}
