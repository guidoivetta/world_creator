class Player {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.inventory = [];
    this.isOnMenu = false;
    this.isOnItem = false;
    this.menuDisplay = [];
    this.selectedItem;
    this.selectedOption = 0;
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
          this.menuDisplay.push('unequip');
        } else {
          this.menuDisplay.push('equip');
        }
      }

      this.menuDisplay.push('throw');
      this.menuDisplay.push('inspect');
    }
  }
  selectOption() {
    switch(this.menuDisplay[this.selectedOption]) {
      case 'equip':
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
      case 'unequip':
        //Desequipar item seleccionado
        this.selectedItem.isEquipped = false;
        break;
      case 'throw':
        break;
      case 'inspect':
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
    //Reset velocity
    let vel = {
      x: 0,
      y: 0
    }
    switch (dir) {
      case 'l':
        vel.x = -this.speed;
        break;
      case 'r':
        vel.x = this.speed;
        break;
      case 'u':
        vel.y = -this.speed;
        break;
      case 'd':
        vel.y = this.speed;
        break;
    }
    for (let i = 0; i < layers['middle'].length; i++) {
      if (layers['middle'][i].isCollidable && this.x + vel.x == layers['middle'][i].x && this.y + vel.y == layers['middle'][i].y) {
        this.collideWith(layers['middle'][i]);
        vel.x = 0;
        vel.y = 0;
      }
    }

    for (let i = 0; i < items.length; i++) {
      if (this.x + vel.x == items[i].x && this.y + vel.y == items[i].y) {
        this.inventory.push(items[i]);
        items.splice(i, 1);
        i--;
      }
    }

    this.updateInventoryDisplay();

    this.x += vel.x;
    this.y += vel.y;
  }
  collideWith(collider) {
    let itemInHand;
    for (let item of this.inventory) {
      if (item.isEquipped && item.slot == 'hand') {
        itemInHand = item;
        break;
      }
    }
    if (!itemInHand) {
      return;
    }
    let dmg = (itemInHand.hardness*2)-collider.hardness;
    if (dmg >= collider.hardness) {
      collider.wearage += dmg;
      if (collider.wearage >= 100) {
        collider = -1;
      } else {
        print('You struck your '+itemInHand.name+' against a '+collider.name+' and dealt '+dmg+' wearage.');
      }
    }
  }

  ///***INVENTORY***///
  showInventory() {
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
  updateInventoryDisplay() {
    this.menuDisplay = [];
    for (let i = 0; i < this.inventory.length; i++) {
      let nameToAdd = this.inventory[i].name;
      if (this.inventory[i].isEquipped) {
        nameToAdd += ' (E)'
      }
      this.menuDisplay.push(nameToAdd);
    }
  }

}