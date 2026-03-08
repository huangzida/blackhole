export interface BlackholeProps {
  debug?: boolean
  lang?: 'zh-CN' | 'en'
  className?: string
  color?: string
  speed?: number
  mass?: number
  positionX?: number
  positionY?: number
  lensingStrength?: number
  diskRadiusScale?: number
  diskWidth?: number
  diskIntensity?: number
  diskTilt?: number
  haloIntensity?: number
  starDensity?: number
  twinkleStrength?: number
  noiseStrength?: number
  maxFps?: number
}

export interface BlackholeEngineConfig {
  color: string
  speed: number
  mass: number
  positionX: number
  positionY: number
  lensingStrength: number
  diskRadiusScale: number
  diskWidth: number
  diskIntensity: number
  diskTilt: number
  haloIntensity: number
  starDensity: number
  twinkleStrength: number
  noiseStrength: number
  maxFps: number
}
