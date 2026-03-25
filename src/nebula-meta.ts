import { generateRandomPalette, rand } from '@bg-effects/shared'
import type { EffectMeta } from '@bg-effects/core'
import type { NebulaProps } from './types'

export const nebulaMeta: EffectMeta<NebulaProps> = {
  id: 'nebula',
  name: {
    en: 'Nebula',
    'zh-CN': '星云',
  },
  category: 'space',
  version: '1.0.0',
  defaultConfig: {
    qualityMode: 'standard',
    nebulaColor1: '#ff6b9d',
    nebulaColor2: '#4ecdc4',
    speed: 0.5,
    turbulence: 0.5,
    gasCloudIntensity: 0.8,
    gasCloudScale: 1.0,
    cloudWarpStrength: 0.5,
    coreIntensity: 1.5,
    coreSize: 0.25,
    coreColor: '#ffffff',
    lightRayStrength: 0.5,
    lightRayCount: 8,
    dustBandStrength: 0.6,
    dustBandColor: '#1a1a2e',
    dustFeatherEdge: 0.3,
    starDensity: 1.0,
    twinkleStrength: 1.0,
    meteorStrength: 0.5,
    meteorSpeed: 1.0,
    foregroundStarIntensity: 0.8,
  },
  randomize: (current, tab?) => {
    const result = { ...current }
    const palette = generateRandomPalette(2)

    if (!tab) {
      result.nebulaColor1 = palette[0]
      result.nebulaColor2 = palette[1]
      result.speed = rand(0.2, 1.5)
      result.turbulence = rand(0.2, 1.0)
      result.gasCloudIntensity = rand(0.4, 1.0)
      result.coreIntensity = rand(0.8, 2.5)
      result.starDensity = rand(0.3, 2.0)
      result.lightRayStrength = rand(0.0, 1.0)
      result.meteorStrength = rand(0.0, 1.0)
      return result
    }

    if (tab === 'cloud') {
      result.nebulaColor1 = palette[0]
      result.nebulaColor2 = palette[1]
      result.gasCloudIntensity = rand(0.4, 1.0)
      result.gasCloudScale = rand(0.5, 2.0)
      result.cloudWarpStrength = rand(0.2, 1.0)
      result.turbulence = rand(0.2, 1.0)
      return result
    }

    if (tab === 'core') {
      result.coreIntensity = rand(0.8, 3.0)
      result.coreSize = rand(0.15, 0.4)
      result.coreColor = palette[0]
      result.lightRayStrength = rand(0.0, 1.0)
      result.lightRayCount = Math.floor(rand(4, 12))
      return result
    }

    if (tab === 'dust') {
      result.dustBandStrength = rand(0.2, 1.0)
      result.dustBandColor = palette[0]
      result.dustFeatherEdge = rand(0.1, 0.6)
      return result
    }

    if (tab === 'stars') {
      result.starDensity = rand(0.2, 2.5)
      result.twinkleStrength = rand(0.0, 2.0)
      result.foregroundStarIntensity = rand(0.3, 1.2)
      result.meteorStrength = rand(0.0, 1.0)
      result.meteorSpeed = rand(0.5, 2.0)
      return result
    }

    return result
  },
  presets: [
    {
      id: 'nebula_pillars',
      name: { en: 'Pillars of Creation', 'zh-CN': '创世之柱' },
      config: {
        nebulaColor1: '#6b5b95',
        nebulaColor2: '#88d8b0',
        coreIntensity: 1.2,
        dustBandStrength: 0.8,
      },
    },
    {
      id: 'nebula_rose',
      name: { en: 'Rose Nebula', 'zh-CN': '玫瑰星云' },
      config: {
        nebulaColor1: '#ff6b6b',
        nebulaColor2: '#ffb6c1',
        coreIntensity: 2.0,
        coreSize: 0.3,
      },
    },
    {
      id: 'nebula_orion',
      name: { en: 'Orion Nebula', 'zh-CN': '猎户座大星云' },
      config: {
        nebulaColor1: '#00ced1',
        nebulaColor2: '#7fff00',
        coreIntensity: 2.5,
        gasCloudIntensity: 0.9,
      },
    },
    {
      id: 'nebula_butterfly',
      name: { en: 'Butterfly Nebula', 'zh-CN': '蝴蝶星云' },
      config: {
        nebulaColor1: '#9b59b6',
        nebulaColor2: '#e67e22',
        coreIntensity: 1.8,
        gasCloudScale: 1.5,
        cloudWarpStrength: 0.7,
      },
    },
    {
      id: 'nebula_cinematic',
      name: { en: 'Cinematic Deep Space', 'zh-CN': '电影深空' },
      config: {
        qualityMode: 'cinematic',
        nebulaColor1: '#1a1a2e',
        nebulaColor2: '#4a3f6b',
        coreIntensity: 2.0,
        lightRayStrength: 0.8,
        meteorStrength: 0.7,
      },
    },
    {
      id: 'nebula_aurora',
      name: { en: 'Aurora Nebula', 'zh-CN': '极光星云' },
      config: {
        nebulaColor1: '#00ff88',
        nebulaColor2: '#00ffcc',
        coreIntensity: 1.6,
        cloudWarpStrength: 0.9,
        speed: 0.8,
      },
    },
    {
      id: 'nebula_sunset',
      name: { en: 'Sunset Nebula', 'zh-CN': '日落星云' },
      config: {
        nebulaColor1: '#ff4500',
        nebulaColor2: '#ffd700',
        coreIntensity: 2.2,
        coreColor: '#ffeeaa',
        dustBandStrength: 0.3,
      },
    },
    {
      id: 'nebula_ocean',
      name: { en: 'Ocean Nebula', 'zh-CN': '海洋星云' },
      config: {
        nebulaColor1: '#0077b6',
        nebulaColor2: '#00b4d8',
        coreIntensity: 1.4,
        gasCloudIntensity: 0.9,
        dustBandStrength: 0.4,
      },
    },
  ],
}
