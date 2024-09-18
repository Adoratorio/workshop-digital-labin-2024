precision highp float;
precision highp int;

#include <fog_pars_vertex>

varying vec2 vUv;

void main() {
  vUv = uv;

  vec4 mvPosition = vec4(vec3(position), 1.0);
  mvPosition = modelViewMatrix * mvPosition;
  gl_Position = projectionMatrix * mvPosition;

  #include <fog_vertex>
}