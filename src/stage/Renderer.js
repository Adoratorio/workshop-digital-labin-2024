import { WebGLRenderer } from 'three';
import screen from './utils/screen';

class Renderer extends WebGLRenderer {
  constructor() {
    super({ powerPreference: 'high-performance', antialias: true, alpha: true });

    this.resize();

    this.setClearColor(0xDEDEDE, 1);
    this.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
  }

  resize() {
    this.setSize(screen.x, screen.y);
  }
}

export default new Renderer();
