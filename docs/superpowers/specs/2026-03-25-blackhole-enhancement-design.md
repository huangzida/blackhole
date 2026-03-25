# 黑洞效果增强设计方案

## 设计目标

打造一个高端、可配置的黑洞视觉效果库，采用混合架构（5 层叠加），支持三种预设模式（性能/标准/电影）。

## 技术架构

### 5 层效果叠加

```
┌─────────────────────────────────────────────────────┐
│  Layer 5: 后期处理 (Bloom + Chromatic Aberration)   │
├─────────────────────────────────────────────────────┤
│  Layer 4: 粒子系统 (吸积流 + 两极喷射流)            │
├─────────────────────────────────────────────────────┤
│  Layer 3: 引力透镜 (光线偏折 + 爱因斯坦环)          │
├─────────────────────────────────────────────────────┤
│  Layer 2: 3D 黑洞核心 (Event Horizon + Photon Sphere) │
├─────────────────────────────────────────────────────┤
│  Layer 1: 增强吸积盘 (多层 + 极光 + 温度梯度)       │
└─────────────────────────────────────────────────────┘
```

### 实现方案：单 Shader 架构

**理由**：
- 一次渲染完成所有效果，性能最优（单次 draw call）
- 与现有架构兼容性好
- 参数管理统一
- 适合层叠式效果

## 各层详细设计

### Layer 1: 增强吸积盘

**现有功能**：
- 单层 spiral 螺旋结构
- 基础 turbulence 噪声
- 固定温度颜色混合

**新增功能**：
- 多层吸积盘（内圈热、外圈冷）
- 极光效果（垂直方向的波动光带）
- Doppler 效应模拟（靠近观测者侧更亮）
- 更丰富的 FBM 噪声细节

**保留参数**：color, speed, diskRadiusScale, diskWidth, diskIntensity, diskTilt, noiseStrength

**新增参数**：
- `auroraStrength`: 极光效果强度（0-1，默认 0.5）
- `temperatureGradient`: 内热外冷梯度强度（0-1，默认 0.7）
- `dopplerEffect`: 多普勒效应强度（0-1，默认 0.3）

### Layer 2: 3D 黑洞核心

**现有功能**：
- 2D 平滑边缘的事件视界

**新增功能**：
- Event Horizon 3D 可视化
- Photon Sphere（光子球）边缘的光环
- Schwarzschild 半径可视化
- 3D 深度感（基于视线方向的变形）

**保留参数**：mass, positionX, positionY

**新增参数**：
- `photonSphereIntensity`: 光子球强度（0-1，默认 0.8）
- `coreDepthEffect`: 核心深度效果（0-1，默认 0.6）

### Layer 3: 引力透镜

**现有功能**：
- 简单的 UV 扭曲

**新增功能**：
- 更物理准确的 Schwarzschild 度规光线偏折
- Einstein Ring（爱因斯坦环）特效
- 背景星空的透镜扭曲
- Secondary Image（次级图像）效果

**保留参数**：lensingStrength, haloIntensity

**新增参数**：
- `einsteinRingStrength`: 爱因斯坦环强度（0-1，默认 0.5）
- `secondaryImage`: 次级图像强度（0-1，默认 0.3）
- `lensDetail`: 透镜细节层次（1-3，默认 2）

### Layer 4: 粒子系统

**新增功能**：
- 吸积流粒子（从外向黑洞坠落的轨迹）
- 两极相对论性喷射流（Relativistic Jets）
- 粒子与吸积盘的交互

**新增参数**：
- `accretionFlowStrength`: 吸积流强度（0-1，默认 0.5）
- `accretionFlowCount`: 吸积流数量（3-12，默认 6）
- `jetIntensity`: 喷射流强度（0-2，默认 1.0）
- `jetColor`: 喷射流颜色（默认 #4fc3f7 青色）
- `jetWidth`: 喷射流宽度（0.01-0.1，默认 0.03）

### Layer 5: 后期处理

**新增功能**：
- Bloom（辉光）效果
- Chromatic Aberration（色差）
- Vignette（暗角）
- Film Grain（胶片颗粒）

**新增参数**：
- `bloomStrength`: Bloom 强度（0-1，默认 0.5）
- `chromaticAberration`: 色差强度（0-0.02，默认 0.005）
- `vignetteStrength`: 暗角强度（0-1，默认 0.3）
- `filmGrain`: 胶片颗粒强度（0-1，默认 0.1）

## 质量模式系统

| 模式 | 启用层数 | 渲染分辨率 | FBM 噪声层数 | 粒子数量 |
|------|---------|-----------|-------------|---------|
| performance | 2（吸积盘+透镜）| 0.5x | 3 | 0 |
| standard | 4（关闭粒子）| 0.75x | 4 | 0 |
| cinematic | 全部 5 层 | 1.0x | 6 | 全部 |

**新增参数**：
- `qualityMode`: 'performance' | 'standard' | 'cinematic'（默认 'standard'）

## 新增预设

```typescript
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
}
```

## 文件变更

### 修改文件
- `src/engine/shaders/fragment.glsl` - 重构为主 shader，整合所有层
- `src/engine/BlackholeEngine.ts` - 添加新 uniform 和质量模式逻辑
- `src/types.ts` - 添加新参数类型定义
- `src/meta.ts` - 添加新预设
- `src/ui/ConfigPanel.vue` - 添加新 UI 控件

### 新增文件
- 无（单 shader 架构无需新增文件）

## 性能考虑

1. **Shader 复杂度控制**：
   - FBM 噪声限制在 6 层以内
   - Ray marching 步数限制在 64 步
   - 粒子效果在 shader 内用简单数学函数模拟

2. **渲染优化**：
   - 使用 `smoothstep` 替代 `if` 分支
   - 避免动态数组，使用固定循环
   - 利用 `mix` 函数减少分支

3. **质量降级**：
   - 低质量模式下自动降低渲染分辨率
   - 禁用部分计算密集型效果

## API 兼容性

- 保留所有现有参数
- 新参数全部可选，有合理默认值
- 现有预设保持不变
- 向后兼容，无破坏性变更
