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
let selectName;
let selectMaterial;
let selectTool;
let buttonY;
let buttonN;
let buttonExport;
let mapJSON;

function preload(){
  font = loadFont("assets/codepage437.ttf");
  //mapJSON = loadJSON("assets/map.json");
}

function setup() {
  textFont(font);
  textSize(16);
  
  selectName = createSelect();
  selectName.option('wall');
  selectName.option('grass');
  selectName.changed(submitName);
  
  selectMaterial = createSelect();
  selectMaterial.option('stone');
  selectMaterial.option('leaf');
  selectMaterial.changed(submitMaterial);
  
  selectTool = createSelect();
  selectTool.option('place');
  selectTool.option('placeFromTo');
  selectTool.option('del');
  selectTool.option('delFromTo');
  selectTool.changed(submitTool);
  
  buttonY = createButton('Y');
  buttonY.mousePressed(applyToolButton);
  buttonN = createButton('N');
  buttonN.mousePressed(cancelToolButton);
  
  buttonExport = createButton('export');
  buttonExport.mousePressed(exportMap);
  
  typewriter = new Typewriter();
  builder = new Builder();
  
  createCanvas(FONT_W*(MAP_W+2), FONT_H*(round(MAP_H*1.75)));
}


function draw() {
  
  //Clear screen
  background(0);
  
  //Draw map borders
  typewriter.drawScreenBorders();
  
  //Show input text and blinking pointer underscore
  typewriter.input.show();
  
  //Show blocks
  for (let i = 0; i < blocks.length; i++){
    typewriter.type(blocks[i].char,
                    blocks[i].x,blocks[i].y,
                    blocks[i].col);
  }
  
  //Show mouse
  builder.drawOnMouse();
  
  //Show GUI stuff
  for (let i = 0; i < builderStuff.length; i++){
    typewriter.type(builderStuff[i].char,
                    builderStuff[i].x,builderStuff[i].y,
                    builderStuff[i].col);
  }
  
  //Show blocks from loaded map
  if (mapJSON){
    for (let i = 0; i < mapJSON.blocks.length; i++){
    typewriter.type(mapJSON.blocks[i].char,
                   mapJSON.blocks[i].x,mapJSON.blocks[i].y,
                   color(mapJSON.blocks[i].col.levels[0],
                        mapJSON.blocks[i].col.levels[1],
                        mapJSON.blocks[i].col.levels[2],
                        mapJSON.blocks[i].col.levels[3]));
    }
  }
  
}


function exportMap(){
  let map = {
    blocks: blocks,
    items: items,
    entities: entities
  };
  let mapToJson = JSON.stringify(map);
  saveJSON(map,"map.json");
}


function submitName(){
  builder.changeName(selectName.value());
}
function submitMaterial(){
  builder.changeMaterial(selectMaterial.value());
}
function submitTool(){
  builder.changeTool(selectTool.value());
}
function applyToolButton(){
  builder.toolAction(true);
}
function cancelToolButton(){
  builder.toolAction(false);
}


function keyPressed(){
  let input = typewriter.input.line;
  if (key.length == 1){
    //typewriter.input.line += key;
  }
  else if (key == "Backspace"){
    //typewriter.input.line = input.substring(0,input.length-1);
  }
  else if (key == "Enter"){
    //builder.submit(input);
    //typewriter.input.line = "";
  }
  else if (key == "F2"){
    print(mapJSON.blocks[0].col.levels[3]);
  }
}
function mousePressed(){
  
  if (mouseY > (MAP_H+1)*FONT_H){
    return;
  }
  
  if ((builder.tool == "place") && builder.object.char != ""){
    for (let i = 0; i < blocks.length; i++){
      if (builder.cursorX-1 == blocks[i].x && builder.cursorY-1 == blocks[i].y){
        blocks.splice(i,1);
      }
    }
    blocks.push({
      char: builder.object.char,
      x:builder.cursorX-1,
      y:builder.cursorY-1,
      col: builder.object.col
    });
  }
  else if (builder.tool == "del"){
    for (let i = 0; i < blocks.length; i++){
      if (builder.cursorX-1 == blocks[i].x && builder.cursorY-1 == blocks[i].y){
        blocks.splice(i,1);
      }
    }
  }
  else if (builder.tool == "delFromTo" || builder.tool == "placeFromTo"){
    if (builder.sel1 == null){
      builder.sel1 = {
        x: builder.cursorX-1,
        y: builder.cursorY-1
      };
    }
    else {
      builder.sel2 = {
        x: builder.cursorX-1,
        y: builder.cursorY-1
      };
    }
  }
}
