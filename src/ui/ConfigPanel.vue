<script setup lang="ts">
import { computed, ref } from 'vue'
import { ColorPicker, Slider, SubTabs } from '@bg-effects/shared'
import en from '../locales/en.json'
import zhCN from '../locales/zh-CN.json'
import type { BlackholeProps } from '../types'

const props = defineProps<{
  lang?: 'zh-CN' | 'en'
}>()

const config = defineModel<BlackholeProps>('config', { required: true })

const activeTab = ref<'basic' | 'disk' | 'lens' | 'stars'>('basic')

defineExpose({
  activeTab,
})

const i18n: Record<string, any> = {
  en,
  'zh-CN': zhCN,
}

const t = (path: string) => {
  const dict = i18n[props.lang || 'zh-CN']
  return path.split('.').reduce((obj: any, key) => obj?.[key], dict) || path
}

interface SubTabItem {
  id: string
  label: string
}

const subTabs = computed((): SubTabItem[] => [
  { id: 'basic', label: t('tabs.basic') },
  { id: 'disk', label: t('tabs.disk') },
  { id: 'lens', label: t('tabs.lens') },
  { id: 'stars', label: t('tabs.stars') },
])

const speedLabel = computed(() => t('labels.speed'))
const massLabel = computed(() => t('labels.mass'))
const posXLabel = computed(() => t('labels.positionX'))
const posYLabel = computed(() => t('labels.positionY'))
const colorLabel = computed(() => t('labels.color'))
const lensingLabel = computed(() => t('labels.lensingStrength'))
const diskRadiusScaleLabel = computed(() => t('labels.diskRadiusScale'))
const diskWidthLabel = computed(() => t('labels.diskWidth'))
const diskIntensityLabel = computed(() => t('labels.diskIntensity'))
const diskTiltLabel = computed(() => t('labels.diskTilt'))
const haloIntensityLabel = computed(() => t('labels.haloIntensity'))
const starDensityLabel = computed(() => t('labels.starDensity'))
const twinkleLabel = computed(() => t('labels.twinkleStrength'))
const noiseLabel = computed(() => t('labels.noiseStrength'))
const maxFpsLabel = computed(() => t('labels.maxFps'))
</script>

<template>
  <div class="flex flex-col gap-6 text-white/90">
    <SubTabs v-model="activeTab" :tabs="subTabs" />
    <div class="flex flex-col gap-6 p-1 pointer-events-auto overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
      <template v-if="activeTab === 'basic'">
        <Slider
          v-model="config.mass"
          :label="massLabel"
          :min="0.5"
          :max="3"
          :step="0.1"
        />
        <Slider
          v-model="config.positionX"
          :label="posXLabel"
          :min="0"
          :max="1"
          :step="0.01"
        />
        <Slider
          v-model="config.positionY"
          :label="posYLabel"
          :min="0"
          :max="1"
          :step="0.01"
        />
        <Slider
          v-model="config.speed"
          :label="speedLabel"
          :min="0.1"
          :max="3"
          :step="0.1"
        />
        <Slider
          v-model="config.maxFps"
          :label="maxFpsLabel"
          :min="15"
          :max="120"
          :step="1"
        />
      </template>

      <template v-if="activeTab === 'disk'">
        <ColorPicker
          v-model="config.color"
          :label="colorLabel"
        />
        <Slider
          v-model="config.diskRadiusScale"
          :label="diskRadiusScaleLabel"
          :min="0.4"
          :max="2.2"
          :step="0.05"
        />
        <Slider
          v-model="config.diskWidth"
          :label="diskWidthLabel"
          :min="0.2"
          :max="2.5"
          :step="0.05"
        />
        <Slider
          v-model="config.diskIntensity"
          :label="diskIntensityLabel"
          :min="0"
          :max="3"
          :step="0.05"
        />
        <Slider
          v-model="config.diskTilt"
          :label="diskTiltLabel"
          :min="1"
          :max="6"
          :step="0.05"
        />
        <Slider
          v-model="config.noiseStrength"
          :label="noiseLabel"
          :min="0"
          :max="1"
          :step="0.02"
        />
      </template>

      <template v-if="activeTab === 'lens'">
        <Slider
          v-model="config.lensingStrength"
          :label="lensingLabel"
          :min="0"
          :max="2"
          :step="0.05"
        />
        <Slider
          v-model="config.haloIntensity"
          :label="haloIntensityLabel"
          :min="0"
          :max="2"
          :step="0.05"
        />
      </template>

      <template v-if="activeTab === 'stars'">
        <Slider
          v-model="config.starDensity"
          :label="starDensityLabel"
          :min="0"
          :max="2"
          :step="0.05"
        />
        <Slider
          v-model="config.twinkleStrength"
          :label="twinkleLabel"
          :min="0"
          :max="2"
          :step="0.05"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
