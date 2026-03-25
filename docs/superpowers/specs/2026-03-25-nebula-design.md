# 星云效果组件设计方案

## 设计目标

创建一个独立的、梦幻风格的星云效果组件 `NebulaEffect`，包含气体云层、发光核心、尘埃带和星星，支持三种质量模式。

## 技术架构

### 5 层效果叠加

```
┌─────────────────────────────────────────────────────┐
│  Layer 5: 星空层 (星星 + 流星)                     │
├─────────────────────────────────────────────────────┤
│  Layer 4: 尘埃带层 (黑暗尘埃云)                    │
├─────────────────────────────────────────────────────┤
│  Layer 3: 核心光芒层 (明亮核心 + 光芒射线)          │
├─────────────────────────────────────────────────────┤
│  Layer 2: 气体云层 (彩色FBM噪声 + 涡旋)            │
├─────────────────────────────────────────────────────┤
│  Layer 1: 基础颜色渐变                             │
└─────────────────────────────────────────────────────┘
```

### 实现方案：单 Shader 架构

**理由**：
- 一次渲染完成所有效果，性能最优
- 与现有黑洞组件架构一致
- 参数管理统一
- 适合层叠式效果

## 质量模式系统

| 模式 | 气体云 | 核心光芒 | 尘埃带 | 星星 | FBM 层数 | 光芒射线 |
|------|--------|----------|--------|------|----------|----------|
| performance | ✅ 简化 | ❌ | ❌ | ✅ | 3 | ❌ |
| standard | ✅ | ✅ | ✅ | ✅ | 4 | ❌ |
| cinematic | ✅ 增强 | ✅ | ✅ | ✅ + 流星 | 6 | ✅ |

**新增参数**：
- `qualityMode`: 'performance' | 'standard' | 'cinematic'（默认 'standard'）

## 各层详细设计

### Layer 1: 基础颜色渐变

**功能**：
- 从中心向外的颜色渐变
- 支持两种主色调混合

**新增参数**：
- `nebulaColor1`: 星云主色调（默认 '#ff6b9d' 粉红色）
- `nebulaColor2`: 星云次色调（默认 '#4ecdc4' 青色）

### Layer 2: 气体云层

**功能**：
- 多层 FBM 噪声生成有机气体云纹理
- Domain Warping 创建涡旋效果
- 动态流动动画
- 发光边缘

**保留参数**：speed, turbulence

**新增参数**：
- `gasCloudIntensity`: 气体云强度（0-1，默认 0.8）
- `gasCloudScale`: 气体云缩放（0.5-3，默认 1.0）
- `cloudWarpStrength`: 扭曲强度（0-1，默认 0.5）

### Layer 3: 核心光芒层

**功能**：
- 明亮的核心区域
- 向外辐射的光芒
- 光晕效果
- 光芒射线（cinematic 模式）

**新增参数**：
- `coreIntensity`: 核心亮度（0-3，默认 1.5）
- `coreSize`: 核心大小（0.1-0.5，默认 0.25）
- `coreColor`: 核心颜色（默认 '#ffffff' 白色）
- `lightRayStrength`: 光芒射线强度（0-1，默认 0.5，cinematic 模式）
- `lightRayCount`: 光芒数量（4-12，默认 8，cinematic 模式）

### Layer 4: 尘埃带层

**功能**：
- 暗色的尘埃带穿过明亮星云
- Voronoi 边缘细节
- 羽毛状边缘效果

**新增参数**：
- `dustBandStrength`: 尘埃带强度（0-1，默认 0.6）
- `dustBandColor`: 尘埃颜色（默认 '#1a1a2e' 深蓝色）
- `dustFeatherEdge`: 羽毛边缘强度（0-1，默认 0.3）

### Layer 5: 星空层

**功能**：
- 前景星星（更亮更大）
- 背景星星（小而密集）
- 星星闪烁效果
- 流星效果（cinematic 模式）
- 与黑洞的星空系统保持一致

**保留参数**：starDensity, twinkleStrength

**新增参数**：
- `meteorStrength`: 流星强度（0-1，默认 0.5，cinematic 模式）
- `meteorSpeed`: 流星速度（0.5-3，默认 1.0）
- `foregroundStarIntensity`: 前景星星亮度（0-1，默认 0.8）

## 预设主题

```typescript
{
  id: 'nebula_pillars',
  name: { en: 'Pillars of Creation', 'zh-CN': '创世之柱' },
  config: {
    nebulaColor1: '#6b5b95',  // 蓝紫色
    nebulaColor2: '#88d8b0',  // 绿色
    coreIntensity: 1.2,
    dustBandStrength: 0.8,
  },
},
{
  id: 'nebula_rose',
  name: { en: 'Rose Nebula', 'zh-CN': '玫瑰星云' },
  config: {
    nebulaColor1: '#ff6b6b',  // 红色
    nebulaColor2: '#ffb6c1',  // 粉红色
    coreIntensity: 2.0,
    coreSize: 0.3,
  },
},
{
  id: 'nebula_orion',
  name: { en: 'Orion Nebula', 'zh-CN': '猎户座大星云' },
  config: {
    nebulaColor1: '#00ced1',  // 青色
    nebulaColor2: '#7fff00',  // 黄绿色
    coreIntensity: 2.5,
    gasCloudIntensity: 0.9,
  },
},
{
  id: 'nebula_butterfly',
  name: { en: 'Butterfly Nebula', 'zh-CN': '蝴蝶星云' },
  config: {
    nebulaColor1: '#9b59b6',  // 紫红色
    nebulaColor2: '#e67e22',  // 橙色
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
```

## 文件结构

```
src/
├── Nebula.vue                    # Vue 组件入口
├── NebulaEngine.ts              # WebGL 引擎
├── shaders/
│   ├── nebula-fragment.glsl    # 星云 fragment shader
│   └── vertex.glsl            # 顶点 shader（复用黑洞的）
├── types.ts                     # 类型定义
├── meta.ts                      # 配置元数据
└── ui/
    └── NebulaConfigPanel.vue   # 配置面板
```

## 类型定义

```typescript
export type NebulaQualityMode = 'performance' | 'standard' | 'cinematic'

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

export interface NebulaEngineConfig extends Omit<NebulaProps, 'className' | 'lang' | 'debug'> {
  qualityMode: NebulaQualityMode
  // 所有其他参数为必需
}
```

## Shader 技术实现

### FBM 噪声（分形布朗运动）

使用 shader-dev 技能的 procedural-noise 技术：
```glsl
float fbm(vec2 p, int octaves) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < octaves; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}
```

### Domain Warping（域扭曲）

创建涡旋效果：
```glsl
vec2 warp(vec2 p, float strength) {
  float n1 = fbm(p + vec2(0.0, 0.0), 3);
  float n2 = fbm(p + vec2(5.2, 1.3), 3);
  return p + vec2(n1, n2) * strength;
}
```

### 光芒射线

使用 ray casting 技术：
```glsl
float lightRay(vec2 uv, float count, float intensity) {
  float angle = atan(uv.y, uv.x);
  float ray = sin(angle * count) * 0.5 + 0.5;
  return ray * intensity * exp(-length(uv) * 2.0);
}
```

### Voronoi 尘埃带

使用 voronoi-cellular-noise 技术生成尘埃边缘。

## API 兼容性

- 独立的 Nebula 组件，与 Blackhole 组件解耦
- 可以单独使用，也可以与 Blackhole 组合
- 统一的参数命名风格
- 支持国际化（i18n）

## 性能考虑

1. **Shader 复杂度控制**：
   - FBM 噪声限制在 6 层以内
   - 光线追踪限制在 cinematic 模式
   - 使用 `smoothstep` 替代 `if` 分支

2. **渲染优化**：
   - 单次 draw call 完成所有效果
   - 利用 `mix` 函数减少分支
   - 避免动态数组

3. **质量降级**：
   - 低质量模式下自动减少计算
   - 禁用光线追踪等重效果

## 导出和使用

```typescript
// src/index.ts
import Nebula from './Nebula.vue'
import { meta } from './meta'

export { Nebula, meta }
export type { NebulaProps, NebulaEngineConfig } from './types'
```

```vue
<!-- 使用示例 -->
<Nebula
  :qualityMode="'cinematic'"
  :nebulaColor1="'#9b59b6'"
  :nebulaColor2="'#e67e22'"
  :coreIntensity="1.8"
/>
```
