//Global constants
const FONT_W = 9;
const FONT_H = 12;
const MAP_W = 49;
const MAP_H = 21;

//Global variables
let font;
let typewriter;
let builder;
let blocks = [];
let items = [];
let entities = [];
let builderStuff = [];
let selectType;
let selectMaterial;
let selectTool;
let buttonExport;
let mapJSON;
let colors;
let player;

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
    stone: 128,
    wooden: color(72, 48, 24),
    golden: color(255, 210, 0),
    dirt: color(64, 48, 41),
    grass: color(32, 75, 32),
    sand: color(72, 72, 16),
    gravel: color(48, 48, 48),
    leaves_normal: color(16, 128, 16),
    leaves_autumn: color(212, 91, 18),
    leaves_dark: color(255, 0, 0)
  };

  //Get select elements
  selectType = document.getElementById("selectType");
  selectMaterial = document.getElementById("selectMaterial");
  selectTool = document.getElementById("selectTool");

  //Get button elements
  buttonExport = document.getElementById("buttonExport");

  //Create typewriter, builder and player
  typewriter = new Typewriter();
  builder = new Builder();
  player = new Player(0, 0);
  submitType();

  //Set up canvas
  createCanvas(FONT_W * (MAP_W + 2), FONT_H * round(MAP_H * 1.75));


}

///***DRAW***///
function draw() {

  //Clear screen
  background(0);

  //Draw map borders
  typewriter.drawScreenBorders();

  //Show input text and blinking pointer underscore
  typewriter.input.show();

  //Show blocks
  for (let i = 0; i < blocks.length; i++) {
    typewriter.type(blocks[i].char, blocks[i].x, blocks[i].y, blocks[i].col);
  }

  //Show player
  typewriter.type('@', player.x, player.y, player.col);

  //Show builder cursor
  builder.showCursor();

  //Show builder GUI stuff
  for (let i = 0; i < builderStuff.length; i++) {
    typewriter.type(
      builderStuff[i].char,
      builderStuff[i].x,
      builderStuff[i].y,
      builderStuff[i].col
    );
  }

  //Show blocks from loaded map
  // if (mapJSON) {
  //   for (let i = 0; i < mapJSON.blocks.length; i++) {
  //     typewriter.type(
  //       mapJSON.blocks[i].char,
  //       mapJSON.blocks[i].x,
  //       mapJSON.blocks[i].y,
  //       color(
  //         mapJSON.blocks[i].col.levels[0],
  //         mapJSON.blocks[i].col.levels[1],
  //         mapJSON.blocks[i].col.levels[2],
  //         mapJSON.blocks[i].col.levels[3]
  //       )
  //     );
  //   }
  // }
}

///***HTML ELEMENTS STUFF***///
function submitType() {
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
      addOptionToSelect(selectMaterial, 'normal');
      addOptionToSelect(selectMaterial, 'autumn');
      addOptionToSelect(selectMaterial, 'dark');
      break;
    case "chest":
      addOptionToSelect(selectMaterial, 'wooden');
      addOptionToSelect(selectMaterial, 'golden');
  }
  builder.object.changeType(selectType.value);
  submitMaterial();
}
function submitMaterial() {
  builder.object.changeMaterial(selectMaterial.value);
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
function exportMap() {
  let map = {
    blocks: blocks,
    items: items,
    entities: entities,
  };
  saveJSON(map, "map.json");
}

///***MOUSE AND KEYBOARD***///
function mousePressed() {

  //If mouse is outside the map, dismiss click
  if (mouseY > (MAP_H + 1) * FONT_H || mouseX > width) {
    return;
  }

  //TOOL: PLACE
  if (builder.tool == "place" && builder.object.char != "") {
    //First check if there's already an obj there, if so delete it
    for (let i = 0; i < blocks.length; i++) {
      if (
        builder.cursorX - 1 == blocks[i].x &&
        builder.cursorY - 1 == blocks[i].y
      ) {
        print("spliced");
        blocks.splice(i, 1);
      }
    }
    //Then add new obj
    let obj = builder.object;
    blocks.push(new Obj(obj.x,obj.y,obj.type,obj.material));

    //TOOL: DEL
  } else if (builder.tool == "del") {
    for (let i = 0; i < blocks.length; i++) {
      if (
        builder.cursorX - 1 == blocks[i].x &&
        builder.cursorY - 1 == blocks[i].y
      ) {
        blocks.splice(i, 1);
      }
    }

    //TOOL: DELFROMTO / PLACEFROMTO
  } else if (builder.tool == "delFromTo" || builder.tool == "placeFromTo") {
    builder.sel1 = {
      x: builder.cursorX - 1,
      y: builder.cursorY - 1,
    };
    builder.dragSel2 = true;
  }
}
function mouseReleased() {
  builder.dragSel2 = false;
}
function keyPressed() {

  //Apply or cancel tool selection
  if (keyCode === ESCAPE) {
    cancelTool();
  } else if (keyCode === ENTER) {
    applyTool();
  }

  //Move player
  if (keyCode === LEFT_ARROW) {
    player.move('l');
  } else if (keyCode === RIGHT_ARROW) {
    player.move('r');
  } else if (keyCode === UP_ARROW) {
    player.move('u');
  } else if (keyCode === DOWN_ARROW) {
    player.move('d');
  }

  // let input = typewriter.input.line;
  // if (key.length == 1) {
  //   typewriter.input.line += key;
  // } else if (key == "Backspace") {
  //   typewriter.input.line = input.substring(0,input.length-1);
  // } else if (key == "Enter") {
  //   builder.submit(input);
  //   typewriter.input.line = "";
  // } else if (key == "F2") {
  //   print(mapJSON.blocks[0].col.levels[3]);
  // }
}
