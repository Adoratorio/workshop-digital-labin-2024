import {
  Group,
  MeshStandardMaterial,
  Color,
  RepeatWrapping,
} from 'three';
import LoadManager from '@/stage/managers/LoadManager';
import Lenis from '@/scripts/Lenis';

const planeSize = 79.5;

export default class Floor extends Group {
  constructor() {
    super();

    this.name = 'floor_tiles';
    this._zDistance = 0;

    this.init();
  }

  init() {
    this.position.set(-0.1, -5, 10);
    this.scale.x = 1.5; // scale group in x to fit the camera view

    this.creatTiles();
  }

  creatTiles() {
    // get floor 3D model from LoadManager items map
    const floorModel = LoadManager.items.get('floor');

    // get sand from LoadManager items map
    const sandTexture = LoadManager.items.get('sand');

    // get floor mesh from exported scene in gltf model
    const tile = floorModel.scene.getObjectByName('floor');
    tile.material = new MeshStandardMaterial({
      map: sandTexture,
      bumpMap: sandTexture,
      bumpScale: 0.2,
      color: new Color(0x235CFF),
      roughness: 0.1,
    });

    // set diffuse texture properties
    tile.material.map.wrapS = RepeatWrapping; // Horizontal wrapping for map
    tile.material.map.wrapT = RepeatWrapping; // Vertical wrapping for map
    tile.material.map.repeat.set(10, 10); // Repeat map 10 times

    // set bumpMap texture properties
    tile.material.bumpMap.wrapS = RepeatWrapping;
    tile.material.bumpMap.wrapT = RepeatWrapping;
    tile.material.bumpMap.repeat.set(10, 10);

    const nextTile = tile.clone();
    nextTile.position.z -= planeSize;

    const prevTile = tile.clone();
    prevTile.position.z += planeSize;

    this.add(prevTile, tile, nextTile);
  }

  render() {
    this._zDistance += Lenis.velocity * 0.01;

    this.children.forEach((child, i) => {
      child.position.z = ((this._zDistance % planeSize) - (planeSize * (i - 1)));
    });
  }
}
