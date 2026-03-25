<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { DebugShell } from '@bg-effects/debug-ui'
import { defu } from 'defu'
import { nebulaMeta } from './nebula-meta'
import type { NebulaEngineConfig, NebulaProps } from './types'
import { NebulaEngine } from './NebulaEngine'

const props = defineProps<NebulaProps>()

const config = ref<NebulaProps>(defu(props, nebulaMeta.defaultConfig) as NebulaProps)

watch(() => props, (newProps) => {
  if (!props.debug) {
    config.value = defu(newProps, nebulaMeta.defaultConfig) as NebulaProps
  }
}, { deep: true })

const containerRef = ref<HTMLElement | null>(null)
let engine: NebulaEngine | null = null

const engineInterface = computed(() => ({
  pause: () => engine?.pause(),
  resume: () => engine?.resume(),
  restart: () => engine?.restart(),
}))

const handleRandomize = () => {
  if (nebulaMeta.randomize) {
    const randomized = nebulaMeta.randomize(config.value)
    config.value = {
      ...randomized,
      debug: config.value.debug,
    }
  }
}

const effectiveConfig = computed(() => (props.debug ? config.value : props))

const resolveEngineConfig = (source: NebulaProps): NebulaEngineConfig => ({
  qualityMode: source.qualityMode ?? nebulaMeta.defaultConfig.qualityMode!,
  nebulaColor1: source.nebulaColor1 ?? nebulaMeta.defaultConfig.nebulaColor1!,
  nebulaColor2: source.nebulaColor2 ?? nebulaMeta.defaultConfig.nebulaColor2!,
  speed: source.speed ?? nebulaMeta.defaultConfig.speed!,
  turbulence: source.turbulence ?? nebulaMeta.defaultConfig.turbulence!,
  gasCloudIntensity: source.gasCloudIntensity ?? nebulaMeta.defaultConfig.gasCloudIntensity!,
  gasCloudScale: source.gasCloudScale ?? nebulaMeta.defaultConfig.gasCloudScale!,
  cloudWarpStrength: source.cloudWarpStrength ?? nebulaMeta.defaultConfig.cloudWarpStrength!,
  coreIntensity: source.coreIntensity ?? nebulaMeta.defaultConfig.coreIntensity!,
  coreSize: source.coreSize ?? nebulaMeta.defaultConfig.coreSize!,
  coreColor: source.coreColor ?? nebulaMeta.defaultConfig.coreColor!,
  lightRayStrength: source.lightRayStrength ?? nebulaMeta.defaultConfig.lightRayStrength!,
  lightRayCount: source.lightRayCount ?? nebulaMeta.defaultConfig.lightRayCount!,
  dustBandStrength: source.dustBandStrength ?? nebulaMeta.defaultConfig.dustBandStrength!,
  dustBandColor: source.dustBandColor ?? nebulaMeta.defaultConfig.dustBandColor!,
  dustFeatherEdge: source.dustFeatherEdge ?? nebulaMeta.defaultConfig.dustFeatherEdge!,
  starDensity: source.starDensity ?? nebulaMeta.defaultConfig.starDensity!,
  twinkleStrength: source.twinkleStrength ?? nebulaMeta.defaultConfig.twinkleStrength!,
  meteorStrength: source.meteorStrength ?? nebulaMeta.defaultConfig.meteorStrength!,
  meteorSpeed: source.meteorSpeed ?? nebulaMeta.defaultConfig.meteorSpeed!,
  foregroundStarIntensity: source.foregroundStarIntensity ?? nebulaMeta.defaultConfig.foregroundStarIntensity!,
})

watch(effectiveConfig, (newConfig) => {
  if (!engine) return
  engine.updateConfig(resolveEngineConfig(defu(newConfig, nebulaMeta.defaultConfig) as NebulaProps))
}, { deep: true })

onMounted(() => {
  if (!containerRef.value) return
  const resolved = defu(effectiveConfig.value, nebulaMeta.defaultConfig) as NebulaProps
  engine = new NebulaEngine(containerRef.value, resolveEngineConfig(resolved))
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
      :meta="nebulaMeta"
      :engine="engineInterface"
      @randomize="handleRandomize"
    />
  </div>
</template>
