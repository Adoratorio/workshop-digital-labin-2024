import {
  Group,
  ShaderMaterial,
  PlaneGeometry,
  Mesh,
  UniformsUtils,
  UniformsLib,
} from 'three';
import { gsap } from 'gsap';
import { observer } from '@/scripts/observer';
import Lenis from '@/scripts/Lenis';
import TimelineManager from '@/stage/managers/TimelineManager';
import vertexShader from './material.vert';
import fragmentShader from './material.frag';

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
    const imagesNodes = [...this.node.querySelectorAll('section.chapter img')];

    imagesNodes.forEach((image, index) => {
      const geometry = new PlaneGeometry(1, 1, 32, 32);
      const material = new ShaderMaterial({
        vertexShader,
        fragmentShader,
        fog: true,
        uniforms: UniformsUtils.merge([
          UniformsLib['fog'],
          {
            uColor: { value: null },
            uVelocity: { value: 0.0 },
            uTime: { value: 0.0 },
            uRandom: { value: gsap.utils.random(0, 1) },
            uOrientation: { value: index % 2 === 0 ? 1 : -1 },
          },
        ]),
      });
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

  render(t) {
    this.children.forEach((child) => {
      child.children.forEach((plane) => {
        plane.material.uniforms.uVelocity.value = Lenis.velocity * 0.1;
        plane.material.uniforms.uTime.value = t.elapsed;
      });
    });
  }
}
