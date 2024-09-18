precision highp float;
precision highp int;

#define PI 3.1415926538

#include <fog_pars_vertex>

uniform float uVelocity;
uniform float uTime;
uniform float uRandom;
uniform float uOrientation;

varying vec2 vUv;

void main() {
  vUv = uv;

  vec3 p = position;

  if (uOrientation > 0.0) {
    p.z += ((sin(p.x * 4.0 + uTime + uRandom) * 0.5) + cos(p.y * 2.0 + uTime) * 0.5);
  } else {
    p.z -= ((sin(p.x * 4.0 - uTime + (uRandom * 0.5)) * 0.5) + cos(p.y * 2.0 - uTime - uRandom) * 0.5);
  }

  p.z += ((cos(p.x * PI) / 2.0) * uVelocity * 0.05);

  vec4 mvPosition = vec4(vec3(p), 1.0);
  mvPosition = modelViewMatrix * mvPosition;

  gl_Position = projectionMatrix * mvPosition;

  #include <fog_vertex>
}