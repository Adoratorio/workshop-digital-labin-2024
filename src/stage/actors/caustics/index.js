import {
  SpotLight,
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
  WebGLRenderTarget,
  Scene,
  OrthographicCamera,
} from 'three';
import Renderer from '@/stage/Renderer';
import Gui from '@/stage/utils/Gui';
import vertexShader from '@/stage/shaders/base.vert';
import fragmentShader from './material.frag';
import uniforms from './uniforms';
import Lenis from '@/scripts/Lenis';

export default class Caustics extends SpotLight {
  constructor() {
    super(0x2794BB, 1000, 0, Math.PI / 4, Math.PI / 4);

    this.name = 'caustics';

    this.init();
  }

  init() {
    this.position.set(0.5, 6, 4);

    this.createRenderTarget(); // Create WebGLRenderTarget

    this._rtScene.add(this.createTexture());
  }

  createTexture() {
    const texturePlane = new PlaneGeometry(4, 4, 512, 512);
    const textureMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    return new Mesh(texturePlane, textureMaterial);
  }

  createRenderTarget() {
    this._rt = new WebGLRenderTarget(512, 512); // Creating WebGLRenderTarget with width / height 512
    this._rtScene = new Scene(); // Creating RenderTarget Scene
    this._rtCamera = new OrthographicCamera(-1, 1, 1, -1, 0.01, 10); // Creating RenderTarget Camera
    this._rtCamera.position.z = 1; // RenderTarget Camera position
  }

  addGui() {
    const causticsGui = Gui.addFolder('Caustics 🕸️');
    causticsGui.addColor(this, 'color').name('Light color');
    causticsGui.add(this, 'intensity', 0, 5000, 1).name('Light intensity');
    causticsGui.add(this.position, 'x', -10, 10, 0.1).name('Position X');
    causticsGui.add(this.position, 'y', -10, 10, 0.1).name('Position Y');
    causticsGui.add(this.position, 'z', -10, 10, 0.1).name('Position Z');

    causticsGui.close();
  }

  render(t) {
    uniforms.uTime.value += t.delta;
    uniforms.uFluctuation.value += t.delta * 0.5;
    uniforms.uScroll.value += Lenis.velocity * 0.00017;

    Renderer.setRenderTarget(this._rt); // Passing RenderTarget to main Renderer
    Renderer.render(this._rtScene, this._rtCamera); // Render function of RT camera and scene
    Renderer.setRenderTarget(null); // Reset main Renderer RT

    this.map = this._rt.texture; // Passing RT texture to SpotLight
  }
}
