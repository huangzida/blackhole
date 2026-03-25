#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColor;
uniform float uSpeed;
uniform float uMass;
uniform vec2 uOffset;
uniform float uLensingStrength;
uniform float uDiskIntensity;
uniform float uDiskRadiusScale;
uniform float uDiskWidth;
uniform float uDiskTilt;
uniform float uHaloIntensity;
uniform float uStarDensity;
uniform float uTwinkleStrength;
uniform float uNoiseStrength;
uniform float uBrightness;

uniform float uAuroraStrength;
uniform float uTemperatureGradient;
uniform float uDopplerEffect;

uniform float uPhotonSphereIntensity;
uniform float uCoreDepthEffect;

uniform float uEinsteinRingStrength;
uniform float uSecondaryImage;
uniform int uLensDetail;

uniform float uAccretionFlowStrength;
uniform int uAccretionFlowCount;
uniform float uJetIntensity;
uniform vec3 uJetColor;
uniform float uJetWidth;

uniform float uBloomStrength;
uniform float uChromaticAberration;
uniform float uVignetteStrength;
uniform float uFilmGrain;

uniform int uQualityMode;

in vec2 vUv;
out vec4 fragColor;

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
  float frequency = 1.0;

  for (int i = 0; i < 6; i++) {
    if (i >= octaves) break;
    value += amplitude * noise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

float aurora(vec2 uv, float time, float intensity) {
  float wave = sin(uv.x * 8.0 + time * 0.5) * 0.5 + 0.5;
  wave *= sin(uv.x * 3.0 - time * 0.3) * 0.5 + 0.5;
  float vertical = exp(-abs(uv.y) * 4.0) * intensity;
  return wave * vertical;
}

float einsteinRing(float dist, float radius, float strength, float time) {
  float ring = exp(-pow((dist - radius) * 20.0, 2.0));
  float flicker = sin(time * 2.0) * 0.1 + 0.9;
  return ring * strength * flicker;
}

float accretionParticle(vec2 uv, float angle, float time, float id) {
  float streamAngle = angle + id * 6.283 / float(uAccretionFlowCount);
  vec2 dir = vec2(cos(streamAngle), sin(streamAngle));
  float radialDist = length(uv);

  float spiral = sin(angle * 3.0 - radialDist * 15.0 + time * 2.0 + id);

  float particleDist = fract(radialDist * 5.0 - time * 0.5 + id * 0.3);
  float particle = smoothstep(0.08, 0.0, abs(particleDist - 0.5));

  return particle * spiral * smoothstep(0.8, 0.1, radialDist);
}

float jet(vec2 uv, float time, float width, float intensity) {
  float jet = 0.0;

  float topDist = abs(uv.x);
  float topLen = max(0.0, uv.y);
  float topWave = sin(uv.y * 10.0 - time * 3.0) * 0.1;
  topDist = abs(uv.x + topWave);
  jet += smoothstep(width, 0.0, topDist) * smoothstep(0.0, 0.1, topLen) * exp(-topLen * 2.0);

  float bottomLen = max(0.0, -uv.y);
  float bottomWave = sin(-uv.y * 10.0 - time * 3.0) * 0.1;
  float bottomDist = abs(uv.x + bottomWave);
  jet += smoothstep(width, 0.0, bottomDist) * smoothstep(0.0, 0.1, bottomLen) * exp(-bottomLen * 2.0);

  return jet * intensity;
}

float dopplerShift(vec2 uv, float angle, float strength) {
  float radial = dot(normalize(uv), vec2(cos(angle), sin(angle)));
  return 1.0 + radial * strength;
}

vec3 bloom(vec3 color, float strength) {
  float luminance = dot(color, vec3(0.299, 0.587, 0.114));
  vec3 bloomColor = color * smoothstep(0.5, 1.5, luminance) * strength;
  return color + bloomColor;
}

void main() {
  int quality = uQualityMode;

  int fbmOctaves = 3 + quality;
  bool enableParticles = quality >= 2;
  bool enableBloom = quality >= 1;

  float aspect = uResolution.x / uResolution.y;
  vec2 center = uOffset;
  vec2 uv = (vUv - center) * vec2(aspect, 1.0);
  float t = uTime * uSpeed;

  float dist = length(uv);
  float angle = atan(uv.y, uv.x);

  float horizon = 0.1 * uMass;
  float diskRadius = 0.25 * uMass * max(0.0, uDiskRadiusScale);
  float diskY = uv.y * uDiskTilt;
  float diskDist = length(vec2(uv.x, diskY));

  float spiral = sin(diskDist * 20.0 - angle - t * 2.0);
  float diskMask = smoothstep(diskRadius, horizon, diskDist) * smoothstep(horizon - 0.05 * max(0.0, uDiskWidth), horizon, diskDist);

  float turb = fbm(uv * 40.0 + vec2(t * 0.05, t * 0.03), fbmOctaves);
  diskMask *= pow(0.5 + 0.5 * (spiral + (turb - 0.5) * uNoiseStrength * 1.2), 2.0);

  float auroraEffect = aurora(vec2(diskDist, angle), t, uAuroraStrength);
  diskMask += auroraEffect * 0.3;

  float heat = exp(-diskDist * 3.5);
  heat = mix(heat, pow(heat, 0.5), uTemperatureGradient);

  float doppler = dopplerShift(uv, angle, uDopplerEffect);

  vec3 hotColor = mix(uColor, vec3(1.0, 0.92, 0.85), clamp(heat * 1.2, 0.0, 1.0));
  vec3 diskCol = hotColor * diskMask * uDiskIntensity * doppler;

  float blackHole = smoothstep(horizon, horizon + 0.005, dist);

  float photonSphere = exp(-abs(dist - horizon * 1.5) * 30.0) * uPhotonSphereIntensity;
  vec3 photonCol = vec3(1.0, 0.9, 0.7) * photonSphere * 2.0;

  float depthEffect = sin(dist * 50.0 - t * 5.0) * 0.5 + 0.5;
  depthEffect *= smoothstep(horizon * 2.0, horizon, dist) * uCoreDepthEffect;
  vec3 depthCol = uColor * depthEffect * 0.5;

  float lens = uLensingStrength * uMass;
  vec2 warpedUv = uv + (uv / (dist * dist + 0.06)) * lens * 0.03;

  float ring = einsteinRing(dist, horizon * 1.3, uEinsteinRingStrength, t);
  vec3 ringCol = uColor * ring * 3.0;

  vec2 secondaryUv = uv - (uv / (dist * dist + 0.03)) * lens * 0.02;
  float secondaryMask = smoothstep(horizon + 0.02, horizon, length(secondaryUv)) * uSecondaryImage;
  vec3 secondaryCol = vec3(0.5, 0.3, 0.2) * secondaryMask;

  vec3 particleCol = vec3(0.0);
  if (enableParticles) {
    float flowParticles = 0.0;
    for (int i = 0; i < 12; i++) {
      if (i >= uAccretionFlowCount) break;
      flowParticles += accretionParticle(uv, angle, t, float(i));
    }
    particleCol += uColor * flowParticles * uAccretionFlowStrength;

    float jetEffect = jet(uv, t, uJetWidth, uJetIntensity);
    particleCol += uJetColor * jetEffect;
  }

  vec3 finalCol = diskCol + photonCol + depthCol + ringCol + secondaryCol + particleCol;
  finalCol *= blackHole;

  float halo = 0.002 / (abs(dist - horizon) + 0.001);
  vec3 haloCol = uColor * halo * uHaloIntensity;
  finalCol += haloCol;

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

  if (enableBloom) {
    finalCol = bloom(finalCol, uBloomStrength);
  }

  if (uChromaticAberration > 0.0) {
    vec2 dir = normalize(uv) * uChromaticAberration;
    finalCol.r *= 1.0 + dot(dir, vec2(1.0, 0.0)) * 0.5;
    finalCol.b *= 1.0 - dot(dir, vec2(1.0, 0.0)) * 0.5;
  }

  float vignette = 1.0 - length(vUv - 0.5) * uVignetteStrength * 2.0;
  finalCol *= clamp(vignette, 0.0, 1.0);

  if (uFilmGrain > 0.0) {
    float grain = hash(vUv * 1000.0 + uTime) * 2.0 - 1.0;
    finalCol += grain * uFilmGrain * 0.1;
  }

  finalCol *= uBrightness;

  fragColor = vec4(finalCol, 1.0);
}
