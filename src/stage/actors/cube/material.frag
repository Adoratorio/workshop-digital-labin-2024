precision highp float;

uniform float uTime;
varying vec2 vUv;

void main() {
  vec3 color = vec3(0.8, 0.5, 1.0) + 0.3 * cos(vUv.xyx + uTime);

  gl_FragColor = vec4(color, 1.0);
}
