import { gsap } from 'gsap';
import Lenis from './scripts/Lenis';
import Stage from './stage';
import './styles/index.css';

Stage.init(document.querySelector('.app__stage'));
Stage.addEvents();

gsap.ticker.add((time) => {
  Lenis.raf(time * 1000);

  Stage.render();
});
