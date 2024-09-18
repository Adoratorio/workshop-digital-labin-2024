import { ShaderMaterial, BoxGeometry, Mesh } from 'three';
import vertexShader from '@/stage/shaders/base.vert';
import uniforms from './uniforms';
import fragmentShader from './material.frag';

export default class Cube extends Mesh {
  constructor() {
    super(
      new BoxGeometry(2, 2, 2),
      new ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
      }),
    );

    this.name = 'cube';
  }

  render(t) {
    this.rotation.y += (t.delta / 4);
    this.rotation.z += (t.delta / 2);

    this.material.uniforms.uTime.value += t.delta;
  }
}
