import Blackhole from './Blackhole.vue'
import { meta } from './meta'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

export { Blackhole, meta }
export type { BlackholeProps, BlackholeEngineConfig } from './types'

export const locales = {
  en,
  'zh-CN': zhCN,
}
