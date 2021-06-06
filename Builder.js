class Builder {

  constructor() {
    this.object = new Obj(0,0,selectType.value,selectMaterial.value);
    // this.updateObject();
    this.colDel = color(255, 0, 0, 128);
    this.colSel = color(0, 0, 255, 128);
    this.tool = "place";
    this.sel1 = null;
    this.sel2 = null;
    this.dragSel2 = false;
    this.cursorX = 0;
    this.cursorY = 0;
  }

  ///***TOOLS***///
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
        if (this.tool == "delFromTo") {
          this.deleteFromTo();
        } else if (this.tool == "placeFromTo") {
          this.placeFromTo();
        }
        break;
      case false:
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
        let obj = builder.object;
        blocks.push(new Obj(x,y,obj.type,obj.material));
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

  ///***GRAPHICS***///
  showCursor() {

    //Calculate cursorX and cursorY
    this.cursorX = round(((mouseX - FONT_W / 2) / (FONT_W * MAP_W)) * MAP_W) - 1;
    this.cursorY = round(((mouseY - FONT_H / 2) / (FONT_H * MAP_H)) * MAP_H) - 1;

    //Update object x and y
    this.object.x = this.cursorX;
    this.object.y = this.cursorY;

    //Keep cursor within map borders
    if (this.cursorX < 0) {
      this.cursorX = 0;
    } else if (this.cursorX > MAP_W - 1) {
      this.cursorX = MAP_W - 1;
    }
    if (this.cursorY < 0) {
      this.cursorY = 0;
    } else if (this.cursorY > MAP_H - 1) {
      this.cursorY = MAP_H - 1;
    }

    //If dragging selection, update sel2 to cursor position
    if (this.dragSel2) {
      this.sel2 = {
        x: this.cursorX,
        y: this.cursorY
      };
    }

    //Display according to selected tool
    switch (this.tool) {
      case "place":
        typewriter.type(
          this.object.char,
          this.cursorX,
          this.cursorY,
          this.object.col
        );
        break;
      case "del":
        typewriter.type("#", this.cursorX, this.cursorY, this.colDel);
        break;
      case "placeFromTo":
        typewriter.type(
          this.object.char,
          this.object.x,
          this.object.y,
          this.object.col
        );
        if (this.sel1 != null && this.sel2 != null) {
          this.drawSelection();
        }
        break;
      case "delFromTo":
        typewriter.type("#", this.cursorX, this.cursorY, this.colDel);
        if (this.sel1 != null && this.sel2 != null) {
          this.drawSelection();
        }
        break;
    }
  }
  drawSelection() {

    //Draw cursors
    typewriter.type("*", this.sel1.x, this.sel1.y, this.colDel);
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
