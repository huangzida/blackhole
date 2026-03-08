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
      return result
    }

    if (tab === 'lens') {
      result.lensingStrength = rand(0.2, 1.8)
      result.haloIntensity = rand(0.1, 1.4)
      return result
    }

    if (tab === 'stars') {
      result.starDensity = rand(0.0, 2.0)
      result.twinkleStrength = rand(0.0, 2.0)
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
  ],
}
