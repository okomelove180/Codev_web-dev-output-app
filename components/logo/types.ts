// app/components/logo/types.ts
import { LOGO_SIZES, LOGO_COLORS } from './constants'

export type LogoSize = keyof typeof LOGO_SIZES
export type LogoColor = keyof typeof LOGO_COLORS

export interface LogoProps {
  size?: LogoSize
  color?: LogoColor
  className?: string
}