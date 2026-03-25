# 黑洞效果增强实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将黑洞效果升级为 5 层混合架构（吸积盘+3D核心+引力透镜+粒子系统+后期处理），支持性能/标准/电影三种质量模式

**Architecture:** 单 Shader 架构，所有效果在 fragment.glsl 中分层叠加，通过 uniform 参数控制各层开关和质量模式

**Tech Stack:** GLSL, WebGL2, OGL, Vue 3, TypeScript

---

## 文件变更概览

| 文件 | 职责 | 变更类型 |
|------|------|---------|
| `src/types.ts` | 新参数类型定义 | 修改 |
| `src/meta.ts` | 新预设和 randomize | 修改 |
| `src/engine/BlackholeEngine.ts` | 新 uniform 绑定 | 修改 |
| `src/engine/shaders/fragment.glsl` | 核心 shader 重构 | 修改 |
| `src/ui/ConfigPanel.vue` | 新 UI 控件 | 修改 |

---

## 任务分解

### Phase 1: 类型和配置层（基础）

#### Task 1: 更新类型定义

**Files:**
- Modify: `src/types.ts`

- [ ] **Step 1: 添加新类型和接口**

```typescript
// 添加质量模式类型
export type QualityMode = 'performance' | 'standard' | 'cinematic'

// 在 BlackholeProps 中添加新参数
export interface BlackholeProps {
  // ... 现有参数保持不变 ...
  
  // Layer 1: 增强吸积盘
  auroraStrength?: number        // 极光效果强度 0-1
  temperatureGradient?: number    // 温度梯度强度 0-1
  dopplerEffect?: number        // 多普勒效应 0-1
  
  // Layer 2: 3D 黑洞核心
  photonSphereIntensity?: number // 光子球强度 0-1
  coreDepthEffect?: number       // 核心深度效果 0-1
  
  // Layer 3: 引力透镜
  einsteinRingStrength?: number  // 爱因斯坦环强度 0-1
  secondaryImage?: number        // 次级图像强度 0-1
  lensDetail?: number            // 透镜细节层次 1-3
  
  // Layer 4: 粒子系统
  accretionFlowStrength?: number  // 吸积流强度 0-1
  accretionFlowCount?: number      // 吸积流数量 3-12
  jetIntensity?: number            // 喷射流强度 0-2
  jetColor?: string               // 喷射流颜色
  jetWidth?: number               // 喷射流宽度
  
  // Layer 5: 后期处理
  bloomStrength?: number         // Bloom 强度 0-1
  chromaticAberration?: number   // 色差强度 0-0.02
  vignetteStrength?: number      // 暗角强度 0-1
  filmGrain?: number             // 胶片颗粒 0-1
  
  // 质量模式
  qualityMode?: QualityMode
}

// 同步更新 BlackholeEngineConfig
export interface BlackholeEngineConfig extends Omit<BlackholeProps, 'debug' | 'lang' | 'className'> {
  // 所有可选参数变为必需，带默认值
  qualityMode: QualityMode
  // ... 其他参数
}
```

- [ ] **Step 2: 验证类型编译**

Run: `npm run typecheck` 或检查 IDE 是否有类型错误

---

#### Task 2: 更新元数据配置

**Files:**
- Modify: `src/meta.ts:14-31` (defaultConfig 部分)
- Modify: `src/meta.ts:87-169` (presets 部分)

- [ ] **Step 1: 更新 defaultConfig 添加新参数默认值**

```typescript
defaultConfig: {
  // 现有参数保持
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
  
  // 新增参数默认值
  qualityMode: 'standard',
  
  // Layer 1
  auroraStrength: 0.5,
  temperatureGradient: 0.7,
  dopplerEffect: 0.3,
  
  // Layer 2
  photonSphereIntensity: 0.8,
  coreDepthEffect: 0.6,
  
  // Layer 3
  einsteinRingStrength: 0.5,
  secondaryImage: 0.3,
  lensDetail: 2,
  
  // Layer 4
  accretionFlowStrength: 0.5,
  accretionFlowCount: 6,
  jetIntensity: 1.0,
  jetColor: '#4fc3f7',
  jetWidth: 0.03,
  
  // Layer 5
  bloomStrength: 0.5,
  chromaticAberration: 0.005,
  vignetteStrength: 0.3,
  filmGrain: 0.1,
},
```

- [ ] **Step 2: 更新 randomize 函数支持新参数**

在 `randomize` 函数的各 tab 分支中添加新参数的随机化

- [ ] **Step 3: 添加新预设**

在 presets 数组末尾添加三个新预设：
- `blackhole_cinematic_pro` - 电影增强版
- `blackhole_relativistic` - 相对论（强喷射流）
- `blackhole_aurora` - 极光黑洞

- [ ] **Step 4: 验证配置正确性**

Run: `npm run build` 检查是否有编译错误

---

### Phase 2: Shader 层（核心）

#### Task 3: 重构 Fragment Shader

**Files:**
- Modify: `src/engine/shaders/fragment.glsl`

这是核心任务，分步骤重构：

- [ ] **Step 1: 添加新 uniform 声明**

在文件开头现有 uniform 之后添加：

```glsl
// Layer 1: 增强吸积盘
uniform float uAuroraStrength;
uniform float uTemperatureGradient;
uniform float uDopplerEffect;

// Layer 2: 3D 黑洞核心
uniform float uPhotonSphereIntensity;
uniform float uCoreDepthEffect;

// Layer 3: 引力透镜
uniform float uEinsteinRingStrength;
uniform float uSecondaryImage;
uniform int uLensDetail;

// Layer 4: 粒子系统
uniform float uAccretionFlowStrength;
uniform int uAccretionFlowCount;
uniform float uJetIntensity;
uniform vec3 uJetColor;
uniform float uJetWidth;

// Layer 5: 后期处理
uniform float uBloomStrength;
uniform float uChromaticAberration;
uniform float uVignetteStrength;
uniform float uFilmGrain;

// 质量模式 (通过 #define 控制)
uniform int uQualityMode; // 0=performance, 1=standard, 2=cinematic
```

- [ ] **Step 2: 添加辅助函数**

在文件顶部 hash 函数之后添加：

```glsl
// 改进版噪声函数
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

// FBM 函数（支持可变层数）
float fbm(vec2 p, int octaves) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  
  for (int i = 0; i < 6; i++) {
    if (i >= octaves) break;
    value += amplitude * noise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

// 极光效果函数
float aurora(vec2 uv, float time, float intensity) {
  float wave = sin(uv.x * 8.0 + time * 0.5) * 0.5 + 0.5;
  wave *= sin(uv.x * 3.0 - time * 0.3) * 0.5 + 0.5;
  float vertical = exp(-abs(uv.y) * 4.0) * intensity;
  return wave * vertical;
}

// 爱因斯坦环函数
float einsteinRing(float dist, float radius, float strength, float time) {
  float ring = exp(-pow((dist - radius) * 20.0, 2.0));
  float flicker = sin(time * 2.0) * 0.1 + 0.9;
  return ring * strength * flicker;
}

// 吸积流粒子
float accretionParticle(vec2 uv, float angle, float time, float id) {
  float streamAngle = angle + id * 6.283 / float(uAccretionFlowCount);
  vec2 dir = vec2(cos(streamAngle), sin(streamAngle));
  float radialDist = length(uv);
  
  // 螺旋轨迹
  float spiral = sin(angle * 3.0 - radialDist * 15.0 + time * 2.0 + id);
  
  // 粒子点
  float particleDist = fract(radialDist * 5.0 - time * 0.5 + id * 0.3);
  float particle = smoothstep(0.08, 0.0, abs(particleDist - 0.5));
  
  return particle * spiral * smoothstep(0.8, 0.1, radialDist);
}

// 喷射流函数
float jet(vec2 uv, float time, float width, float intensity) {
  float jet = 0.0;
  
  // 上喷射流
  float topDist = abs(uv.x);
  float topLen = max(0.0, uv.y);
  float topWave = sin(uv.y * 10.0 - time * 3.0) * 0.1;
  topDist = abs(uv.x + topWave);
  jet += smoothstep(width, 0.0, topDist) * smoothstep(0.0, 0.1, topLen) * exp(-topLen * 2.0);
  
  // 下喷射流
  float bottomLen = max(0.0, -uv.y);
  float bottomWave = sin(-uv.y * 10.0 - time * 3.0) * 0.1;
  bottomDist = abs(uv.x + bottomWave);
  jet += smoothstep(width, 0.0, bottomDist) * smoothstep(0.0, 0.1, bottomLen) * exp(-bottomLen * 2.0);
  
  return jet * intensity;
}

// 多普勒效应
float dopplerShift(vec2 uv, float angle, float strength) {
  float radial = dot(normalize(uv), vec2(cos(angle), sin(angle)));
  return 1.0 + radial * strength;
}

// Bloom 近似
vec3 bloom(vec3 color, float strength) {
  float luminance = dot(color, vec3(0.299, 0.587, 0.114));
  vec3 bloomColor = color * smoothstep(0.5, 1.5, luminance) * strength;
  return color + bloomColor;
}
```

- [ ] **Step 3: 重构 main() 函数，整合所有层**

将现有 main() 替换为分层渲染架构：

```glsl
void main() {
  // 质量模式判断
  int quality = uQualityMode; // 0=perf, 1=std, 2=cinematic
  
  // 根据质量模式设置参数
  int fbmOctaves = 3 + quality;
  bool enableParticles = quality >= 2;
  bool enableBloom = quality >= 1;
  float renderScale = quality == 0 ? 0.5 : (quality == 1 ? 0.75 : 1.0);
  
  // 基础设置
  float aspect = uResolution.x / uResolution.y;
  vec2 center = uOffset;
  vec2 uv = (vUv - center) * vec2(aspect, 1.0);
  float t = uTime * uSpeed;
  
  float dist = length(uv);
  float angle = atan(uv.y, uv.x);
  
  // === Layer 1: 吸积盘 ===
  float horizon = 0.1 * uMass;
  float diskRadius = 0.25 * uMass * max(0.0, uDiskRadiusScale);
  float diskY = uv.y * uDiskTilt;
  float diskDist = length(vec2(uv.x, diskY));
  
  // 基础螺旋
  float spiral = sin(diskDist * 20.0 - angle - t * 2.0);
  float diskMask = smoothstep(diskRadius, horizon, diskDist) * smoothstep(horizon - 0.05 * max(0.0, uDiskWidth), horizon, diskDist);
  
  // 多层噪声
  float turb = fbm(uv * 40.0 + vec2(t * 0.05, t * 0.03), fbmOctaves);
  diskMask *= pow(0.5 + 0.5 * (spiral + (turb - 0.5) * uNoiseStrength * 1.2), 2.0);
  
  // 极光效果
  float auroraEffect = aurora(vec2(diskDist, angle), t, uAuroraStrength);
  diskMask += auroraEffect * 0.3;
  
  // 温度梯度
  float heat = exp(-diskDist * 3.5);
  heat = mix(heat, pow(heat, 0.5), uTemperatureGradient);
  
  // 多普勒效应
  float doppler = dopplerShift(uv, angle, uDopplerEffect);
  
  // 颜色计算
  vec3 hotColor = mix(uColor, vec3(1.0, 0.92, 0.85), clamp(heat * 1.2, 0.0, 1.0));
  vec3 diskCol = hotColor * diskMask * uDiskIntensity * doppler;
  
  // === Layer 2: 3D 黑洞核心 ===
  float blackHole = smoothstep(horizon, horizon + 0.005, dist);
  
  // 光子球
  float photonSphere = exp(-abs(dist - horizon * 1.5) * 30.0) * uPhotonSphereIntensity;
  vec3 photonCol = vec3(1.0, 0.9, 0.7) * photonSphere * 2.0;
  
  // 核心深度效果
  float depthEffect = sin(dist * 50.0 - t * 5.0) * 0.5 + 0.5;
  depthEffect *= smoothstep(horizon * 2.0, horizon, dist) * uCoreDepthEffect;
  vec3 depthCol = uColor * depthEffect * 0.5;
  
  // === Layer 3: 引力透镜 ===
  float lens = uLensingStrength * uMass;
  vec2 warpedUv = uv + (uv / (dist * dist + 0.06)) * lens * 0.03;
  
  // 爱因斯坦环
  float ring = einsteinRing(dist, horizon * 1.3, uEinsteinRingStrength, t);
  vec3 ringCol = uColor * ring * 3.0;
  
  // 次级图像
  vec2 secondaryUv = uv - (uv / (dist * dist + 0.03)) * lens * 0.02;
  float secondaryMask = smoothstep(horizon + 0.02, horizon, length(secondaryUv)) * uSecondaryImage;
  vec3 secondaryCol = vec3(0.5, 0.3, 0.2) * secondaryMask;
  
  // === Layer 4: 粒子系统 ===
  vec3 particleCol = vec3(0.0);
  if (enableParticles) {
    // 吸积流
    float flowParticles = 0.0;
    for (int i = 0; i < 12; i++) {
      if (i >= uAccretionFlowCount) break;
      flowParticles += accretionParticle(uv, angle, t, float(i));
    }
    particleCol += uColor * flowParticles * uAccretionFlowStrength;
    
    // 喷射流
    float jetEffect = jet(uv, t, uJetWidth, uJetIntensity);
    particleCol += uJetColor * jetEffect;
  }
  
  // === Layer 5: 后期处理 ===
  vec3 finalCol = diskCol + photonCol + depthCol + ringCol + secondaryCol + particleCol;
  finalCol *= blackHole;
  
  // 星空（保留现有逻辑，优化细节）
  float starGridScale = 40.0 * max(0.05, uStarDensity);
  vec2 starGrid = (vUv + warpedUv * 0.015) * starGridScale;
  vec2 ipos = floor(starGrid);
  vec2 fpos = fract(starGrid);
  float sHash = hash(ipos);
  
  float stars = 0.0;
  float threshold = clamp(0.98 - 0.04 * uStarDensity, 0.88, 0.995);
  if (sHash > threshold) {
    float twinkle = (sin(uTime * 1.5 + sHash * 6.28) * 0.5 + 0.5);
    twinkle = mix(1.0, twinkle, clamp(uTwinkleStrength, 0.0, 2.0));
    vec2 p = fpos - 0.5;
    float d = length(p);
    
    float core = smoothstep(0.03 * sHash, 0.0, d);
    
    float flare = 0.0;
    if (sHash > threshold + 0.03) {
      float beamX = smoothstep(0.012, 0.0, abs(p.x)) * smoothstep(0.4, 0.0, abs(p.y));
      float beamY = smoothstep(0.012, 0.0, abs(p.y)) * smoothstep(0.4, 0.0, abs(p.x));
      flare = (beamX + beamY) * 0.5 * sHash;
    }
    
    stars = (core + flare) * twinkle;
  }
  
  float sparkle = pow(hash(vUv * (600.0 * max(0.2, uStarDensity))), 100.0) * 0.35 * (sin(uTime * 3.0 + hash(vUv) * 10.0) * 0.5 + 0.5);
  sparkle *= mix(1.0, 1.8, clamp(uTwinkleStrength * 0.5, 0.0, 1.0));
  
  float finalStars = (stars + sparkle) * blackHole;
  finalCol += vec3(finalStars);
  
  // Bloom
  if (enableBloom) {
    finalCol = bloom(finalCol, uBloomStrength);
  }
  
  // 色差
  if (uChromaticAberration > 0.0) {
    vec2 dir = normalize(uv) * uChromaticAberration;
    // 简化版色差：直接偏移颜色分量
    finalCol.r *= 1.0 + dot(dir, vec2(1.0, 0.0)) * 0.5;
    finalCol.b *= 1.0 - dot(dir, vec2(1.0, 0.0)) * 0.5;
  }
  
  // 暗角
  float vignette = 1.0 - length(vUv - 0.5) * uVignetteStrength * 2.0;
  finalCol *= clamp(vignette, 0.0, 1.0);
  
  // 胶片颗粒
  if (uFilmGrain > 0.0) {
    float grain = hash(vUv * 1000.0 + uTime) * 2.0 - 1.0;
    finalCol += grain * uFilmGrain * 0.1;
  }
  
  // 最终输出
  fragColor = vec4(finalCol, 1.0);
}
```

- [ ] **Step 4: 测试 shader 编译**

Run: `npm run build` 检查 WebGL shader 编译是否有错误

---

### Phase 3: Engine 层（绑定）

#### Task 4: 更新 BlackholeEngine

**Files:**
- Modify: `src/engine/BlackholeEngine.ts:45-65` (uniforms 部分)
- Modify: `src/engine/BlackholeEngine.ts:101-129` (updateConfig 部分)

- [ ] **Step 1: 添加新 uniform 声明**

在 program 创建时添加所有新参数的 uniform 绑定：

```typescript
uniforms: {
  // 现有 uniforms...
  uTime: { value: 0 },
  uResolution: { value: new Vec2(0, 0) },
  uColor: { value: new Color(this.config.color) },
  // ... 保留所有现有 uniform ...
  
  // Layer 1
  uAuroraStrength: { value: this.config.auroraStrength },
  uTemperatureGradient: { value: this.config.temperatureGradient },
  uDopplerEffect: { value: this.config.dopplerEffect },
  
  // Layer 2
  uPhotonSphereIntensity: { value: this.config.photonSphereIntensity },
  uCoreDepthEffect: { value: this.config.coreDepthEffect },
  
  // Layer 3
  uEinsteinRingStrength: { value: this.config.einsteinRingStrength },
  uSecondaryImage: { value: this.config.secondaryImage },
  uLensDetail: { value: this.config.lensDetail },
  
  // Layer 4
  uAccretionFlowStrength: { value: this.config.accretionFlowStrength },
  uAccretionFlowCount: { value: this.config.accretionFlowCount },
  uJetIntensity: { value: this.config.jetIntensity },
  uJetColor: { value: new Color(this.config.jetColor) },
  uJetWidth: { value: this.config.jetWidth },
  
  // Layer 5
  uBloomStrength: { value: this.config.bloomStrength },
  uChromaticAberration: { value: this.config.chromaticAberration },
  uVignetteStrength: { value: this.config.vignetteStrength },
  uFilmGrain: { value: this.config.filmGrain },
  
  // 质量模式
  uQualityMode: { value: this.config.qualityMode === 'cinematic' ? 2 : (this.config.qualityMode === 'standard' ? 1 : 0) },
},
```

- [ ] **Step 2: 更新 updateConfig 方法**

添加所有新参数的更新逻辑（参考现有的 speed、mass 等参数的处理方式）

- [ ] **Step 3: 更新 resolveEngineConfig**

在 `Blackhole.vue` 的 `resolveEngineConfig` 函数中添加新参数的映射

---

### Phase 4: UI 层（可选，优化体验）

#### Task 5: 更新 ConfigPanel（可选）

**Files:**
- Modify: `src/ui/ConfigPanel.vue`

- [ ] **Step 1: 添加质量模式选择器**

在 UI 中添加质量模式下拉选择器

- [ ] **Step 2: 添加新参数控件**

为新参数添加滑块控件，按层分组

---

## 测试计划

### 功能测试

- [ ] 吸积盘多层效果可见
- [ ] 光子球光环效果可见
- [ ] 爱因斯坦环在强透镜模式下可见
- [ ] 喷射流在电影模式下可见
- [ ] Bloom 效果增强发光感
- [ ] 三种质量模式切换正常

### 性能测试

- [ ] 性能模式：60fps 稳定
- [ ] 标准模式：30fps+ 流畅
- [ ] 电影模式：桌面端 30fps+

### 兼容性测试

- [ ] 现有预设正常工作
- [ ] randomize 功能包含新参数
- [ ] API 向后兼容

---

## 提交策略

建议分阶段提交：

1. **chore: update types and config** - Task 1, 2
2. **feat: refactor fragment shader** - Task 3
3. **feat: update engine uniforms** - Task 4
4. **feat: add quality modes** - Task 4 续
5. **feat: enhance UI controls** - Task 5（可选）

---
