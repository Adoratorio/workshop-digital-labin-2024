import {
  Group,
  MeshBasicMaterial,
  PlaneGeometry,
  Mesh,
} from 'three';
import { gsap } from 'gsap';
import { observer } from '@/scripts/observer';
import TimelineManager from '@/stage/managers/TimelineManager';

const distFromCenter = 6;
const step = 10;

export default class Cards extends Group {
  constructor(node = document) {
    super();

    this.node = node;

    this.position.z = 10;

    this.init();

    this.addOnScrollAnimation();
  }

  init() {
    const groups = [new Group(), new Group()];
    const basePlaneMaterial = new MeshBasicMaterial();
    const imagesNodes = [...this.node.querySelectorAll('section.chapter img')];

    imagesNodes.forEach((image, index) => {
      const geometry = new PlaneGeometry(1, 1, 32, 32);
      const material = basePlaneMaterial.clone();
      const plane = new Mesh(geometry, material);

      plane.position.x = index % 2 === 0 ? -distFromCenter : distFromCenter;
      plane.position.z = -step * index;

      this._lastPosition = plane.position.z;

      const clone = plane.clone();

      image._planes = [plane, clone];
      observer.observe(image);

      groups[0].add(plane);
      groups[1].add(clone);
    });

    groups[1].position.z = this._lastPosition;

    this.add(...groups);
  }

  addOnScrollAnimation() {
    this.children.forEach((child, index) => {
      TimelineManager.addToTimeline(gsap.to(child.position, {
        z: (index - 1) * this._lastPosition,
        duration: 1,
        ease: 'none',
      }));
    });
  }
}
