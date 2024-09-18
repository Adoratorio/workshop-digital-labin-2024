import LoadManager from '@/stage/managers/LoadManager';
import screen from '@/stage/utils/screen';

const options = {
  root: document,
  rootMargin: `${screen.y}px`,
  threshold: 1.0,
};

const callback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.src = entry.target.dataset.src;

      LoadManager.createResourcePromise({
        name: entry.target.src,
        type: 'texture',
        path: entry.target.src,
      }).then((file) => {
        const plane = entry.target._plane;
        plane.material.map = file;
        plane.material.needsUpdate = true;

        const w = file.source.data.width;
        const h = file.source.data.height;
        const scale = 8;

        if (w > h) plane.scale.set(scale, scale * h / w, 1);
        else plane.scale.set(scale * w / h, scale, 1);

        plane.updateMatrix();
      });

      observer.unobserve(entry.target);
    }
  });
};

export const observer = new IntersectionObserver(callback, options);
