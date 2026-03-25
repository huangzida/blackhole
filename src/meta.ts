import { generateRandomPalette, rand } from '@bg-effects/shared'
import type { EffectMeta } from '@bg-effects/core'
import type { BlackholeProps } from './types'

export const meta: EffectMeta<BlackholeProps> = {
  id: 'blackhole',
  name: {
    en: 'Blackhole',
    'zh-CN': '黑洞',
  },
  category: 'space',
  version: '1.0.0',
  defaultConfig: {
    debug: false,
    lang: 'zh-CN',
    color: '#ff6600',
    speed: 1.0,
    mass: 1.0,
    positionX: 0.5,
    positionY: 0.5,
    lensingStrength: 0.8,
    diskRadiusScale: 1.0,
    diskWidth: 1.0,
    diskIntensity: 2.0,
    diskTilt: 3.0,
    haloIntensity: 0.5,
    starDensity: 1.0,
    twinkleStrength: 1.0,
    noiseStrength: 0.35,
    maxFps: 60,
    brightness: 1.0,
    qualityMode: 'standard',
    auroraStrength: 0.5,
    temperatureGradient: 0.7,
    dopplerEffect: 0.3,
    photonSphereIntensity: 0.8,
    coreDepthEffect: 0.6,
    einsteinRingStrength: 0.5,
    secondaryImage: 0.3,
    lensDetail: 2,
    accretionFlowStrength: 0.5,
    accretionFlowCount: 6,
    jetIntensity: 1.0,
    jetColor: '#4fc3f7',
    jetWidth: 0.03,
    bloomStrength: 0.5,
    chromaticAberration: 0.005,
    vignetteStrength: 0.3,
    filmGrain: 0.1,
  },
  randomize: (current, tab?) => {
    const result = { ...current }
    const palette = generateRandomPalette(1)

    if (!tab) {
      result.color = palette[0]
      result.speed = rand(0.5, 2.0)
      result.mass = rand(0.5, 2.5)
      result.positionX = rand(0.2, 0.8)
      result.positionY = rand(0.2, 0.8)
      result.lensingStrength = rand(0.3, 1.6)
      result.diskRadiusScale = rand(0.7, 1.6)
      result.diskWidth = rand(0.6, 1.8)
      result.diskIntensity = rand(1.2, 3.0)
      result.diskTilt = rand(1.8, 4.5)
      result.haloIntensity = rand(0.2, 1.2)
      result.starDensity = rand(0.2, 2.0)
      result.twinkleStrength = rand(0.0, 2.0)
      result.noiseStrength = rand(0.0, 1.0)
      result.brightness = rand(0.5, 1.5)
      result.qualityMode = ['performance', 'standard', 'cinematic'][Math.floor(Math.random() * 3)] as any
      result.auroraStrength = rand(0.0, 1.0)
      result.temperatureGradient = rand(0.0, 1.0)
      result.dopplerEffect = rand(0.0, 0.5)
      result.photonSphereIntensity = rand(0.0, 1.0)
      result.coreDepthEffect = rand(0.0, 1.0)
      result.einsteinRingStrength = rand(0.0, 1.0)
      result.secondaryImage = rand(0.0, 0.5)
      result.lensDetail = Math.floor(rand(1, 4))
      result.accretionFlowStrength = rand(0.0, 1.0)
      result.accretionFlowCount = Math.floor(rand(3, 12))
      result.jetIntensity = rand(0.0, 2.0)
      result.jetColor = palette[0]
      result.jetWidth = rand(0.01, 0.08)
      result.bloomStrength = rand(0.0, 1.0)
      result.chromaticAberration = rand(0.0, 0.01)
      result.vignetteStrength = rand(0.0, 0.5)
      result.filmGrain = rand(0.0, 0.2)
      return result
    }

    if (tab === 'basic') {
      result.speed = rand(0.5, 2.0)
      result.mass = rand(0.5, 2.5)
      result.positionX = rand(0.2, 0.8)
      result.positionY = rand(0.2, 0.8)
      result.maxFps = Math.floor(rand(30, 90))
      return result
    }

    if (tab === 'disk') {
      result.color = palette[0]
      result.diskRadiusScale = rand(0.6, 1.8)
      result.diskWidth = rand(0.4, 2.2)
      result.diskIntensity = rand(1.0, 3.0)
      result.diskTilt = rand(1.8, 4.8)
      result.noiseStrength = rand(0.0, 1.0)
      result.auroraStrength = rand(0.0, 1.0)
      result.temperatureGradient = rand(0.0, 1.0)
      result.dopplerEffect = rand(0.0, 0.5)
      return result
    }

    if (tab === 'lens') {
      result.lensingStrength = rand(0.2, 1.8)
      result.haloIntensity = rand(0.1, 1.4)
      result.einsteinRingStrength = rand(0.0, 1.0)
      result.secondaryImage = rand(0.0, 0.5)
      result.lensDetail = Math.floor(rand(1, 4))
      return result
    }

    if (tab === 'stars') {
      result.starDensity = rand(0.0, 2.0)
      result.twinkleStrength = rand(0.0, 2.0)
      return result
    }

    if (tab === 'particles') {
      result.accretionFlowStrength = rand(0.0, 1.0)
      result.accretionFlowCount = Math.floor(rand(3, 12))
      result.jetIntensity = rand(0.0, 2.0)
      result.jetColor = palette[0]
      result.jetWidth = rand(0.01, 0.08)
      return result
    }

    if (tab === 'postfx') {
      result.bloomStrength = rand(0.0, 1.0)
      result.chromaticAberration = rand(0.0, 0.01)
      result.vignetteStrength = rand(0.0, 0.5)
      result.filmGrain = rand(0.0, 0.2)
      return result
    }

    return result
  },
  presets: [
    {
      id: 'blackhole_classic',
      name: { en: 'Classic', 'zh-CN': '经典' },
      config: {
        color: '#ff6600',
        speed: 1.0,
        mass: 1.0,
        positionX: 0.5,
        positionY: 0.5,
        lensingStrength: 0.8,
        diskRadiusScale: 1.0,
        diskWidth: 1.0,
        diskIntensity: 2.0,
        diskTilt: 3.0,
        haloIntensity: 0.5,
        starDensity: 1.0,
        twinkleStrength: 1.0,
        noiseStrength: 0.35,
        maxFps: 60,
      },
    },
    {
      id: 'blackhole_cinematic',
      name: { en: 'Cinematic', 'zh-CN': '电影感' },
      config: {
        color: '#ff8a3d',
        diskIntensity: 2.8,
        diskRadiusScale: 1.25,
        diskWidth: 1.4,
        haloIntensity: 0.9,
        lensingStrength: 1.0,
        starDensity: 0.7,
        twinkleStrength: 0.6,
        noiseStrength: 0.25,
      },
    },
    {
      id: 'blackhole_deep_lens',
      name: { en: 'Deep Lens', 'zh-CN': '强透镜' },
      config: {
        lensingStrength: 1.6,
        haloIntensity: 0.7,
        starDensity: 1.6,
        twinkleStrength: 1.2,
        diskIntensity: 2.2,
        diskRadiusScale: 0.9,
        diskWidth: 1.0,
        noiseStrength: 0.2,
      },
    },
    {
      id: 'blackhole_quiet_void',
      name: { en: 'Quiet Void', 'zh-CN': '寂静虚空' },
      config: {
        color: '#8b5cf6',
        diskIntensity: 1.4,
        haloIntensity: 0.25,
        starDensity: 0.4,
        twinkleStrength: 0.0,
        noiseStrength: 0.05,
        lensingStrength: 0.6,
        diskRadiusScale: 1.1,
        diskWidth: 0.7,
      },
    },
    {
      id: 'blackhole_storm_disk',
      name: { en: 'Storm Disk', 'zh-CN': '湍流吸积盘' },
      config: {
        color: '#22c55e',
        diskIntensity: 2.6,
        diskRadiusScale: 1.5,
        diskWidth: 2.0,
        diskTilt: 3.8,
        noiseStrength: 0.9,
        haloIntensity: 0.8,
        lensingStrength: 1.1,
        starDensity: 0.9,
        twinkleStrength: 1.4,
      },
    },
    {
      id: 'blackhole_cinematic_pro',
      name: { en: 'Cinematic Pro', 'zh-CN': '电影增强版' },
      config: {
        qualityMode: 'cinematic',
        jetIntensity: 1.2,
        einsteinRingStrength: 0.7,
        accretionFlowStrength: 0.6,
        auroraStrength: 0.8,
        bloomStrength: 0.6,
        photonSphereIntensity: 0.9,
      },
    },
    {
      id: 'blackhole_relativistic',
      name: { en: 'Relativistic', 'zh-CN': '相对论' },
      config: {
        qualityMode: 'cinematic',
        jetIntensity: 1.8,
        accretionFlowStrength: 0.9,
        dopplerEffect: 0.7,
        photonSphereIntensity: 1.0,
        einsteinRingStrength: 0.9,
      },
    },
    {
      id: 'blackhole_aurora',
      name: { en: 'Aurora', 'zh-CN': '极光黑洞' },
      config: {
        qualityMode: 'standard',
        auroraStrength: 1.2,
        temperatureGradient: 1.0,
        color: '#00ff88',
        jetColor: '#00ffcc',
      },
    },
  ],
}
