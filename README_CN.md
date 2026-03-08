# @bg-effects/blackhole

[English](./README.md) | [简体中文](./README_CN.md)

基于 OGL 和 Vue 构建的高性能黑洞背景特效。

[在线演示](https://huangzida.github.io/blackhole/)

---

### 特性

- 🚀 **高性能**: 基于 OGL (轻量级 WebGL 库) 构建，运行流畅。
- 🎨 **高度可定制**: 可调节质量、速度、颜色、引力透镜强度、吸积盘属性及星空背景。
- 🛠️ **调试模式**: 内置可视化调试面板，方便实时调整效果。
- 📦 **开箱即用**: 作为 Vue 组件，简单配置即可使用。

### 安装

```bash
pnpm add @bg-effects/blackhole ogl
```

> **注意**: `ogl` 是 peer dependency，需要手动安装。

### 使用

```vue
<script setup>
import { Blackhole } from '@bg-effects/blackhole'
import '@bg-effects/blackhole/dist/index.css'
</script>

<template>
  <div style="width: 100vw; height: 100vh; background: #000;">
    <Blackhole 
      :mass="1.2"
      :speed="1.0"
      color="#ff6600"
      :position-x="0.5"
      :position-y="0.5"
    />
  </div>
</template>
```

### 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `mass` | `number` | `1.0` | 黑洞质量（影响大小和引力效果） |
| `speed` | `number` | `1.0` | 动画速度 |
| `color` | `string` | `'#ff6600'` | 吸积盘主颜色 |
| `positionX` | `number` | `0.5` | 水平位置 (0.0 到 1.0) |
| `positionY` | `number` | `0.5` | 垂直位置 (0.0 到 1.0) |
| `lensingStrength` | `number` | `0.8` | 引力透镜效应强度 |
| `diskRadiusScale` | `number` | `1.0` | 吸积盘半径缩放 |
| `diskWidth` | `number` | `1.0` | 吸积盘宽度缩放 |
| `diskIntensity` | `number` | `2.0` | 吸积盘亮度强度 |
| `diskTilt` | `number` | `3.0` | 吸积盘倾斜角度 |
| `haloIntensity` | `number` | `0.5` | 光晕亮度强度 |
| `starDensity` | `number` | `1.0` | 背景星空密度 |
| `twinkleStrength` | `number` | `1.0` | 星星闪烁强度 |
| `noiseStrength` | `number` | `0.35` | 吸积盘噪声细节强度 |
| `debug` | `boolean` | `false` | 是否开启调试面板 |
| `lang` | `'zh-CN' \| 'en'` | `'zh-CN'` | 界面语言 |
| `maxFps` | `number` | `60` | 最大帧率限制 |

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发环境
pnpm dev
```

### 许可

MIT
