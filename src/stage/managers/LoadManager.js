import {
  TextureLoader,
  SRGBColorSpace,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import sources from '@/assets/data/sources';

class LoadManager {
  constructor() {
    this.loaded = 0;
    this.toLoad = sources.length;
    this.items = new Map();

    this.loaders = {
      gltf: new GLTFLoader(),
      texture: new TextureLoader(),
    };
  }

  createResourcePromise(source) {
    return new Promise((resolve) => {
      this.loaders[source.type]?.load(
        source.path,
        (file) => {
          if (source.type === 'texture') {
            file.flipY = true;
            file.colorSpace = SRGBColorSpace;
          }

          this.items.set(source.name, file);

          this.loaded += 1;

          resolve(file);
        },
      );
    });
  }

  async start() {
    const promises = [];

    sources.forEach(source => promises.push(this.createResourcePromise(source)));

    await Promise.all(promises);
  }
}

export default new LoadManager();
