///***GLOBAL CONSTANTS***///
const FONT_W = 9;
const FONT_H = 12;
const MAP_W = 49;
const MAP_H = 21;

///***GLOBAL VARIABLES***///

//Font and colors
let font;
let colors;

//Engine
let typewriter;
let pendingUpdate;
let builder;
//let mapJSON;

//Map
let objs = {
  back: [],
  middle: [],
  front: []
};
let items = [];
let entities = [];
let player;

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
  font = loadFont("assets/codepage437.ttf");
  //mapJSON = loadJSON("assets/map.json");
}

///***SETUP***///
function setup() {

  //Set up font
  textFont(font);
  textSize(16);
  colors = {
    error: color(255, 0, 0),
    wooden: color(72, 48, 24),
    stone: 128,
    tin: 192,
    golden: color(255, 210, 0),
    dirt: color(64, 48, 41),
    grass: color(32, 75, 32),
    sand: color(72, 72, 16),
    gravel: color(48, 48, 48),
    leaves_normal: color(16, 128, 16),
    leaves_autumn: color(212, 91, 18),
    leaves_dark: color(128, 80, 212)
  };

  //Get select elements
  selectLayer = document.getElementById("selectLayer");
  selectType = document.getElementById("selectType");
  selectMaterial = document.getElementById("selectMaterial");
  selectProperty = document.getElementById("selectProperty");
  selectTool = document.getElementById("selectTool");

  //Create typewriter, builder and player
  typewriter = new Typewriter();
  builder = new Builder();
  player = new Player(0, 0);

  submitLayer();
  submitType();

  //Get button elements
  buttonExport = document.getElementById("buttonExport");

  //Set up canvas
  createCanvas(FONT_W * (MAP_W + 2), FONT_H * round(MAP_H * 1.75));

  pendingUpdate = true;

}

///***DRAW***///
function draw() {

  //Draw map when updated
  if (pendingUpdate) {
    update();
  }

  player.showInventory();

  //Show builder cursor
  if (builder.isActive) {
    builder.showCursor();
  }

}

///***UPDATE***///
function update() {

  if (!builder.isActive){
    pendingUpdate = false;
  }

  //Clear screen
  background(0);

  //Draw map borders
  typewriter.drawScreenBorders();

  //Show objs in the back
  for (let i = 0; i < objs.back.length; i++) {
    typewriter.type(objs.back[i].char, objs.back[i].x, objs.back[i].y, objs.back[i].col);
  }

  //Show objs in the middle
  for (let i = 0; i < objs.middle.length; i++) {
    typewriter.type(objs.middle[i].char, objs.middle[i].x, objs.middle[i].y, objs.middle[i].col);
  }

  //Show items
  for (let i = 0; i < items.length; i++) {
    typewriter.type(items[i].char, items[i].x, items[i].y, items[i].col);
  }

  //Show player
  typewriter.type('@', player.x, player.y, player.col);

  //Show objs in the front
  for (let i = 0; i < objs.front.length; i++) {
    typewriter.type(objs.front[i].char, objs.front[i].x, objs.front[i].y, objs.front[i].col);
  }

  let colPlyr = player.col.levels;

  //Show player behind front layer
  typewriter.type('@', player.x, player.y, color(colPlyr[0], colPlyr[0], colPlyr[0], 96));
}

///***MOUSE AND KEYBOARD***///
function mousePressed() {

  //If mouse is outside the map, dismiss click
  if (mouseX < FONT_W || mouseX > width - FONT_W || mouseY < FONT_H || mouseY > (MAP_H + 1) * FONT_H || !builder.isActive) {
    return;
  }
  //TOOL: PLACE
  if (builder.tool == "place" && builder.object.char != "") {

    builder.place();

    //TOOL: DEL
  } else if (builder.tool == "del") {
    for (let i = 0; i < builder.currentLayer.length; i++) {
      if (
        builder.cursorX == builder.currentLayer[i].x &&
        builder.cursorY == builder.currentLayer[i].y
      ) {
        builder.currentLayer.splice(i, 1);
      }
    }

    //TOOL: DELFROMTO / PLACEFROMTO
  } else if (builder.tool == "delFromTo" || builder.tool == "placeFromTo") {
    builder.sel1 = {
      x: builder.cursorX,
      y: builder.cursorY,
    };
    builder.dragSel2 = true;
  }
}

function mouseReleased() {
  builder.dragSel2 = false;
}

function keyPressed() {

  let moveDir;

  switch (keyCode) {
    //Enter or leave  builder (B KEY)
    case 66:
      builder.isActive = !builder.isActive;
      pendingUpdate = true;
    //Apply or cancel tool selection (ESCAPE AND ENTER KEYS)
    case ESCAPE:
      builder.cancelTool();
      return;
    case ENTER:
      if (player.isOnItem) {
        player.selectOption();
      } else if (player.isOnMenu) {
        player.selectItem();
      }
      builder.applyTool();
      return;
    //Inventory (I KEY)
    case 73:
      player.isOnMenu = !player.isOnMenu;
      player.isOnItem = false;
      player.selectedOption = 0;
      player.scrollMenu();
      return;
    //Move player
    case LEFT_ARROW:
      moveDir = 'l';
      break;
    case RIGHT_ARROW:
      moveDir = 'r';
      break;
    case UP_ARROW:
      moveDir = 'u';
      break;
    case DOWN_ARROW:
      moveDir = 'd';
      break;
    default:
      return;
  }

  //If player is on menu, then arrow keys select, else arrow keys move player
  if (player.isOnMenu) {
    player.scrollMenu(moveDir);
  } else {
    player.move(moveDir);
    pendingUpdate = true;
  }

}

///***HTML ELEMENTS STUFF***///
function submitLayer() {
  switch (selectLayer.value) {
    case "back":
      builder.currentLayer = objs.back;
      break;
    case "middle":
      builder.currentLayer = objs.middle;
      break;
    case "front":
      builder.currentLayer = objs.front;
      break;
  }
}

function submitType() {

  builder.object = new Obj();
  builder.object.category = document.querySelector('#selectType option:checked').parentElement.label;

  emptySelect(selectMaterial);

  switch (selectType.value) {
    case "wall":
      addOptionToSelect(selectMaterial, 'stone');
      addOptionToSelect(selectMaterial, 'wooden');
      break;
    case "soil":
      addOptionToSelect(selectMaterial, 'dirt');
      addOptionToSelect(selectMaterial, 'grass');
      addOptionToSelect(selectMaterial, 'sand');
      addOptionToSelect(selectMaterial, 'gravel');
      break;
    case "leaves":
      addOptionToSelect(selectMaterial, 'leaves_normal');
      addOptionToSelect(selectMaterial, 'leaves_autumn');
      addOptionToSelect(selectMaterial, 'leaves_dark');
      break;
    case "chest":
      addOptionToSelect(selectMaterial, 'wooden');
      addOptionToSelect(selectMaterial, 'golden');
      break;
    default:
      if (builder.object.category == "equipment") {

        builder.object = new Item();
        builder.object.category = document.querySelector('#selectType option:checked').parentElement.label;

        addOptionToSelect(selectMaterial, 'wooden');
        addOptionToSelect(selectMaterial, 'stone');
        addOptionToSelect(selectMaterial, 'tin');
        addOptionToSelect(selectMaterial, 'golden');
      }
      break;
  }
  builder.object.changeType(selectType.value);
  submitMaterial();
}

function submitMaterial() {
  builder.object.changeMaterial(selectMaterial.value);
}

function submitProperty() {
  builder.object.addProperty(selectProperty.value);
}

function submitTool() {
  builder.changeTool(selectTool.value);
}

function applyTool() {
  builder.toolAction(true);
}

function cancelTool() {
  builder.toolAction(false);
}

function emptySelect(element) {
  for (let i = 0; i < element.length; i++) {
    element.remove(i);
    i--;
  }
}

function addOptionToSelect(element, option) {
  let opt = document.createElement('option');
  opt.appendChild(document.createTextNode(option));
  opt.value = option;
  element.appendChild(opt);
}

// function exportMap() {
//   let map = {
//     objs: objs,
//     items: items,
//     entities: entities,
//   };
//   saveJSON(map, "map.json");
// }
