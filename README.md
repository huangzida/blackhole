# @bg-effects/blackhole

[English](./README.md) | [简体中文](./README_CN.md)

A high-performance blackhole background effect built with OGL and Vue.

[Live Demo](https://huangzida.github.io/blackhole/)

---

### Features

- 🚀 **High Performance**: Built with OGL (a lightweight WebGL library) for smooth rendering.
- 🎨 **Highly Customizable**: Adjustable mass, speed, color, lensing strength, disk properties, and starfield.
- 🛠️ **Debug Mode**: Built-in visual debug panel for real-time adjustments.
- 📦 **Ready to Use**: Easy-to-use Vue component with simple configuration.

### Installation

```bash
pnpm add @bg-effects/blackhole ogl
```

> **Note**: `ogl` is a peer dependency and needs to be installed manually.

### Usage

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

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `mass` | `number` | `1.0` | Mass of the black hole (affects size and gravity) |
| `speed` | `number` | `1.0` | Animation speed |
| `color` | `string` | `'#ff6600'` | Main color of the accretion disk |
| `positionX` | `number` | `0.5` | X position (0.0 to 1.0) |
| `positionY` | `number` | `0.5` | Y position (0.0 to 1.0) |
| `lensingStrength` | `number` | `0.8` | Gravitational lensing effect strength |
| `diskRadiusScale` | `number` | `1.0` | Accretion disk radius scale |
| `diskWidth` | `number` | `1.0` | Accretion disk width scale |
| `diskIntensity` | `number` | `2.0` | Accretion disk brightness intensity |
| `diskTilt` | `number` | `3.0` | Accretion disk tilt angle |
| `haloIntensity` | `number` | `0.5` | Halo brightness intensity |
| `starDensity` | `number` | `1.0` | Background starfield density |
| `twinkleStrength` | `number` | `1.0` | Star twinkling effect strength |
| `noiseStrength` | `number` | `0.35` | Accretion disk noise detail strength |
| `debug` | `boolean` | `false` | Enable debug panel |
| `lang` | `'zh-CN' \| 'en'` | `'zh-CN'` | UI language |
| `maxFps` | `number` | `60` | Maximum frames per second |

### Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### License

MIT
