import { Scene as ThreeScene } from 'three';
import Cube from './actors/cube';

class Scene extends ThreeScene {
  constructor() {
    super();

    this.actors = new Map();
  }

  addActors() {
    this.actors.set('cube', new Cube());

    this.add(...this.actors.values());
  }
}

export default new Scene();
