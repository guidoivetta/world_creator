class Typewriter {

  constructor() {
  }

  type(str, x, y) {
    fill(255);
    text(str, (x + 1) * FONT_W, (y + 2) * FONT_H);
  }

  drawScreenBorders() {
    for (let x = 0; x < VIEWPORT_W + 2; x++) {
      this.type('-', x - 1, -1, 255);
      this.type('-', x - 1, VIEWPORT_H, 255);
    }
    for (let y = 0; y < VIEWPORT_H + 2; y++) {
      this.type('|', -1, y - 1, 255);
      this.type('|', VIEWPORT_W, y - 1, 255);
    }
  }

  drawLayer(layer) {
    for (let y = cam.y; y < VIEWPORT_H+cam.y; y++) {
      for (let x = cam.x; x < VIEWPORT_W+cam.x; x++) {
        let i = (y*MAP_W)+x;
        if (textures[layers[layer][i]]) {
          image(textures[layers[layer][i]], (x+1-cam.x)*FONT_W, (y+1-cam.y)*FONT_H);
        }
      }
    }
  }

  drawEntities() {
    for (let i = 0; i < layers['entities'].length; i++) {
      let entity = layers['entities'][i];
      if (entity){
        image(textures['entity_'+entity.texture], (entity.pos.x+1-cam.x)*FONT_W, (entity.pos.y+1-cam.y)*FONT_H);
      }
    }
  }
  
}
