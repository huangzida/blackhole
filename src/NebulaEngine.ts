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

  get isPaused() {
    return this._isPaused
  }

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
        uSpeed: { value: this.config.speed },
        uTurbulence: { value: this.config.turbulence },
        uGasCloudIntensity: { value: this.config.gasCloudIntensity },
        uGasCloudScale: { value: this.config.gasCloudScale },
        uCloudWarpStrength: { value: this.config.cloudWarpStrength },
        uCoreIntensity: { value: this.config.coreIntensity },
        uCoreSize: { value: this.config.coreSize },
        uCoreColor: { value: new Color(this.config.coreColor) },
        uLightRayStrength: { value: this.config.lightRayStrength },
        uLightRayCount: { value: this.config.lightRayCount },
        uDustBandStrength: { value: this.config.dustBandStrength },
        uDustBandColor: { value: new Color(this.config.dustBandColor) },
        uDustFeatherEdge: { value: this.config.dustFeatherEdge },
        uStarDensity: { value: this.config.starDensity },
        uTwinkleStrength: { value: this.config.twinkleStrength },
        uMeteorStrength: { value: this.config.meteorStrength },
        uMeteorSpeed: { value: this.config.meteorSpeed },
        uForegroundStarIntensity: { value: this.config.foregroundStarIntensity },
        uQualityMode: { value: this.config.qualityMode === 'cinematic' ? 2 : (this.config.qualityMode === 'standard' ? 1 : 0) },
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

  private loop = (time: number) => {
    this.raf = requestAnimationFrame(this.loop)
    if (this.isDestroyed) return
    if (this._isPaused) return

    const rawSeconds = (time - this.t0 - this.pausedTime) * 0.001
    this.program.uniforms.uTime.value = rawSeconds
    this.renderer.render({ scene: this.mesh })
  }

  resize() {
    const width = Math.max(1, Math.floor(this.container.clientWidth))
    const height = Math.max(1, Math.floor(this.container.clientHeight))
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.renderer.setSize(width * dpr, height * dpr)
    this.gl.canvas.style.width = `${width}px`
    this.gl.canvas.style.height = `${height}px`
    this.program.uniforms.uResolution.value.set(this.gl.canvas.width, this.gl.canvas.height)
  }

  updateConfig(config: Partial<NebulaEngineConfig>) {
    this.config = { ...this.config, ...config }
    if (typeof this.config.nebulaColor1 === 'string')
      this.program.uniforms.uNebulaColor1.value.set(this.config.nebulaColor1)
    if (typeof this.config.nebulaColor2 === 'string')
      this.program.uniforms.uNebulaColor2.value.set(this.config.nebulaColor2)
    if (typeof this.config.speed === 'number')
      this.program.uniforms.uSpeed.value = this.config.speed
    if (typeof this.config.turbulence === 'number')
      this.program.uniforms.uTurbulence.value = this.config.turbulence
    if (typeof this.config.gasCloudIntensity === 'number')
      this.program.uniforms.uGasCloudIntensity.value = this.config.gasCloudIntensity
    if (typeof this.config.gasCloudScale === 'number')
      this.program.uniforms.uGasCloudScale.value = this.config.gasCloudScale
    if (typeof this.config.cloudWarpStrength === 'number')
      this.program.uniforms.uCloudWarpStrength.value = this.config.cloudWarpStrength
    if (typeof this.config.coreIntensity === 'number')
      this.program.uniforms.uCoreIntensity.value = this.config.coreIntensity
    if (typeof this.config.coreSize === 'number')
      this.program.uniforms.uCoreSize.value = this.config.coreSize
    if (typeof this.config.coreColor === 'string')
      this.program.uniforms.uCoreColor.value.set(this.config.coreColor)
    if (typeof this.config.lightRayStrength === 'number')
      this.program.uniforms.uLightRayStrength.value = this.config.lightRayStrength
    if (typeof this.config.lightRayCount === 'number')
      this.program.uniforms.uLightRayCount.value = this.config.lightRayCount
    if (typeof this.config.dustBandStrength === 'number')
      this.program.uniforms.uDustBandStrength.value = this.config.dustBandStrength
    if (typeof this.config.dustBandColor === 'string')
      this.program.uniforms.uDustBandColor.value.set(this.config.dustBandColor)
    if (typeof this.config.dustFeatherEdge === 'number')
      this.program.uniforms.uDustFeatherEdge.value = this.config.dustFeatherEdge
    if (typeof this.config.starDensity === 'number')
      this.program.uniforms.uStarDensity.value = this.config.starDensity
    if (typeof this.config.twinkleStrength === 'number')
      this.program.uniforms.uTwinkleStrength.value = this.config.twinkleStrength
    if (typeof this.config.meteorStrength === 'number')
      this.program.uniforms.uMeteorStrength.value = this.config.meteorStrength
    if (typeof this.config.meteorSpeed === 'number')
      this.program.uniforms.uMeteorSpeed.value = this.config.meteorSpeed
    if (typeof this.config.foregroundStarIntensity === 'number')
      this.program.uniforms.uForegroundStarIntensity.value = this.config.foregroundStarIntensity
    if (this.config.qualityMode)
      this.program.uniforms.uQualityMode.value = this.config.qualityMode === 'cinematic' ? 2 : (this.config.qualityMode === 'standard' ? 1 : 0)
  }

  pause() {
    if (!this._isPaused) {
      this._isPaused = true
      this.pauseStartTime = performance.now()
    }
  }

  resume() {
    if (this._isPaused) {
      this._isPaused = false
      this.pausedTime += performance.now() - this.pauseStartTime
    }
  }

  restart() {
    this.pausedTime = 0
    this.pauseStartTime = 0
    this.t0 = performance.now()
    this.lastFrameTime = 0
  }

  destroy() {
    this.isDestroyed = true
    if (this.raf) cancelAnimationFrame(this.raf)
    if (this.ro) this.ro.disconnect()
    if (this.container?.contains(this.gl.canvas))
      this.container.removeChild(this.gl.canvas)
    this.gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
