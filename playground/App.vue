<script setup lang="ts">
import { ref } from 'vue'
import { Blackhole, Nebula } from '../src/index'

const showBlackhole = ref(true)
const showNebula = ref(true)
</script>

<template>
  <div class="playground">
    <div class="effect-layer nebula-layer" v-if="showNebula">
      <Nebula :qualityMode="'cinematic'" />
    </div>
    <div class="effect-layer blackhole-layer" v-if="showBlackhole">
      <Blackhole debug />
    </div>
    <div class="controls">
      <button @click="showNebula = !showNebula" :class="{ active: showNebula }">
        星云 {{ showNebula ? '✓' : '' }}
      </button>
      <button @click="showBlackhole = !showBlackhole" :class="{ active: showBlackhole }">
        黑洞 {{ showBlackhole ? '✓' : '' }}
      </button>
    </div>
  </div>
</template>

<style>
.playground {
  width: 100vw;
  height: 100vh;
  position: relative;
  background: #000;
  overflow: hidden;
}

.effect-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.blackhole-layer {
  z-index: 2;
}

.nebula-layer {
  z-index: 1;
}

.controls {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 100;
}

.controls button {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  backdrop-filter: blur(4px);
  transition: all 0.2s;
}

.controls button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.controls button.active {
  background: rgba(100, 200, 255, 0.3);
  border-color: rgba(100, 200, 255, 0.6);
}
</style>
