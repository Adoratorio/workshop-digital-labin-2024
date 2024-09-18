import { PerspectiveCamera } from 'three';
import screen from './utils/screen';
import InputManager from './managers/InputManager';

class Camera extends PerspectiveCamera {
  constructor() {
    super(55, screen.ratio.x, 0.1, 100);

    this.position.set(0, 0, 10);

    this._tiltMultiplier = { x: 0.35, y: 0.25 };
  }

  resize() {
    this.aspect = screen.ratio.x;
    this.updateProjectionMatrix();
  }

  render() {
    this.position.x = InputManager.normalizedCoords.x * this._tiltMultiplier.x;
    this.position.y = InputManager.normalizedCoords.y * this._tiltMultiplier.y;

    this.lookAt(0, 0, -30);
  }
}

export default new Camera();
