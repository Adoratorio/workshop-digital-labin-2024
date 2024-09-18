import {
  Scene as ThreeScene,
  AmbientLight,
  FogExp2,
  Color,
} from 'three';
import Floor from './actors/floor';
import Cards from './actors/cards';

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

    this.add(...this.actors.values());
  }
}

export default new Scene();
