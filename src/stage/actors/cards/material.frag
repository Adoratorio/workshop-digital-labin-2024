precision highp float;

#include <fog_pars_fragment>

varying vec2 vUv;

uniform float uVelocity;
uniform sampler2D uColor;

void main() {
  vec2 uv = vUv;

  float texR = texture2D(uColor, vec2(uv.x + (0.0075 * uVelocity), uv.y)).r;
  float texG = texture2D(uColor, uv).g;
  float texB = texture2D(uColor, vec2(uv.x - (0.0075 * uVelocity), uv.y)).b;

  gl_FragColor = vec4(vec3(texR, texG, texB), 1.0);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  #include <fog_fragment>
}