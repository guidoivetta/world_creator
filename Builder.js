class Builder {
  constructor() {
    this.object = {
      char: "█",
      x: 0,
      y: 0,
      name: "wall",
      material: "stone",
      col: color(255, 0, 0),
    };
    this.colDel = color(255, 0, 0, 128);
    this.colSel = color(0, 0, 255, 128);
    this.tool = "place";
    this.sel1 = null;
    this.sel2 = null;
    this.dragSel2 = false;
    this.cursorX = 0;
    this.cursorY = 0;
  }

  setName(input) {
    switch (input) {
      case "place":
        this.tool = "place";
        break;
      case "placeFromTo":
        this.tool = "placeFromTo";
        break;
      case "del":
        this.tool = "del";
        this.object.char = "";
        break;
      case "delFromTo":
        this.tool = "delFromTo";
        this.object.char = "";
        break;
      case "y":
        if (
          this.tool == "delFromTo" &&
          this.sel1 != null &&
          this.sel2 != null
        ) {
          this.deleteFromTo();
        } else if (
          this.tool == "placeFromTo" &&
          this.sel1 != null &&
          this.sel2 != null
        ) {
          this.placeFromTo();
        }
        break;
      case "n":
        this.sel1 = null;
        this.sel2 = null;
        break;
    }
  }

  placeFromTo() {
    let x1;
    let x2;
    let y1;
    let y2;
    if (this.sel1.x - this.sel2.x < 0) {
      x1 = this.sel1.x;
      x2 = this.sel2.x;
    } else {
      x1 = this.sel2.x;
      x2 = this.sel1.x;
    }
    if (this.sel1.y - this.sel2.y < 0) {
      y1 = this.sel1.y;
      y2 = this.sel2.y;
    } else {
      y1 = this.sel2.y;
      y2 = this.sel1.y;
    }

    for (let x = x1; x <= x2; x++) {
      for (let y = y1; y <= y2; y++) {
        for (let i = 0; i < blocks.length; i++) {
          if (x == blocks[i].x && y == blocks[i].y) {
            blocks.splice(i, 1);
            i--;
          }
        }
        blocks.push({
          char: this.object.char,
          x: x,
          y: y,
          col: this.object.col,
        });
      }
    }

    this.sel1 = null;
    this.sel2 = null;
  }

  deleteFromTo() {
    let x1;
    let x2;
    let y1;
    let y2;
    if (this.sel1.x - this.sel2.x < 0) {
      x1 = this.sel1.x;
      x2 = this.sel2.x;
    } else {
      x1 = this.sel2.x;
      x2 = this.sel1.x;
    }
    if (this.sel1.y - this.sel2.y < 0) {
      y1 = this.sel1.y;
      y2 = this.sel2.y;
    } else {
      y1 = this.sel2.y;
      y2 = this.sel1.y;
    }

    blocks = blocks.filter((block) => {
      return block.x < x1 || block.x > x2 || block.y < y1 || block.y > y2;
    });

    this.sel1 = null;
    this.sel2 = null;
  }

  changeName(input) {
    this.object.name = input;
    this.updateObject();
  }

  changeMaterial(input) {
    this.object.material = input;
    this.updateObject();
  }

  changeTool(input) {
    switch (input) {
      case "place":
        this.tool = "place";
        break;
      case "placeFromTo":
        this.tool = "placeFromTo";
        break;
      case "del":
        this.tool = "del";
        //this.object.char = "";
        break;
      case "delFromTo":
        this.tool = "delFromTo";
        //this.object.char = "";
        break;
    }
  }

  toolAction(input) {
    switch (input) {
      case true:
        if (
          this.tool == "delFromTo" &&
          this.sel1 != null &&
          this.sel2 != null
        ) {
          this.deleteFromTo();
        } else if (
          this.tool == "placeFromTo" &&
          this.sel1 != null &&
          this.sel2 != null
        ) {
          this.placeFromTo();
        }
        break;
      case false:
        this.sel1 = null;
        this.sel2 = null;
        break;
    }
  }

  updateObject() {
    switch (this.object.name) {
      case "wall":
        this.object.char = "█";
        break;
      case "grass":
        this.object.char = "░";
        break;
      default:
        this.object.char = "";
        break;
    }
    switch (this.object.material) {
      case "stone":
        this.object.col = 128;
        break;
      case "leaf":
        this.object.col = color(64, 255, 128);
        break;
      default:
        this.object.col = color(255, 0, 0);
        break;
    }
  }

  showMouse() {

    this.cursorX = round(((mouseX - FONT_W / 2) / (FONT_W * MAP_W)) * MAP_W);
    this.cursorY = round(((mouseY - FONT_H / 2) / (FONT_H * MAP_H)) * MAP_H);

    if (this.dragSel2){
      this.sel2 = {
        x: this.cursorX - 1,
        y: this.cursorY - 1,
      };
    }

    if (this.cursorX < 1) {
      this.cursorX = 1;
    } else if (this.cursorX > MAP_W) {
      this.cursorX = MAP_W;
    }
    if (this.cursorY < 1) {
      this.cursorY = 1;
    } else if (this.cursorY > MAP_H) {
      this.cursorY = MAP_H;
    }
    if (this.tool == "place") {
      typewriter.type(
        this.object.char,
        this.cursorX - 1,
        this.cursorY - 1,
        this.object.col
      );
    } else if (this.tool == "placeFromTo") {
      typewriter.type(
        this.object.char,
        this.cursorX - 1,
        this.cursorY - 1,
        this.object.col
      );
      if (this.sel1 != null) {
        typewriter.type("*", this.sel1.x, this.sel1.y, this.colDel);
      }
      if (this.sel2 != null) {
        //Draw cursor
        typewriter.type("*", this.sel2.x, this.sel2.y, this.colDel);

        //Calculate selection rectangle
        let x1;
        let y1;
        let x2;
        let y2;
        if (this.sel2.x < this.sel1.x) {
          x1 = (this.sel1.x + 2) * FONT_W;
          x2 = (this.sel2.x + 1) * FONT_W;
        } else {
          x1 = (this.sel1.x + 1) * FONT_W;
          x2 = (this.sel2.x + 2) * FONT_W;
        }
        if (this.sel2.y < this.sel1.y) {
          y1 = (this.sel1.y + 2) * FONT_H;
          y2 = (this.sel2.y + 1) * FONT_H;
        } else {
          y1 = (this.sel1.y + 1) * FONT_H;
          y2 = (this.sel2.y + 2) * FONT_H;
        }
        let rectW = x2 - x1;
        let rectH = y2 - y1;

        //Draw selection rectangle
        push();
        noStroke();
        fill(this.colSel);
        rect(x1, y1, rectW, rectH);
        pop();
      }
    } else if (this.tool == "del") {
      typewriter.type("#", this.cursorX - 1, this.cursorY - 1, this.colDel);
    } else if (this.tool == "delFromTo") {
      typewriter.type("#", this.cursorX - 1, this.cursorY - 1, this.colDel);
      if (this.sel1 != null) {
        typewriter.type("*", this.sel1.x, this.sel1.y, this.colDel);
      }
      if (this.sel2 != null) {
        //Draw cursor
        typewriter.type("*", this.sel2.x, this.sel2.y, this.colDel);

        //Calculate selection rectangle
        let x1;
        let y1;
        let x2;
        let y2;
        if (this.sel2.x < this.sel1.x) {
          x1 = (this.sel1.x + 2) * FONT_W;
          x2 = (this.sel2.x + 1) * FONT_W;
        } else {
          x1 = (this.sel1.x + 1) * FONT_W;
          x2 = (this.sel2.x + 2) * FONT_W;
        }
        if (this.sel2.y < this.sel1.y) {
          y1 = (this.sel1.y + 2) * FONT_H;
          y2 = (this.sel2.y + 1) * FONT_H;
        } else {
          y1 = (this.sel1.y + 1) * FONT_H;
          y2 = (this.sel2.y + 2) * FONT_H;
        }
        let rectW = x2 - x1;
        let rectH = y2 - y1;

        //Draw selection rectangle
        push();
        noStroke();
        fill(this.colSel);
        rect(x1, y1, rectW, rectH);
        pop();
      }
    }
  }
}
