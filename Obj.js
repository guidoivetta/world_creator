class Obj {

  constructor(x, y, category, type, material) {
    this.x = x;
    this.y = y;
    this.category = category;
    this.type = type;
    this.material = material;
    this.col = color(255,0,0);
    this.update();
  }

  update() {

    this.isCollidable = false;

    this.name = this.material + " " + this.type;

    //Set character according to type
    switch (this.type) {
      case "wall":
        this.char = "█";
        this.isCollidable = true;
        break;
      case "soil":
        this.char = "░";
        break;
      case "leaves":
        this.char = "▒";
        break;
      case "chest":
        this.char = "■";
        break;
      default:
        this.char = "?";
        break;
    }

    if (this.category != "objects") {
      this.isEquippable = true;
    }

    //Set color and hardness according to material
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
      case "dirt":
        this.col = colors.dirt;
        break;
      case "grass":
        this.col = colors.grass;
        break;
      case "sand":
        this.col = colors.sand;
        break;
      case "gravel":
        this.col = colors.gravel;
        break;
      case "leaves_normal":
        this.col = colors.leaves_normal;
        break;
      case "leaves_autumn":
        this.col = colors.leaves_autumn;
        break;
      case "leaves_dark":
        this.col = colors.leaves_dark;
        break;
    }

  }
  changeType(input) {
    this.type = input;
    this.update();
  }
  changeMaterial(input) {
    this.material = input;
    this.update();
  }

}