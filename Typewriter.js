class Typewriter {

  constructor() {
  }

  type(str, x, y, size) {

    push();
    fill(255);
    textSize(FONTSIZE*size);
    text(str, x * (FONT_W), (y+1) * (FONT_H));
    pop();

  }

  drawLayer(layer) {

    for (let y = cam.y; y < VIEWPORT_H+cam.y; y++) {
      for (let x = cam.x; x < VIEWPORT_W+cam.x; x++) {
        let i = (y*MAP_W)+x;
        let texture = textures[layers[layer][i]];
        if (texture) {
          image(texture, (x+1-cam.x)*FONT_W, (y+1-cam.y)*FONT_H, texture.width*GLOBALRESIZE,texture.height*GLOBALRESIZE);
        }
      }
    }

  }

  drawItems() {

    //print('draw items')

  }

  drawEntities(mode) {

    switch(mode){
      case 'regular':
        for (let i = 0; i < layers['entities'].length; i++) {
          let entity = layers['entities'][i];
          if (entity){
            let texture = textures['entity_'+entity.texture];
            image(texture, (entity.pos.x+1-cam.x)*FONT_W, (entity.pos.y+1-cam.y)*FONT_H, texture.width*GLOBALRESIZE,texture.height*GLOBALRESIZE);        
          }
        }
        break;
      case 'alpha':
        for (let i = 0; i < layers['entities'].length; i++) {
          let entity = layers['entities'][i];
          if (entity){
            let texture = textures['entity_'+entity.texture+'_alpha'];
            image(texture, (entity.pos.x+1-cam.x)*FONT_W, (entity.pos.y+1-cam.y)*FONT_H, texture.width*GLOBALRESIZE,texture.height*GLOBALRESIZE);        
          }
        }
        break;
      default:
        print('unknown drawEntities mode')
        break;
    }

  }

  drawScreenBorders() {

    for (let x = 0; x < VIEWPORT_W + 2; x++) {
      this.type('-', x, 0, GLOBALRESIZE);
      this.type('-', x, VIEWPORT_H+1, GLOBALRESIZE);
    }
    for (let y = 0; y < VIEWPORT_H + 2; y++) {
      this.type('|', 0, y, GLOBALRESIZE);
      this.type('|', VIEWPORT_W+1, y, GLOBALRESIZE);
    }

  }
  
}
