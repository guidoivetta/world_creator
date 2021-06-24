class Typewriter {

  constructor() {
    this.x = 1;
    this.y = VIEWPORT_H + 2;
  }

  type(texture, x, y) {
    fill(255);
    text(texture, (x + 1) * FONT_W, (y + 2) * FONT_H);
  }

  drawScreenBorders() {
    for (let x = 0; x < VIEWPORT_W + 2; x++) {
      this.type('-', x - 1, -1, 255);
      this.type('-', x - 1, VIEWPORT_H, 255);
    }
    for (let y = 0; y < VIEWPORT_H + 2; y++) {
      this.type('|', -1, y - 1, 255);
      this.type('|', VIEWPORT_W, y - 1, 255);
    }
  }
}
