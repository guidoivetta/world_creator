///***GLOBAL CONSTANTS***///
const FONT_W = 9;
const FONT_H = 12;
const MAP_W = 96;
const MAP_H = 48;
const VIEWPORT_W = 48;
const VIEWPORT_H = 24;

///***GLOBAL VARIABLES***///

//Font
let font;

//Map
let layers = {
  'back': [],
  'middle': [],
  'front': [],

  updateable: {
    'back': [],
    'middle': [],
    'front': []
  }
};
let terrain = [];
let structures = [];
// let items = [];
// let entities = [];

//Dictionaries
let colDict;
let textures;
let tiles = {
  'log': {
    isCollidable: true,
    type: 'breakable',
    material: 'wooden',
    update: function(index) {
      if (layers.updateable['middle'][index].wear >= 100) {
        layers.updateable['middle'][index] = null;
        layers['middle'][index] = null;
      }
    }
  },
  'water': {
    isCollidable: false,
    type: 'liquid'
  }

};
let materials = {
  'wooden': {
    hardness: 10
  },
  'stone': {
    hardness: 15
  }
};

//Player
let player = {
  pos: {
    x: 0,
    y: 0
  },
  speed: 1,
  facing: 'e',
  inventory: [],

  moveAndCollide: function() {
    //Calculate target posiiton
    let targetPos = {
      x: this.pos.x + this.vel.x,
      y: this.pos.y + this.vel.y
    }
    
    //Get target tile full name (type_material)
    let targetTileIndex = (targetPos.y*MAP_W)+targetPos.x;
    let targetTileName = layers['middle'][targetTileIndex];

    //If it exists
    if (targetTileName) {
      //Get target tile (type)
      let targetTile = '';
      for (let i = 0; i < targetTileName.length; i++) {
        if (targetTileName[i] == '_') {
          break;
        }
        targetTile += targetTileName[i];
      }
      //If tile is collidable
      if (tiles[targetTile].isCollidable) {
        this.collideWith(targetTile, targetTileIndex);
        return;
      }
    }

    //Move to target position
    this.pos.x = targetPos.x;
    this.pos.y = targetPos.y;

    //Limit position to map boundaries
    if (this.pos.x < 0) {
      this.pos.x = 0;
    }
    if (this.pos.x > MAP_W-1) {
      this.pos.x = MAP_W-1;
    }
    if (this.pos.y < 0) {
      this.pos.y = 0;
    }
    if (this.pos.y > MAP_H-1) {
      this.pos.y = MAP_H-1;
    }

    //Adjust camera
    cam.adjust();
  },

  collideWith: function(tile, index) {
    //Initialize updateable tile if there isn't one yet
    if (!layers.updateable['middle'][index]) {
      switch (tiles[tile].type) {
        case 'breakable':
          print('collided for the first time');
          layers.updateable['middle'][index] = {
            wear: 0
          }
          break;
        case 'collided for the first time and it is liquid':
          print('is liquid');
          break;
      }
    }
    switch (tiles[tile].type) {
      case 'breakable':
        if (player.tool.type == 'axe' && (tile == 'log' || tile == 'wooden')) {
          layers.updateable['middle'][index].wear += (materials[player.tool.material].hardness*2) - materials[tiles[tile].material].hardness;
        }
        layers.updateable['middle'][index].wear += 10;
        print('collider is breakable and its wear is '+layers.updateable['middle'][index].wear);
        break;
      case 'liquid':
        print('collider is liquid');
        break;
    }
    
    tiles[tile].update(index);
  }
};

//Cam
let cam = {
  x: 0,
  y: 0,
  dragDist: 6,

  adjust: function() {
    if (player.pos.x < this.x+this.dragDist) {
      this.x--;
    }
    if (player.pos.x-this.x >= VIEWPORT_W-this.dragDist) {
      this.x++;
    }
    if (this.x < 0) {
      this.x = 0;
    }

    if (player.pos.y < this.y+this.dragDist) {
      this.y--;
    }
    if (player.pos.y-this.y >= VIEWPORT_H-this.dragDist) {
      this.y++;
    }
    if (this.y < 0) {
      this.y = 0;
    }
  }
};


///***PRELOAD***///
function preload() {

  //Load font
  font = loadFont('assets/codepage437.ttf');

  //Load textures
  textures = {
    'entity_player': loadImage('assets/textures/entity/player.png'),
    'log_oak': loadImage('assets/textures/log/oak.png'),
    'leaves_green': loadImage('assets/textures/leaves/green.png'),
    'wall_stone': '█',
    'soil_dirt': loadImage('assets/textures/soil/dirt.png'),
    'chest': '■',
    'tools': '*'
  };
  //mapJSON = loadJSON('assets/map.json');
}

///***SETUP***///
function setup() {

  //Set up font
  textFont(font);
  textSize(16);
  colDict = {
    error: color(255, 0, 0),
    wooden: color(72, 48, 24),
    oak: color(202, 134, 66),
    stone: 128,
    tin: 192,
    golden: color(255, 210, 0),
    dirt: color(64, 48, 41),
    grass: color(32, 75, 32),
    sand: color(72, 72, 16),
    gravel: color(48, 48, 48),
    leaves_green: color(16, 128, 16),
    leaves_autumn: color(212, 91, 18),
    leaves_dark: color(128, 80, 212)
  };
  
  makeAlphaTexture('entity_player');
  
  //Create typewriter
  typewriter = new Typewriter();

  //Add dirt to terrain
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      terrain.push('soil_dirt');
    }
  }

  //Load terrain
  for (let i = 0; i < terrain.length; i++) {
    layers['back'].push(terrain[i]);
  }
  
  //Spawn tree structures
  for (let i = 0; i < 5; i++) {
    let x = floor(random(MAP_W * 0.75) + (MAP_W*0.125));
    let y = floor(random(MAP_H * 0.75) + (MAP_H*0.125));
    structures.push(new Tree(x, y, 'oak', 'green'));
  }

  //Load structures 
  for (let i = 0; i < structures.length; i++) {
    structures[i].loadToMap();
  }

  //Create chunks


  //Set up canvas and style stuff
  createCanvas(FONT_W * round(VIEWPORT_W * 1.5), FONT_H * round(VIEWPORT_H * 1.5));
  noSmooth();

}

///***DRAW***///
function draw() {

  //Clear screen
  background(0);

  //Draw map borders
  typewriter.drawScreenBorders();

  //Show stuff in the back
  i = 0;
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      if (layers['back'][i] && x-cam.x >= 0 && x-cam.x < VIEWPORT_W && y-cam.y >= 0 && y-cam.y < VIEWPORT_H) {
        image(textures[layers['back'][i]], (x+1-cam.x)*FONT_W, (y+1-cam.y)*FONT_H);
      }
      i++;
    }
  }

  //Show stuff in the middle
  i = 0;
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      if (layers['middle'][i] && x-cam.x >= 0 && x-cam.x < VIEWPORT_W && y-cam.y >= 0 && y-cam.y < VIEWPORT_H) {
        image(textures[layers['middle'][i]], (x+1-cam.x)*FONT_W, (y+1-cam.y)*FONT_H);
      }
      i++;
    }
  }

  //Show items
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    typewriter.type(item.char, item.x, item.y);
  }

  //Show player
  image(textures['entity_player'], (player.pos.x+1-cam.x)*FONT_W+1, (player.pos.y+1-cam.y)*FONT_H-2);

  //Show stuff in the front
  i = 0;
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      if (layers['front'][i] && x-cam.x >= 0 && x-cam.x < VIEWPORT_W && y-cam.y >= 0 && y-cam.y < VIEWPORT_H) {
        image(textures[layers['front'][i]], (x+1-cam.x)*FONT_W, (y+1-cam.y)*FONT_H);
      }
      i++;
    }
  }

  //Show player behind front tiles
  image(textures['entity_player_alpha'], (player.pos.x+1-cam.x)*FONT_W+1, (player.pos.y+1-cam.y)*FONT_H-2);

  //Print framerate constantly
  if (frameRate() < 100) {
    //print(frameRate());
  }

}

///***MOUSE AND KEYBOARD***///
function keyPressed() {

  //According to pressed arrow:
  //-Reset and add velocity
  //-Update facing direction
  //-Move and collide player
  if (keyCode === LEFT_ARROW) {
    player.vel = {
      x: 0,
      y: 0
    }
    player.vel.x = -1;
    player.facing = 'w';
    player.moveAndCollide();
  }
  if (keyCode === RIGHT_ARROW) {
    player.vel = {
      x: 0,
      y: 0
    }
    player.vel.x = 1;
    player.facing = 'e';
    player.moveAndCollide();
  }
  if (keyCode === UP_ARROW) {
    player.vel = {
      x: 0,
      y: 0
    }
    player.vel.y = -1;
    player.facing = 'n';
    player.moveAndCollide();
  }
  if (keyCode === DOWN_ARROW) {
    player.vel = {
      x: 0,
      y: 0
    }
    player.vel.y = 1;
    player.facing = 's';
    player.moveAndCollide();
  }
  if (keyCode == 113) { //F2 key
    print(frameRate());
  }

}

function makeAlphaTexture(texture){
  textures[texture].loadPixels();
  let newTexture = texture+'_alpha';
  textures[newTexture] = createImage(FONT_W, FONT_H);
  textures[newTexture].loadPixels();
  for (let i = 0; i < textures[newTexture].pixels.length*0.25; i++) {
    if (textures[texture].pixels[(i*4)+3] == 255) {
      textures[newTexture].pixels[(i*4)] = 255;
      textures[newTexture].pixels[(i*4)+1] = 255;
      textures[newTexture].pixels[(i*4)+2] = 255;
      textures[newTexture].pixels[(i*4)+3] = 95;
    }
  }
  textures[newTexture].updatePixels();
}