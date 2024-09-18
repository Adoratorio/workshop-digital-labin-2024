import {
  Scene as ThreeScene,
  AmbientLight,
  FogExp2,
  Color,
} from 'three';
import Floor from './actors/floor';
import Cards from './actors/cards';
import Caustics from './actors/caustics';
import Gui from './utils/Gui';

class Scene extends ThreeScene {
  constructor() {
    super();

    this.actors = new Map();

    this.setupEnvirorment();
  }

  setupEnvirorment() {
    this.fog = new FogExp2(0x061849, 0.02);
    this.background = new Color(0x061849);

    this._ambientLight = new AmbientLight(0xF0F2F8, 0.5);
    this.add(this._ambientLight);
  }

  addActors() {
    this.actors.set('floor', new Floor());
    this.actors.set('cards', new Cards());
    this.actors.set('caustics', new Caustics());

    this.add(...this.actors.values());

    this.checkDebugMode();
  }

  checkDebugMode() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const debug = urlParams.get('debug');

    Gui.close();

    if (debug) {
      const sceneGui = Gui.addFolder('Scene 📹');

      sceneGui.addColor(this.fog, 'color').name('Fog color');
      sceneGui.addColor(this, 'background').name('Scene background');
      sceneGui.close();

      this.actors.forEach((actor) => {
        if (typeof actor.addGui === 'function') actor.addGui();
      });
    }
  }
}

export default new Scene();
