///***GLOBAL CONSTANTS***///
const FONT_W = 9;
const FONT_H = 12;
const MAP_W = 48;
const MAP_H = 24;

///***GLOBAL VARIABLES***///

//Font
let font;

//Map
let layers = {
  'back': [],
  'middle': [],
  'front': []
};
let terrain = [];
let structures = [];
let items = [];
let entities = [];
let player = {
  pos: {
    x: 0,
    y: 0
  },
  speed: 1,
  facing: 'e',
  moveAndCollide: function() {
    //Calculate target posiiton
    let targetPos = {
      x: player.pos.x + player.vel.x,
      y: player.pos.y + player.vel.y
    }

    let targetTileName = layers['middle'][(targetPos.y*MAP_W)+targetPos.x];
    let targetTile = '';
    if (targetTileName) {
      for (let i = 0; i < targetTileName.length; i++) {
        if (targetTileName[i] == '_') {
          break;
        }
        targetTile += targetTileName[i];
      }
      if (tiles[targetTile].isCollidable) {
        return;
      }
    }

    player.pos.x = targetPos.x;
    player.pos.y = targetPos.y;

    if (player.pos.x < 0) {
      player.pos.x = 0;
    }
    if (player.pos.x > MAP_W-1) {
      player.pos.x = MAP_W-1;
    }
    if (player.pos.y < 0) {
      player.pos.y = 0;
    }
    if (player.pos.y > MAP_H-1) {
      player.pos.y = MAP_H-1;
    }
  }
};

//Dictionaries
let colDict;
let textures;
let hardness = {
  'oak': 10,
  'wooden': 10,
  'stone': 20,
  'tin': 30,
  'golden': 40
};
let tiles = {
  'log': {
    isCollidable: true
  }
};

//HTML
let selectLayer;
let selectType;
let selectMaterial;
let selectProperty;
let selectTool;
let buttonExport;

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

  //Create typewriter, builder and player
  typewriter = new Typewriter();

  //Set up canvas and style stuff
  createCanvas(FONT_W * (MAP_W + 2), FONT_H * round(MAP_H * 1.5));
  noSmooth();

  //Add dirt to terrain
  for (let x = 0; x < MAP_W; x++) {
    for (let y = 0; y < MAP_H; y++) {
      terrain.push('soil_dirt');
    }
  }

  //Load terrain
  for (let i = 0; i < terrain.length; i++) {
    layers['back'].push(terrain[i]);
  }
  

  //Spawn tree structures
  for (let i = 0; i < 5; i++) {
    let x = floor(random(MAP_W * 0.75) + MAP_W * 0.125);
    let y = floor(random(MAP_H * 0.75) + MAP_H * 0.125);
    structures.push(new Tree(x, y, 'oak', 'green'));
  }

  //Load structures 
  for (let i = 0; i < structures.length; i++) {
    structures[i].loadToMap();
  }

  pendingUpdate = true;

}

///***DRAW***///
function draw() {

  update();

  //Print framerate
  if (frameRate() < 100) {
    //print(frameRate());
  }

}

///***UPDATE***///
function update() {

  //Clear screen
  background(0);

  //Draw map borders
  typewriter.drawScreenBorders();

  //Show stuff in the back
  i = 0;
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      if (layers['back'][i]) {
        image(textures[layers['back'][i]], (x+1)*FONT_W,(y+1)*FONT_H);
      }
      i++;
    }
  }

  //Show stuff in the middle
  i = 0;
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      if (layers['middle'][i]) {
        image(textures[layers['middle'][i]], (x+1)*FONT_W,(y+1)*FONT_H);
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
  image(textures['entity_player'], (player.pos.x+1)*FONT_W+1,(player.pos.y+1)*FONT_H-2);

  //Show stuff in the front
  i = 0;
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      if (layers['front'][i]) {
        image(textures[layers['front'][i]], (x+1)*FONT_W,(y+1)*FONT_H);
      }
      i++;
    }
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

}
