import { Color, Mesh, Program, Renderer, Triangle, Vec2 } from 'ogl'
import { defu } from 'defu'
import { meta } from '../meta'
import type { BlackholeEngineConfig } from '../types'
import vertexShader from './shaders/vertex.glsl?raw'
import fragmentShader from './shaders/fragment.glsl?raw'

export class BlackholeEngine {
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
  private config: BlackholeEngineConfig
  private lastFrameTime = 0

  get isPaused() {
    return this._isPaused
  }

  constructor(container: HTMLElement, config: BlackholeEngineConfig) {
    this.container = container
    this.config = defu(config, meta.defaultConfig) as BlackholeEngineConfig

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
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2(0, 0) },
        uColor: { value: new Color(this.config.color) },
        uSpeed: { value: this.config.speed },
        uMass: { value: this.config.mass },
        uOffset: { value: new Vec2(this.config.positionX, this.config.positionY) },
        uLensingStrength: { value: this.config.lensingStrength },
        uDiskIntensity: { value: this.config.diskIntensity },
        uDiskRadiusScale: { value: this.config.diskRadiusScale },
        uDiskWidth: { value: this.config.diskWidth },
        uDiskTilt: { value: this.config.diskTilt },
        uHaloIntensity: { value: this.config.haloIntensity },
        uStarDensity: { value: this.config.starDensity },
        uTwinkleStrength: { value: this.config.twinkleStrength },
        uNoiseStrength: { value: this.config.noiseStrength },
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

    const maxFps = Math.max(1, this.config.maxFps || 60)
    const frameInterval = 1000 / maxFps
    if (this.lastFrameTime && time - this.lastFrameTime < frameInterval) return
    this.lastFrameTime = time

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

  updateConfig(config: Partial<BlackholeEngineConfig>) {
    this.config = { ...this.config, ...config }
    if (typeof this.config.color === 'string')
      this.program.uniforms.uColor.value.set(this.config.color)
    if (typeof this.config.speed === 'number')
      this.program.uniforms.uSpeed.value = this.config.speed
    if (typeof this.config.mass === 'number')
      this.program.uniforms.uMass.value = this.config.mass
    if (typeof this.config.positionX === 'number' && typeof this.config.positionY === 'number')
      this.program.uniforms.uOffset.value.set(this.config.positionX, this.config.positionY)
    if (typeof this.config.lensingStrength === 'number')
      this.program.uniforms.uLensingStrength.value = this.config.lensingStrength
    if (typeof this.config.diskIntensity === 'number')
      this.program.uniforms.uDiskIntensity.value = this.config.diskIntensity
    if (typeof this.config.diskRadiusScale === 'number')
      this.program.uniforms.uDiskRadiusScale.value = this.config.diskRadiusScale
    if (typeof this.config.diskWidth === 'number')
      this.program.uniforms.uDiskWidth.value = this.config.diskWidth
    if (typeof this.config.diskTilt === 'number')
      this.program.uniforms.uDiskTilt.value = this.config.diskTilt
    if (typeof this.config.haloIntensity === 'number')
      this.program.uniforms.uHaloIntensity.value = this.config.haloIntensity
    if (typeof this.config.starDensity === 'number')
      this.program.uniforms.uStarDensity.value = this.config.starDensity
    if (typeof this.config.twinkleStrength === 'number')
      this.program.uniforms.uTwinkleStrength.value = this.config.twinkleStrength
    if (typeof this.config.noiseStrength === 'number')
      this.program.uniforms.uNoiseStrength.value = this.config.noiseStrength
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
