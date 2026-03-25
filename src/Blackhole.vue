<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { DebugShell } from '@bg-effects/debug-ui'
import { defu } from 'defu'
import { meta } from './meta'
import type { BlackholeEngineConfig, BlackholeProps } from './types'
import { BlackholeEngine } from './engine/BlackholeEngine'
import ConfigPanel from './ui/ConfigPanel.vue'

const props = defineProps<BlackholeProps>()

const config = ref<BlackholeProps>(defu(props, meta.defaultConfig) as BlackholeProps)
const internalLang = ref<'zh-CN' | 'en'>(config.value.lang || 'zh-CN')

watch(() => props, (newProps) => {
  if (!props.debug) {
    config.value = defu(newProps, meta.defaultConfig) as BlackholeProps
  }
}, { deep: true })

const containerRef = ref<HTMLElement | null>(null)
const configPanelRef = ref<any>(null)
let engine: BlackholeEngine | null = null

const engineInterface = computed(() => ({
  pause: () => engine?.pause(),
  resume: () => engine?.resume(),
  restart: () => engine?.restart(),
}))

const handleRandomize = () => {
  if (meta.randomize) {
    const currentTab = configPanelRef.value?.activeTab
    const tabValue = typeof currentTab === 'object' && currentTab?.value ? currentTab.value : currentTab
    const randomized = meta.randomize(config.value, tabValue)
    config.value = {
      ...randomized,
      debug: config.value.debug,
      lang: config.value.lang,
    }
  }
}

const effectiveConfig = computed(() => (props.debug ? config.value : props))

const resolveEngineConfig = (source: BlackholeProps): BlackholeEngineConfig => ({
  color: source.color ?? meta.defaultConfig.color,
  speed: source.speed ?? meta.defaultConfig.speed,
  mass: source.mass ?? meta.defaultConfig.mass,
  positionX: source.positionX ?? meta.defaultConfig.positionX,
  positionY: source.positionY ?? meta.defaultConfig.positionY,
  lensingStrength: source.lensingStrength ?? meta.defaultConfig.lensingStrength,
  diskRadiusScale: source.diskRadiusScale ?? meta.defaultConfig.diskRadiusScale,
  diskWidth: source.diskWidth ?? meta.defaultConfig.diskWidth,
  diskIntensity: source.diskIntensity ?? meta.defaultConfig.diskIntensity,
  diskTilt: source.diskTilt ?? meta.defaultConfig.diskTilt,
  haloIntensity: source.haloIntensity ?? meta.defaultConfig.haloIntensity,
  starDensity: source.starDensity ?? meta.defaultConfig.starDensity,
  twinkleStrength: source.twinkleStrength ?? meta.defaultConfig.twinkleStrength,
  noiseStrength: source.noiseStrength ?? meta.defaultConfig.noiseStrength,
  maxFps: source.maxFps ?? meta.defaultConfig.maxFps,
  brightness: source.brightness ?? meta.defaultConfig.brightness,
  auroraStrength: source.auroraStrength ?? meta.defaultConfig.auroraStrength,
  temperatureGradient: source.temperatureGradient ?? meta.defaultConfig.temperatureGradient,
  dopplerEffect: source.dopplerEffect ?? meta.defaultConfig.dopplerEffect,
  photonSphereIntensity: source.photonSphereIntensity ?? meta.defaultConfig.photonSphereIntensity,
  coreDepthEffect: source.coreDepthEffect ?? meta.defaultConfig.coreDepthEffect,
  einsteinRingStrength: source.einsteinRingStrength ?? meta.defaultConfig.einsteinRingStrength,
  secondaryImage: source.secondaryImage ?? meta.defaultConfig.secondaryImage,
  lensDetail: source.lensDetail ?? meta.defaultConfig.lensDetail,
  accretionFlowStrength: source.accretionFlowStrength ?? meta.defaultConfig.accretionFlowStrength,
  accretionFlowCount: source.accretionFlowCount ?? meta.defaultConfig.accretionFlowCount,
  jetIntensity: source.jetIntensity ?? meta.defaultConfig.jetIntensity,
  jetColor: source.jetColor ?? meta.defaultConfig.jetColor,
  jetWidth: source.jetWidth ?? meta.defaultConfig.jetWidth,
  bloomStrength: source.bloomStrength ?? meta.defaultConfig.bloomStrength,
  chromaticAberration: source.chromaticAberration ?? meta.defaultConfig.chromaticAberration,
  vignetteStrength: source.vignetteStrength ?? meta.defaultConfig.vignetteStrength,
  filmGrain: source.filmGrain ?? meta.defaultConfig.filmGrain,
  qualityMode: source.qualityMode ?? meta.defaultConfig.qualityMode,
})

watch(effectiveConfig, (newConfig) => {
  if (!engine) return
  engine.updateConfig(resolveEngineConfig(defu(newConfig, meta.defaultConfig) as BlackholeProps))
}, { deep: true })

onMounted(() => {
  if (!containerRef.value) return
  const resolved = defu(effectiveConfig.value, meta.defaultConfig) as BlackholeProps
  engine = new BlackholeEngine(containerRef.value, resolveEngineConfig(resolved))
})

onUnmounted(() => {
  engine?.destroy()
  engine = null
})
</script>

<template>
  <div ref="containerRef" :class="['relative w-full h-full overflow-hidden', className]">
    <DebugShell
      v-if="debug"
      v-model:config="config"
      v-model:lang="internalLang"
      :meta="meta"
      :engine="engineInterface"
      @randomize="handleRandomize"
    >
      <template #settings>
        <ConfigPanel ref="configPanelRef" v-model:config="config" :lang="internalLang" />
      </template>
    </DebugShell>
  </div>
</template>
