class Typewriter {

  constructor() {
    this.x = 1;
    this.y = MAP_H + 2;
  }

  type(char, x, y, off) {
    if (typeof char != 'string') {
      image(char, (x+1)*FONT_W+off, (y+1)*FONT_H+off);
      return;
    }
    fill(255);
    text(char, (x + 1) * FONT_W, (y + 2) * FONT_H);
  }

  drawScreenBorders() {
    for (let x = 0; x < MAP_W + 2; x++) {
      this.type('-', x - 1, -1, 255);
      this.type('-', x - 1, MAP_H, 255);
    }
    for (let y = 0; y < MAP_H + 2; y++) {
      this.type('|', -1, y - 1, 255);
      this.type('|', MAP_W, y - 1, 255);
    }
  }
}
