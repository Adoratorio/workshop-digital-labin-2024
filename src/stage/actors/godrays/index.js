import {
  Group,
  Mesh,
  CylinderGeometry,
  MeshStandardMaterial,
  RepeatWrapping,
} from 'three';
import LoadManager from '@/stage/managers/LoadManager';
import Gui from '@/stage/utils/Gui';

export default class Godrays extends Group {
  constructor() {
    super();

    this.name = 'godrays';

    this.init();
  }

  init() {
    this.position.z = 5;

    const outer = this.createLightconeMesh('godrays_outer', 6);
    const inner = this.createLightconeMesh('godrays_inner', 4);

    this.add(inner, outer);
  }

  createLightconeMesh(name, repeat) {
    const mesh = new Mesh(
      new CylinderGeometry(3.75, 4.25, 2, 32, 32, true),
      new MeshStandardMaterial({
        color: 0xE0E5FF,
        alphaMap: LoadManager.items.get(name),
        transparent: true,
        depthTest: false,
        opacity: 0.2,
      }),
    );

    mesh.name = name;
    mesh.material.alphaMap.wrapS = RepeatWrapping;
    mesh.material.alphaMap.wrapT = RepeatWrapping;
    mesh.material.alphaMap.repeat.set(repeat, 1);

    return mesh;
  }

  addGui() {
    const godraysGui = Gui.addFolder('Godrays ✨');
    godraysGui.add(this.position, 'x', -10, 10, 0.1).name('Position X');
    godraysGui.add(this.position, 'y', -10, 10, 0.1).name('Position Y');
    godraysGui.add(this.position, 'z', -10, 10, 0.1).name('Position Z');
    godraysGui.add(this.rotation, 'x', -3.14159, 3.14159, 0.01).name('Rotation X');
    godraysGui.add(this.rotation, 'y', -3.14159, 3.14159, 0.01).name('Rotation Y');
    godraysGui.add(this.rotation, 'z', -3.14159, 3.14159, 0.01).name('Rotation Z');

    this.children.forEach((child) => {
      godraysGui.addColor(child.material, 'color').name(`${child.name} color`);
    });

    godraysGui.close();
  }

  render(t) {
    this.children.forEach((child) => {
      if (child.name === 'godrays_outer') {
        child.rotation.y += 0.0001 - (Math.sin(t.elapsed) * 0.0004);
      } else {
        child.rotation.y -= 0.00006 - (Math.sin(t.elapsed) * 0.00009);
      }

      child.material.opacity = 0.2 + (Math.abs(Math.sin(t.elapsed)) * (child.name === 'godrays_outer' ? -0.1 : 0.1));
    });
  }
}
