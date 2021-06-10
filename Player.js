class Player {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.inventory = [];
    this.isOnInventory = false;
    this.isOnItem = false;
    this.selectedItem = 0;
    this.speed = 1;
    this.col = color(255, 255, 255);
  }

  selectItem() {
    if (this.inventory[this.selectedItem]) {
      print("ENTER");
    }
  }
  changeSelectedItem(dir) {

    push();
    noStroke();
    fill(0);
    rect(FONT_W, (MAP_H + 2) * FONT_H, FONT_W, height);
    pop();

    switch (dir) {
      case 'u':
        this.selectedItem--;
        break;
      case 'd':
        this.selectedItem++;
        break;
    }

    if (this.selectedItem < 0) {
      this.selectedItem = 0;
    } else if (this.selectedItem > this.inventory.length - 1) {
      if (this.inventory.length > 0) {
        this.selectedItem = this.inventory.length - 1;
      } else {
        this.selectedItem = 0;
      }

    }

    if (this.isOnInventory) {
      typewriter.type('-', 0, MAP_H + 2 + this.selectedItem, 255);
    }

  }

  moveAndCollide(dir) {
    let velX = 0;
    let velY = 0;
    switch (dir) {
      case 'l':
        velX = -this.speed;
        break;
      case 'r':
        velX = this.speed;
        break;
      case 'u':
        velY = -this.speed;
        break;
      case 'd':
        velY = this.speed;
        break;
    }
    for (let i = 0; i < objs.middle.length; i++) {
      if (objs.middle[i].isCollidable && this.x + velX == objs.middle[i].x && this.y + velY == objs.middle[i].y) {
        velX = 0;
        velY = 0;
      }
    }

    for (let i = 0; i < items.length; i++) {
      if (this.x + velX == items[i].x && this.y + velY == items[i].y) {
        this.inventory.push(items[i]);
        items.splice(i, 1);
        i--;
      }
    }

    this.x += velX;
    this.y += velY;
  }

  showInventory() {
    for (let i = 0; i < this.inventory.length; i++) {
      for (let j = 0; j < this.inventory[i].name.length; j++) {
        typewriter.type(this.inventory[i].name[j], typewriter.x, typewriter.y, 255);
        typewriter.x++;
      }
      typewriter.y++;
      typewriter.x = 1;
    }

    typewriter.y = MAP_H + 2;

  }
}