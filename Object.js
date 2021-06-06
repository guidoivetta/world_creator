class Obj {

  constructor(x, y, type, material) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.material = material;
    this.update();
  }

  update() {
    //Set character and color according to name and material
    switch (this.type) {
      case "wall":
        this.char = "█";
        this.isCollidable = true;
        switch (this.material) {
          case "stone":
            this.col = colors.stone;
            break;
          case "wooden":
            this.col = colors.wooden;
            break;
          default:
            this.col = colors.error;
            break;
        }
        break;
      case "soil":
        this.char = "░";
        switch (this.material) {
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
          default:
            this.col = colors.error;
            break;
        }
        break;
      case "leaves":
        this.char = "▒";
        switch (this.material) {
          case "normal":
            this.col = colors.leaves_normal;
            break;
          case "autumn":
            this.col = colors.leaves_autumn;
            break;
          case "dark":
            this.col = colors.leaves_dark;
            break;
          default:
            this.col = colors.error;
            break;
        }
        break;
      case "chest":
        this.char = "■";
        switch (this.material) {
          case "wooden":
            this.col = colors.wooden;
            break;
          case "golden":
            this.col = colors.golden;
            break;
          default:
            this.col = colors.error;
            break;
        }
        break;
      default:
        this.char = "?";
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