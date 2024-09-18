export function lerp(strart, end, mix) {
  return strart * (1 - mix) + end * mix;
}

export const debounce = (callback, timeout = 250) => {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { callback.apply(this, args); }, timeout);
  };
};
