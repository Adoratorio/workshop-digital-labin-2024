import {
  Points,
  BufferGeometry,
  PointsMaterial,
  BufferAttribute,
  AdditiveBlending,
} from 'three';
import LoadManager from '@/stage/managers/LoadManager';
import Lenis from '@/scripts/Lenis';

export default class Bubbles extends Points {
  constructor() {
    super(
      new BufferGeometry(),
      new PointsMaterial({
        map: LoadManager.items.get('bubble'),
        blending: AdditiveBlending,
        transparent: true,
        depthTest: false,
        size: 0.2,
      }),
    );

    this.name = 'bubbles';

    this._startPositions = [];
    this._instances = 1000; // number of instances
    this._matrixIndex = 3; // number of vertices
    this._zDistance = 0;
    this._positions = new Float32Array(this._instances * this._matrixIndex); // number of instances multiplied by vertices (x, y, z)
    this._multipliers = new Float32Array(this._instances * this._matrixIndex); // randomizer for simulating turbolence

    this.init();
  }

  init() {
    this.setRandomPositions();

    this.geometry.setAttribute('position', new BufferAttribute(this._positions, this._matrixIndex));
    this.geometry.setAttribute('multiplier', new BufferAttribute(this._multipliers, this._matrixIndex));
  }

  setRandomPositions() {
    const spread = 20;

    for (let i = 0; i < this._instances; i++) {
      let i3 = i * this._matrixIndex;

      const vertPosX = (Math.random() - 0.5) * spread;
      const vertPosY = (Math.random() - 0.5) * spread;
      const vertPosZ = (Math.random() - 0.5) * (spread + 10);

      this._positions[i3] = vertPosX;
      this._positions[i3 + 1] = vertPosY;
      this._positions[i3 + 2] = vertPosZ;

      this._multipliers[i3] = Math.random() - 0.5; // Random multiplier for X vertex turbolence
      this._multipliers[i3 + 1] = Math.random(); // Random multiplier for Y vertex turbolence
      this._multipliers[i3 + 2] = Math.random(); // Random multiplier for Z vertex turbolence
    }

    this._startPositions.push(...this._positions);
  }

  render(t) {
    this._zDistance += Lenis.velocity * 0.01;

    for (let i = 0; i < this._instances; i++) {
      let i3 = i * this._matrixIndex;

      this.geometry.attributes.position.array[i3] = this._startPositions[i3] + Math.sin(t.elapsed * 0.2 * this.geometry.attributes.multiplier.array[i3]); // x
      this.geometry.attributes.position.array[i3 + 1] = -1 - this._startPositions[i3 + 1] + ((t.elapsed * 0.3 * this.geometry.attributes.multiplier.array[i3 + 1]) % 7); // y
      this.geometry.attributes.position.array[i3 + 2] = -10 - this._startPositions[i3 + 2] + ((this._zDistance + (t.elapsed * 0.9 * this.geometry.attributes.multiplier.array[i3 + 2])) % 15); // z
    }

    this.geometry.attributes.position.needsUpdate = true;
  }
}
