class Player {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.inventory = [];
    this.isOnMenu = false;
    this.isOnItem = false;
    this.selectedOption = 0;
    this.menuDisplay = [];
    this.selectedItem;
    this.speed = 1;
    this.col = color(255, 255, 255);
  }

  ///***MENU STUFF***///
  selectItem() {

    this.selectedItem = this.inventory[this.selectedOption];
    this.selectedOption = 0;

    push();
    noStroke();
    fill(0);
    rect(0, (MAP_H + 2) * FONT_H, width, height);
    pop();
    this.scrollMenu();

    if (this.selectedItem) {

      this.isOnItem = true;

      this.menuDisplay = [];
      if (this.selectedItem.isEquippable) {
        if (this.selectedItem.isEquipped) {
          this.menuDisplay.push("unequip");
        } else {
          this.menuDisplay.push("equip");
        }
      }

      this.menuDisplay.push("throw");
      this.menuDisplay.push("inspect");
    }
  }
  selectOption() {
    switch(this.menuDisplay[this.selectedOption]) {
      case "equip":
        //Si hay otro item equipado en el mismo slot, desequipar
        for (let i = 0; i < this.inventory.length; i++) {
          if (this.inventory[i].isEquipped && this.inventory[i].slot == this.selectedItem.slot) {
            this.inventory[i].isEquipped = false;
          }
        }
        //Equipar item seleccionado
        this.selectedItem.isEquipped = true;

        //Gastar turno
        pendingUpdate = true;
        break;
      case "unequip":
        //Desequipar item seleccionado
        this.selectedItem.isEquipped = false;
        break;
      case "throw":
        break;
      case "inspect":
        break;
    }
    this.isOnItem = false;
    this.isOnMenu = false;
    this.selectedItem = null;
    this.updateInventoryDisplay();
  }
  scrollMenu(dir) {

    push();
    noStroke();
    fill(0);
    rect(FONT_W, (MAP_H + 2) * FONT_H, FONT_W, height);
    pop();

    switch (dir) {
      case 'u':
        this.selectedOption--;
        break;
      case 'd':
        this.selectedOption++;
        break;
    }

    if (this.selectedOption < 0) {
      this.selectedOption = 0;
    } else if (this.selectedOption > this.menuDisplay.length - 1) {
      if (this.menuDisplay.length > 0) {
        this.selectedOption = this.menuDisplay.length - 1;
      } else {
        this.selectedOption = 0;
      }

    }

    if (this.isOnMenu) {
      typewriter.type('-', 0, MAP_H + 2 + this.selectedOption, 255);
    }

  }

  ///***MOVEMENT***///
  move(dir) {
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
        this.collideWith(objs.middle[i]);
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

    this.updateInventoryDisplay();

    this.x += velX;
    this.y += velY;
  }
  collideWith(collider) {
    for (let item of this.inventory) {
      if (item.isEquipped && item.slot == "hand") {
        switch(item.type) {
          case "pickaxe":
            if (item.material != "wooden") {

            }
            break;
        }
      }
    }
  }

  ///***INVENTORY***///
  showInventory() {

    if (this.menuDisplay) {
      for (let i = 0; i < this.menuDisplay.length; i++) {
        for (let j = 0; j < this.menuDisplay[i].length; j++) {
          typewriter.type(this.menuDisplay[i][j], typewriter.x, typewriter.y, 255);
          typewriter.x++;
        }
        typewriter.y++;
        typewriter.x = 1;
      }

      typewriter.y = MAP_H + 2;

    }
  }
  updateInventoryDisplay() {
    this.menuDisplay = [];
    for (let i = 0; i < this.inventory.length; i++) {
      let nameToAdd = this.inventory[i].name;
      if (this.inventory[i].isEquipped) {
        nameToAdd += " (E)"
      }
      this.menuDisplay.push(nameToAdd);
    }
  }

}