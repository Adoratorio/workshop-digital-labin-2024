import { gsap } from 'gsap';
import Lenis from '@/scripts/Lenis';

class TimelineManager {
  constructor() {
    this._progress = 0;
    this._tl = gsap.timeline({ paused: true });
  }

  get progress() {
    return this._progress;
  }

  set progress(value) {
    this._progress = value;
    this._tl.progress(this._progress);
  }

  addToTimeline(tween, position = 0) {
    this._tl.add(tween, position);
  }

  render() {
    this.progress = Lenis.progress;
  }
}

export default new TimelineManager();
