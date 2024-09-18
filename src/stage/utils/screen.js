const screen = {
  x: window.innerWidth,
  y: window.innerHeight,
  ratio: {
    x: window.innerWidth / window.innerHeight,
    y: window.innerHeight / window.innerWidth,
  },
};

export function resizeScreen() {
  screen.x = window.innerWidth;
  screen.y = window.innerHeight;
  screen.ratio.x = screen.x / screen.y;
  screen.ratio.y = screen.y / screen.x;
}

export default screen;
