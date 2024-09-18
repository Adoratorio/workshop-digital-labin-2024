import { Clock } from 'three';
import { debounce } from '@/scripts/utils';
import Scene from './Scene';
import Camera from './Camera';
import Renderer from './Renderer';
import InputManager from './managers/InputManager';
import LoadManager from './managers/LoadManager';
import TimelineManager from './managers/TimelineManager';
import { resizeScreen } from './utils/screen';

class Stage {
  constructor() {
    this.clock = new Clock();
  }

  init(container) {
    this.resize();
    this.clock.start();

    container.appendChild(Renderer.domElement);

    LoadManager.start().then(() => Scene.addActors());
  }

  addEvents() {
    InputManager.addEvents();

    window.addEventListener('resize', debounce(() => this.resize()));
  }

  resize() {
    resizeScreen();

    Camera.resize();
    Renderer.resize();
  }

  render() {
    const t = {
      delta: this.clock.getDelta(),
      elapsed: this.clock.getElapsedTime(),
      current: performance.now(),
    };

    InputManager.render();
    TimelineManager.render();

    Scene.actors.forEach(actor => typeof actor.render === 'function' && actor.render(t));

    Renderer.render(Scene, Camera);
  }
}

export default new Stage();
