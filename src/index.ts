import Blackhole from './Blackhole.vue'
import { meta as blackholeMeta } from './meta'
import Nebula from './Nebula.vue'
import { nebulaMeta } from './nebula-meta'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

export { Blackhole, Nebula }
export { blackholeMeta, nebulaMeta }

export const meta = {
  blackhole: blackholeMeta,
  nebula: nebulaMeta,
}

export type { BlackholeProps, BlackholeEngineConfig, NebulaProps, NebulaEngineConfig } from './types'

export const locales = {
  en,
  'zh-CN': zhCN,
}
