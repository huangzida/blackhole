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

vec2 warp(vec2 p, float strength) {
  float n1 = fbm(p + vec2(0.0, 0.0), 3);
  float n2 = fbm(p + vec2(5.2, 1.3), 3);
  return p + vec2(n1, n2) * strength;
}

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

float lightRay(vec2 uv, int count, float intensity) {
  float angle = atan(uv.y, uv.x);
  float ray = sin(angle * float(count)) * 0.5 + 0.5;
  return ray * intensity * exp(-length(uv) * 2.0);
}

float meteor(vec2 uv, float speed, float seed) {
  float t = uTime * speed * 0.5;
  float meteorY = fract(t * 0.3 + seed) * 2.0 - 0.5;
  float meteorX = fract(t * 0.8 + seed * 2.0) * 2.0 - 0.5;

  vec2 meteorPos = vec2(meteorX, meteorY);
  float tail = smoothstep(0.3, 0.0, abs(uv.x - meteorX)) * smoothstep(meteorY, meteorY - 0.3, uv.y);
  float head = exp(-length(uv - meteorPos) * 50.0);

  return (tail + head) * 0.5;
}

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

void main() {
  int quality = uQualityMode;
  int fbmOctaves = 3 + quality;
  bool enableCore = quality >= 1;
  bool enableDust = quality >= 1;
  bool enableMeteor = quality >= 2;
  bool enableLightRays = quality >= 2;

  vec2 uv = vUv - 0.5;
  float dist = length(uv);
  float t = uTime * uSpeed;

  float gradient = 1.0 - dist * 1.5;
  gradient = max(0.0, gradient);
  vec3 baseColor = mix(uNebulaColor1, uNebulaColor2, gradient);

  vec2 cloudUv = uv * uGasCloudScale;
  cloudUv = warp(cloudUv + t * 0.05, uCloudWarpStrength * uTurbulence);
  float cloud = fbm(cloudUv * 3.0, fbmOctaves);
  cloud = pow(cloud, 1.5) * uGasCloudIntensity;
  vec3 cloudColor = baseColor * cloud;

  vec3 coreColor = vec3(0.0);
  if (enableCore) {
    float coreGlow = exp(-dist * dist / (uCoreSize * uCoreSize)) * uCoreIntensity;
    coreColor = uCoreColor * coreGlow;

    if (enableLightRays) {
      float coreRay = lightRay(uv, uLightRayCount, uLightRayStrength);
      coreColor += uCoreColor * coreRay * 0.5;
    }
  }

  vec3 dustColor = vec3(0.0);
  if (enableDust) {
    vec2 dustUv = uv * 2.0;
    vec2 vor = voronoi(dustUv + t * 0.02);
    float dust = smoothstep(0.05, 0.3, vor.y - vor.x) * uDustBandStrength;
    dustColor = uDustBandColor * dust;
  }

  float starField = stars(uv, uStarDensity, uTwinkleStrength);
  starField *= uForegroundStarIntensity;

  float meteors = 0.0;
  if (enableMeteor) {
    meteors += meteor(uv, uMeteorSpeed, 0.1) * uMeteorStrength;
    meteors += meteor(uv, uMeteorSpeed * 1.3, 0.7) * uMeteorStrength * 0.7;
  }

  vec3 finalColor = cloudColor;
  finalColor = mix(finalColor, coreColor, min(1.0, length(coreColor)));
  finalColor = mix(finalColor, dustColor, uDustBandStrength);
  finalColor += vec3(starField);
  finalColor += vec3(meteors);

  float glow = exp(-dist * 3.0) * 0.3;
  finalColor += baseColor * glow;

  fragColor = vec4(finalColor, 1.0);
}
