///***GLOBAL CONSTANTS***///
const GLOBALRESIZE = 2;
const FONTSIZE = 16;
const FONT_W = 9*GLOBALRESIZE;
const FONT_H = 12*GLOBALRESIZE;
const MAP_W = 96;
const MAP_H = 48;
const VIEWPORT_W = 48;
const VIEWPORT_H = 24;

///***GLOBAL CONSTANTS***///

//Fonts
let font;

//World
let layers = {
  'back': [],
  'middle': [],
  'front': [],

  updateable: {
    'back': [],
    'middle': [],
    'front': []
  },

  'items': [],
  'entities': []
};
let terrain = [];
let structures = [];

//GUI
let navigation = 'main';

//Dictionaries
let colDict;
let textures;
let tiles = {
  'log': {
    isCollidable: true,
    isBreakable: true,
    state: 'solid',
    material: 'wooden',
    update: function(index) {
      if (layers.updateable['middle'][index].wear >= 100) {
        layers.updateable['middle'][index] = null;
        layers['middle'][index] = null;
        return 'broke';
      } else {
        return 'damaged';
      }
    }
  },
  'fence': {
    isCollidable: true,
    isBreakable: true,
    state: 'solid',
    material: 'wooden',
    update: function(index) {
      if (layers.updateable['middle'][index].wear >= 100) {
        layers.updateable['middle'][index] = null;
        layers['middle'][index] = null;
      }
    }
  },
  'limestone': {
    isCollidable: true,
    isBreakable: true,
    state: 'solid',
    material: 'rock',
    update: function(index) {
      if (layers.updateable['middle'][index].wear >= 100) {
        layers.updateable['middle'][index] = null;
        layers['middle'][index] = null;
      }
    }
  },
  'water': {
    isCollidable: false,
    isBreakable: false,
    state: 'liquid',
    viscosity: 0,
    depth: 100,
    update: function(index) {
      
    },
    'update_liquid': function() {
      //Spread out in relation to viscosity
    }
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
  vel: {
    x: 0,
    y: 0
  },
  stats: {
    hp: 100
  },
  inventory: {
    
  },
  equipped: {
    head: [],
    chest: [],
    hands: [],
    legs: [],
    feet: []
  },
  speed: 1,
  facing: 'e',
  texture: 'player',
  name: 'Oldman',

  moveAndCollide: function(dir) {

    //Reset velocity
    this.vel = {
      x: 0,
      y: 0
    }

    //Set velocity and facing direction according to pressed key
    switch (dir) {
      case LEFT_ARROW:
        this.vel.x = -1;
        this.facing = 'w';
        break;
      case RIGHT_ARROW:
        this.vel.x = 1;
        this.facing = 'e';
        break;
      case UP_ARROW:
        this.vel.y = -1;
        this.facing = 'n';
        break;
      case DOWN_ARROW:
        this.vel.y = 1;
        this.facing = 's';
        break;
      default:
        return;
    }
    //Calculate target posiiton
    let targetPos = {
      x: this.pos.x + this.vel.x,
      y: this.pos.y + this.vel.y
    }
    
    //Get target tile full name ('type_material')
    let targetTileIndex = (targetPos.y*MAP_W)+targetPos.x;
    let targetTileName = layers['middle'][targetTileIndex];

    //If it exists
    if (targetTileName) {
      //Get target tile (only the bit before the underscore)
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
      print('collided for the first time and added updateable tile for: '+tile);
      layers.updateable['middle'][index] = {
        tile: tile,
        wear: 0
      }
    }

    //Search for (strongest of all available, still not implemented) tool
    let tool;
    for (let i = 0; i < player.inventory['hands'].length; i++) {
      if (player.inventory.hands[i].isEquippable){
        tool = player.inventory.hands[i];
      }
    }

    //Wear tile if possible
    let materialsCoef = materials[tool.material].hardness / materials[tiles[tile].material].hardness;

    if (materialsCoef>=1) {
      layers.updateable.middle[index].wear += materialsCoef*10;;
    }
    
    let updated = tiles[tile].update(index);

    switch(updated) {
      case 'broke':
        console.log('you broke a '+tile);
        break;
      case 'damaged':
        console.log('you damaged a '+tile+' with your '+tool.name);
        break;
    }
  }
};

player.equipped.hands.push(new Tool('old','wooden','axe'));

layers['entities'].push(player);

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

  //Generate terrain (full map filled with dirt)
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      terrain.push('soil_dirt');
    }
  }

  //Load terrain
  for (let i = 0; i < terrain.length; i++) {
    layers['back'].push(terrain[i]);
  }
  
  //Generate tree structures
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

  //Draw viewport (tiles, items, entities, etc)
  drawViewport();

  //Draw gui (borders, stats, menu, etc)
  drawGui();


  //Print framerate constantly
  if (frameRate() < 100) {
    //print(frameRate());
  }

}

function drawViewport() {

  //Draw back layer
  typewriter.drawLayer('back');
  
  //Draw middle layer
  typewriter.drawLayer('middle');

  //Draw items
  typewriter.drawItems();

  //Draw entities
  typewriter.drawEntities('regular');

  //Draw front layer
  typewriter.drawLayer('front');

  //Draw entities behind tiles
  typewriter.drawEntities('alpha');
  
}

function drawGui() {

  //Draw viewport borders
  typewriter.drawScreenBorders();

  //Draw player name and stats
  typewriter.type(player.name, VIEWPORT_W+3, 0, 1);
  typewriter.type('HP: '+player.stats.hp, VIEWPORT_W+3, 1, 1);
  for (let i = 0; i < width-VIEWPORT_W+3; i++) {
    typewriter.type('-', VIEWPORT_W+3+i,3, GLOBALRESIZE);
  }

  switch(navigation) {
    case 'main':
      //Draw messages
      typewriter.type('messages go here', VIEWPORT_W+3, 4, 1);
      break;
    case 'inventory':
      //Draw inventory
      drawInventory();
      break;
  }

}

function drawInventory(){
  for (let i = 0; i < player.equipped.head.length; i++) {
    typewriter.type(i+1+'. '+player.equipped.head[i].name+' (E)', VIEWPORT_W+3, i+4, 1);
  }
  for (let i = 0; i < player.equipped.chest.length; i++) {
    typewriter.type(i+1+'. '+player.equipped.chest[i].name+' (E)', VIEWPORT_W+3, i+4+player.equipped.head.length, 1);
  }
  for (let i = 0; i < player.equipped.hands.length; i++) {
    typewriter.type(i+1+'. '+player.equipped.hands[i].name+' (E)', VIEWPORT_W+3, i+4+player.equipped.chest.length, 1);
  }
  for (let i = 0; i < player.equipped.legs.length; i++) {
    typewriter.type(i+1+'. '+player.equipped.legs[i].name+' (E)', VIEWPORT_W+3, i+4+player.equipped.legs.length, 1);
  }
  for (let i = 0; i < player.equipped.feet.length; i++) {
    typewriter.type(i+1+'. '+player.equipped.feet[i].name+' (E)', VIEWPORT_W+3, i+4+player.equipped.feet.length, 1);
  }
}

///***MOUSE AND KEYBOARD***///
function keyPressed() {

  print(keyCode);

  //Move and collide player according to pressed key

  player.moveAndCollide(keyCode);

  switch(keyCode) {
    case 27: //ESC key
      navigation = 'main';
      break;
    case 73: //i key
      navigation = 'inventory';
      break;
    case 113: //F2 key
      print('this is a debug message printed via F2 key');
      break;
  }

}

///***UTILITIES***///
function makeAlphaTexture(texture){
  textures[texture].loadPixels();
  let newTexture = texture+'_alpha';
  textures[newTexture] = createImage(textures[texture].width, textures[texture].height);
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