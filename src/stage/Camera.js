import { PerspectiveCamera } from 'three';
import screen from './utils/screen';

class Camera extends PerspectiveCamera {
  constructor() {
    super(55, screen.ratio.x, 0.1, 100);

    this.position.set(0, 0, 10);
  }

  resize() {
    this.aspect = screen.ratio.x;
    this.updateProjectionMatrix();
  }
}

export default new Camera();
