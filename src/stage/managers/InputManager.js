import screen from '../utils/screen';
import { lerp } from '@/scripts/utils';

class InputManager {
  constructor() {
    this._x = 0;
    this._y = 0;
    this._lerpedX = 0;
    this._lerpedY = 0;
  }

  get coords() {
    return { x: this._lerpedX, y: this._lerpedY };
  }

  get normalizedCoords() {
    const x = ((this._lerpedX / screen.x) * 2) - 1;
    const y = ((this._lerpedY / screen.y) * 2) - 1;

    return { x, y };
  }

  addEvents() {
    window.addEventListener('mousemove', (e) => {
      this._x = e.clientX;
      this._y = e.clientY;
    });
  }

  render() {
    this._lerpedX = lerp(this._lerpedX, this._x, 0.25);
    this._lerpedY = lerp(this._lerpedY, this._y, 0.25);
  }
}

export default new InputManager();
