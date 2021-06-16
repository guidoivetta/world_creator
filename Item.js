class Item extends Obj {

  constructor(x, y, category, type, material) {
    super(x, y, category, type, material);
    if (this.category == "equipment") {
      this.isEquippable = true;
      this.isEquipped = false;
    }
  }

  update() {

    this.name = this.material + " " + this.type;

    //Set character according to category
    switch (this.category) {
      case "equipment":
        this.char = "*";
        break;
      default:
        this.char = "?";
        break;
    }

    //Set slot according to type
    switch (this.type) {
      case "pickaxe":
        this.slot = "hand";
        break;
      case "axe":
        this.slot = "hand";
        break;
      case "helmet":
        this.slot = "head";
      default:
        this.slot = "?";
        break;
    }

    //Set color according to material
    switch (this.material) {
      case "wooden":
        this.col = colors.wooden;
        break;
      case "stone":
        this.col = colors.stone;
        break;
      case "tin":
        this.col = colors.tin;
        break;
      case "golden":
        this.col = colors.golden;
        break;
    }

    

  }

}