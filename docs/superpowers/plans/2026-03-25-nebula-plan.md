# 星云效果组件实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建一个独立的梦幻风格星云效果组件，包含气体云层、发光核心、尘埃带和星星，支持三种质量模式

**Architecture:** 单 Shader 架构，所有效果在 fragment shader 中分层叠加，通过 uniform 参数控制各层开关和质量模式

**Tech Stack:** GLSL, WebGL2, OGL, Vue 3, TypeScript

---

## 文件结构

| 文件 | 职责 | 变更类型 |
|------|------|---------|
| `src/Nebula.vue` | Vue 组件入口 | 新建 |
| `src/NebulaEngine.ts` | WebGL 引擎 | 新建 |
| `src/shaders/nebula-fragment.glsl` | 星云 fragment shader | 新建 |
| `src/types.ts` | 添加 Nebula 类型定义 | 修改 |
| `src/meta.ts` | 添加星云配置和预设 | 修改 |
| `src/index.ts` | 导出 Nebula 组件 | 修改 |
| `src/locales/*.json` | 添加国际化文本 | 修改 |

---

## 任务分解

### Phase 1: 类型和配置层

#### Task 1: 添加 Nebula 类型定义

**Files:**
- Modify: `src/types.ts`

- [ ] **Step 1: 添加 Nebula 类型定义**

```typescript
// 添加 NebulaQualityMode 类型
export type NebulaQualityMode = 'performance' | 'standard' | 'cinematic'

// 添加 NebulaProps 接口
export interface NebulaProps {
  className?: string
  lang?: 'zh-CN' | 'en'
  debug?: boolean

  qualityMode?: NebulaQualityMode
  nebulaColor1?: string
  nebulaColor2?: string
  speed?: number
  turbulence?: number

  gasCloudIntensity?: number
  gasCloudScale?: number
  cloudWarpStrength?: number

  coreIntensity?: number
  coreSize?: number
  coreColor?: string
  lightRayStrength?: number
  lightRayCount?: number

  dustBandStrength?: number
  dustBandColor?: string
  dustFeatherEdge?: number

  starDensity?: number
  twinkleStrength?: number
  meteorStrength?: number
  meteorSpeed?: number
  foregroundStarIntensity?: number
}

// 添加 NebulaEngineConfig 接口
export interface NebulaEngineConfig extends Omit<NebulaProps, 'className' | 'lang' | 'debug'> {
  qualityMode: NebulaQualityMode
  // 所有其他参数为必需
}
```

- [ ] **Step 2: 验证类型编译**

Run: `npm run typecheck`

---

#### Task 2: 创建 Nebula 配置元数据

**Files:**
- Create: `src/nebula-meta.ts` (或添加到现有 meta.ts)

- [ ] **Step 1: 创建 nebula-meta.ts**

```typescript
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
      return result
    }

    // ... 其他 tab 的 randomize 逻辑
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
  ],
}
```

---

### Phase 2: Shader 层（核心）

#### Task 3: 创建星云 Fragment Shader

**Files:**
- Create: `src/engine/shaders/nebula-fragment.glsl`

- [ ] **Step 1: 创建基础框架**

```glsl
#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uNebulaColor1;
uniform vec3 uNebulaColor2;
uniform float uSpeed;
uniform float uTurbulence;
uniform float uGasCloudIntensity;
uniform float uGasCloudScale;
uniform float uCloudWarpStrength;
uniform float uCoreIntensity;
uniform float uCoreSize;
uniform vec3 uCoreColor;
uniform float uLightRayStrength;
uniform int uLightRayCount;
uniform float uDustBandStrength;
uniform vec3 uDustBandColor;
uniform float uDustFeatherEdge;
uniform float uStarDensity;
uniform float uTwinkleStrength;
uniform float uMeteorStrength;
uniform float uMeteorSpeed;
uniform float uForegroundStarIntensity;
uniform int uQualityMode;

in vec2 vUv;
out vec4 fragColor;

// Helper functions
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p, int octaves) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 6; i++) {
    if (i >= octaves) break;
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}
```

- [ ] **Step 2: 添加 Domain Warping 函数**

```glsl
vec2 warp(vec2 p, float strength) {
  float n1 = fbm(p + vec2(0.0, 0.0), 3);
  float n2 = fbm(p + vec2(5.2, 1.3), 3);
  return p + vec2(n1, n2) * strength;
}
```

- [ ] **Step 3: 添加 Voronoi 函数**

```glsl
vec2 voronoi(vec2 p) {
  vec2 n = floor(p);
  vec2 f = fract(p);

  float minDist = 1.0;
  float secondDist = 1.0;

  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 neighbor = vec2(float(i), float(j));
      vec2 point = hash(n + neighbor) * vec2(0.5) + 0.25;
      vec2 diff = neighbor + point - f;
      float dist = length(diff);

      if (dist < minDist) {
        secondDist = minDist;
        minDist = dist;
      } else if (dist < secondDist) {
        secondDist = dist;
      }
    }
  }

  return vec2(minDist, secondDist);
}
```

- [ ] **Step 4: 添加光芒射线函数**

```glsl
float lightRay(vec2 uv, int count, float intensity) {
  float angle = atan(uv.y, uv.x);
  float ray = sin(angle * float(count)) * 0.5 + 0.5;
  return ray * intensity * exp(-length(uv) * 2.0);
}
```

- [ ] **Step 5: 添加流星函数**

```glsl
float meteor(vec2 uv, float speed, float seed) {
  float t = uTime * speed * 0.5;
  float meteorY = fract(t * 0.3 + seed) * 2.0 - 0.5;
  float meteorX = fract(t * 0.8 + seed * 2.0) * 2.0 - 0.5;

  vec2 meteorPos = vec2(meteorX, meteorY);
  float tail = smoothstep(0.3, 0.0, abs(uv.x - meteorX)) * smoothstep(meteorY, meteorY - 0.3, uv.y);
  float head = exp(-length(uv - meteorPos) * 50.0);

  return (tail + head) * 0.5;
}
```

- [ ] **Step 6: 添加星星函数**

```glsl
float stars(vec2 uv, float density, float twinkle) {
  float starGridScale = 60.0 * max(0.1, density);
  vec2 starGrid = uv * starGridScale;
  vec2 ipos = floor(starGrid);
  vec2 fpos = fract(starGrid);
  float sHash = hash(ipos);

  float threshold = clamp(0.97 - 0.03 * density, 0.9, 0.995);
  if (sHash > threshold) {
    float twinkleVal = (sin(uTime * 1.5 + sHash * 6.28) * 0.5 + 0.5);
    twinkleVal = mix(1.0, twinkleVal, clamp(twinkle, 0.0, 2.0));
    vec2 p = fpos - 0.5;
    float d = length(p);
    float core = smoothstep(0.02 * sHash, 0.0, d);
    return core * twinkleVal;
  }
  return 0.0;
}
```

- [ ] **Step 7: 编写 main() 函数**

```glsl
void main() {
  int quality = uQualityMode; // 0=perf, 1=std, 2=cinematic
  int fbmOctaves = 3 + quality;
  bool enableCore = quality >= 1;
  bool enableDust = quality >= 1;
  bool enableMeteor = quality >= 2;
  bool enableLightRays = quality >= 2;

  vec2 uv = vUv - 0.5;
  float dist = length(uv);
  float angle = atan(uv.y, uv.x);
  float t = uTime * uSpeed;

  // Layer 1: 基础渐变
  float gradient = 1.0 - dist * 1.5;
  gradient = max(0.0, gradient);
  vec3 baseColor = mix(uNebulaColor1, uNebulaColor2, gradient);

  // Layer 2: 气体云
  vec2 cloudUv = uv * uGasCloudScale;
  cloudUv = warp(cloudUv + t * 0.05, uCloudWarpStrength * uTurbulence);
  float cloud = fbm(cloudUv * 3.0, fbmOctaves);
  cloud = pow(cloud, 1.5) * uGasCloudIntensity;
  vec3 cloudColor = baseColor * cloud;

  // Layer 3: 核心光芒
  vec3 coreColor = vec3(0.0);
  if (enableCore) {
    float coreGlow = exp(-dist * dist / (uCoreSize * uCoreSize)) * uCoreIntensity;
    float coreRay = lightRay(uv, uLightRayCount, uLightRayStrength);
    coreColor = uCoreColor * (coreGlow + coreRay * 0.5);
  }

  // Layer 4: 尘埃带
  vec3 dustColor = vec3(0.0);
  if (enableDust) {
    vec2 dustUv = uv * 2.0;
    vec2 vor = voronoi(dustUv + t * 0.02);
    float dust = smoothstep(0.05, 0.3, vor.y - vor.x) * uDustBandStrength;
    dustColor = uDustBandColor * dust;
  }

  // Layer 5: 星星
  float starField = stars(uv, uStarDensity, uTwinkleStrength);
  starField *= uForegroundStarIntensity;

  float meteors = 0.0;
  if (enableMeteor) {
    meteors += meteor(uv, uMeteorSpeed, 0.1) * uMeteorStrength;
    meteors += meteor(uv, uMeteorSpeed * 1.3, 0.7) * uMeteorStrength * 0.7;
  }

  // 合成所有层
  vec3 finalColor = cloudColor;
  finalColor = mix(finalColor, coreColor, min(1.0, length(coreColor)));
  finalColor = mix(finalColor, dustColor, uDustBandStrength);
  finalColor += vec3(starField);
  finalColor += vec3(meteors);

  // 整体辉光
  float glow = exp(-dist * 3.0) * 0.3;
  finalColor += baseColor * glow;

  fragColor = vec4(finalColor, 1.0);
}
```

- [ ] **Step 8: 测试 shader 编译**

Run: `npm run build`

---

### Phase 3: Engine 层

#### Task 4: 创建 NebulaEngine

**Files:**
- Create: `src/NebulaEngine.ts`

- [ ] **Step 1: 创建 NebulaEngine 类**

参考 `BlackholeEngine.ts` 的结构：

```typescript
import { Color, Mesh, Program, Renderer, Triangle, Vec2 } from 'ogl'
import { defu } from 'defu'
import { nebulaMeta } from './nebula-meta'
import type { NebulaEngineConfig } from './types'
import vertexShader from './engine/shaders/vertex.glsl?raw'
import nebulaFragmentShader from './engine/shaders/nebula-fragment.glsl?raw'

export class NebulaEngine {
  renderer: Renderer
  gl: any
  program: Program
  mesh: Mesh
  raf: number = 0
  container: HTMLElement
  private isDestroyed = false
  private ro?: ResizeObserver
  private t0: number = performance.now()
  private _isPaused = false
  private pausedTime = 0
  private pauseStartTime = 0
  private config: NebulaEngineConfig
  private lastFrameTime = 0

  constructor(container: HTMLElement, config: NebulaEngineConfig) {
    this.container = container
    this.config = defu(config, nebulaMeta.defaultConfig) as NebulaEngineConfig

    this.renderer = new Renderer({
      webgl: 2,
      alpha: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    })
    this.gl = this.renderer.gl
    this.gl.clearColor(0, 0, 0, 0)
    this.container.appendChild(this.gl.canvas)

    const geometry = new Triangle(this.gl)
    this.program = new Program(this.gl, {
      vertex: vertexShader,
      fragment: nebulaFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2(0, 0) },
        uNebulaColor1: { value: new Color(this.config.nebulaColor1) },
        uNebulaColor2: { value: new Color(this.config.nebulaColor2) },
        // ... 所有其他 uniform
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    })

    this.mesh = new Mesh(this.gl, { geometry, program: this.program })

    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(this.container)
    this.resize()

    this.loop(this.t0)
  }

  // loop, resize, updateConfig, pause, resume, restart, destroy 方法...
}
```

---

### Phase 4: Vue 组件层

#### Task 5: 创建 Nebula Vue 组件

**Files:**
- Create: `src/Nebula.vue`

- [ ] **Step 1: 创建 Vue 组件**

参考 `Blackhole.vue` 的结构：

```vue
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { nebulaMeta } from './nebula-meta'
import type { NebulaEngineConfig, NebulaProps } from './types'
import { NebulaEngine } from './NebulaEngine'
import NebulaConfigPanel from './ui/NebulaConfigPanel.vue'

const props = defineProps<NebulaProps>()
// ... 实现逻辑参考 Blackhole.vue
</script>

<template>
  <div ref="containerRef" :class="['relative w-full h-full overflow-hidden', className]">
    <!-- 配置面板 -->
  </div>
</template>
```

---

### Phase 5: 导出和集成

#### Task 6: 更新入口文件

**Files:**
- Modify: `src/index.ts`

- [ ] **Step 1: 添加 Nebula 导出**

```typescript
import Blackhole from './Blackhole.vue'
import { meta as blackholeMeta } from './meta'
import Nebula from './Nebula.vue'
import { nebulaMeta } from './nebula-meta'

export { Blackhole, Nebula }
export const meta = {
  blackhole: blackholeMeta,
  nebula: nebulaMeta,
}
export type { BlackholeProps, BlackholeEngineConfig } from './types'
export type { NebulaProps, NebulaEngineConfig } from './types'
```

---

## 测试计划

### 功能测试

- [ ] 星云颜色渐变正确显示
- [ ] 气体云流动动画正常
- [ ] 核心光芒效果可见
- [ ] 尘埃带效果正常
- [ ] 星星闪烁效果正常
- [ ] 流星效果在 cinematic 模式下可见
- [ ] 三种质量模式切换正常

### 性能测试

- [ ] performance 模式：60fps 稳定
- [ ] standard 模式：30fps+ 流畅
- [ ] cinematic 模式：桌面端 30fps+

### 预设测试

- [ ] 所有预设正常加载
- [ ] randomize 功能正常

---

## 提交策略

建议分阶段提交：

1. **feat: add nebula types** - Task 1
2. **feat: add nebula meta config** - Task 2
3. **feat: create nebula shader** - Task 3
4. **feat: create nebula engine** - Task 4
5. **feat: create nebula vue component** - Task 5
6. **feat: export nebula component** - Task 6

---
