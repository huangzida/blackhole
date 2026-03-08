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

in vec2 vUv;
out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 center = uOffset;
  vec2 uv = (vUv - center) * vec2(aspect, 1.0);
  float t = uTime * uSpeed;

  float dist = length(uv);
  float angle = atan(uv.y, uv.x);

  float horizon = 0.1 * uMass;
  float blackHole = smoothstep(horizon, horizon + 0.005, dist);

  float lens = uLensingStrength * uMass;
  vec2 warpedUv = uv + (uv / (dist * dist + 0.06)) * lens * 0.03;

  float diskRadius = 0.25 * uMass * max(0.0, uDiskRadiusScale);
  float diskY = warpedUv.y * uDiskTilt;
  float diskDist = length(vec2(warpedUv.x, diskY));

  float spiral = sin(diskDist * 20.0 - angle - t * 2.0);
  float diskMask = smoothstep(diskRadius, horizon, diskDist) * smoothstep(horizon - 0.05 * max(0.0, uDiskWidth), horizon, diskDist);
  float turbulence = hash(warpedUv * 40.0 + vec2(t * 0.05, t * 0.03));
  diskMask *= pow(0.5 + 0.5 * (spiral + (turbulence - 0.5) * uNoiseStrength * 1.2), 2.0);

  float heat = exp(-diskDist * 3.5);
  vec3 hotColor = mix(uColor, vec3(1.0, 0.92, 0.85), clamp(heat * 1.2, 0.0, 1.0));
  vec3 diskCol = hotColor * diskMask * uDiskIntensity;

  float halo = 0.002 / (abs(dist - horizon) + 0.001);
  vec3 haloCol = uColor * halo * uHaloIntensity;

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
  vec3 finalCol = (diskCol + haloCol + vec3(finalStars)) * blackHole;

  fragColor = vec4(finalCol, 1.0);
}
