class Typewriter {
  constructor() {
    this.input = {
      line: "",
      pointer: {
        char: "_",
        animate: function () {
          if (frameCount % 28 == 0) {
            switch (this.char) {
              case "_":
                this.char = "";
                break;
              case "":
                this.char = "_";
                break;
            }
          }
        },
      },
      show: function () {
        for (let i = 0; i < this.line.length; i++) {
          typewriter.type(this.line[i], 0 + i, MAP_H + 2, 255);
        }
        typewriter.type(this.pointer.char, this.line.length, MAP_H + 2, 255);
        this.pointer.animate();
      },
    };
  }

  type(char, x, y, col) {
    push();
    fill(col);
    text(char, (x + 1) * FONT_W, (y + 2) * FONT_H);
    pop();
  }

  drawScreenBorders() {
    for (let x = 0; x < MAP_W + 2; x++) {
      this.type("-", x - 1, -1, 255);
      this.type("-", x - 1, MAP_H, 255);
    }
    for (let y = 0; y < MAP_H + 2; y++) {
      this.type("|", -1, y - 1, 255);
      this.type("|", MAP_W, y - 1, 255);
    }
  }
}
