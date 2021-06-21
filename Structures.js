class Structure {

  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.layers = {
      'back': [],
      'middle': [],
      'front': []
    }
    this.breaking = false;
    this.index = structures.length;
  }

  loadToMap() {
    for (let i = 0; i < this.layers['back'].length; i++) {
      layers['back'].push(this.layers['back'][i]);
    }
    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        let index = (y*MAP_W)+x;
        if (this.layers['middle'][index]) {
          layers['middle'][index] = this.layers['middle'][index];
        }
        if (this.layers['front'][index]) {
          layers['front'][index] = this.layers['front'][index];
        }
      }
    }
  }

}

class Tree extends Structure {

  constructor(x,y,wood,leaves) {
    super(x,y);
    this.wood = wood;
    this.leaves = leaves;
    this.height = floor(random(4));
    this.height = 4;
    this.generate();
  }

  generate() {

    this.addLog(this.x, this.y, 'middle');

    for (let i = 0; i < this.height; i++) {
      this.addLog(this.x, this.y-i-1, 'front');
    }

    let logsInFront = this.layers['front'].length;

    for (let i = 0; i < logsInFront; i++) {
      if (this.layers['front'][i]) {
        
        let log = this.layers['front'][i];
        let x = log.x;
        let y = log.y;
        if (y < this.y-this.height+2) {
          //this.addLeaves(x-1,y+1,layer);
          this.addLeaves(x-1,y);
          this.addLeaves(x-1,y-1);
          this.addLeaves(x,y-1);
          this.addLeaves(x+1,y-1);
          this.addLeaves(x+1,y);
          //this.addLeaves(x+1,y+1,layer);
        }
      }
    }
  }

  addLog(x,y,layer) {

    let index = (y*MAP_W)+x;

    if (this.layers[layer].length == 0) {
      this.layers[layer][index] = 'log_'+this.wood;
    } else {
      let isEmpty = true;
      for (let i = 0; i < this.layers[layer].length; i++) {
        if (this.layers[layer][i]) {
          let log = this.layers[layer][i];
          if (log.x == x && log.y == y) {
            isEmpty = false;
          }
        }
      }
      if (isEmpty) {
        this.layers[layer][index] = 'log_'+this.wood;
      }
    }

    let rng = floor(random(2));

    switch(rng) {
      case 0:
        return;
      case 1:
        this.x = x;
        break;
    }

    rng = floor(random(3));
    let xOff;

    switch(rng) {
      case 0:
        return;
      case 1: 
        xOff = -1;
        break;
      case 2:
        xOff = 1;
        break;
    }   

    this.addLog(x+xOff, y, layer);
  }

  addLeaves(x,y) {

    let index = (y*MAP_W)+x;

    let rng = floor(random(3));
    if (rng == 0) {
      return;
    }

    let isEmpty = true;
    for (let i = 0; i < this.layers[layer].length; i++) {
      let log = this.layers[layer][i];
      if (log.x == x && log.y == y) {
        isEmpty = false;
      }
    }
    if (isEmpty) {
      this.layers['front'][index] = 'leaves_green';
      
    }
  }

}