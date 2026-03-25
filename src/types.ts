export type QualityMode = 'performance' | 'standard' | 'cinematic'

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

  auroraStrength?: number
  temperatureGradient?: number
  dopplerEffect?: number

  photonSphereIntensity?: number
  coreDepthEffect?: number

  einsteinRingStrength?: number
  secondaryImage?: number
  lensDetail?: number

  accretionFlowStrength?: number
  accretionFlowCount?: number
  jetIntensity?: number
  jetColor?: string
  jetWidth?: number

  bloomStrength?: number
  chromaticAberration?: number
  vignetteStrength?: number
  filmGrain?: number

  qualityMode?: QualityMode
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

  auroraStrength: number
  temperatureGradient: number
  dopplerEffect: number

  photonSphereIntensity: number
  coreDepthEffect: number

  einsteinRingStrength: number
  secondaryImage: number
  lensDetail: number

  accretionFlowStrength: number
  accretionFlowCount: number
  jetIntensity: number
  jetColor: string
  jetWidth: number

  bloomStrength: number
  chromaticAberration: number
  vignetteStrength: number
  filmGrain: number

  qualityMode: QualityMode
}
