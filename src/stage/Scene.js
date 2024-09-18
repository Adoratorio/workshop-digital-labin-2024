import { Scene as ThreeScene, AmbientLight } from 'three';
import Floor from './actors/floor';
import Cards from './actors/cards';

class Scene extends ThreeScene {
  constructor() {
    super();

    this.actors = new Map();

    this.setupEnvirorment();
  }

  setupEnvirorment() {
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
