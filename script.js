var $canvas = $('#canvas');

//setup grid
function drawGrid() {
    //columns
    for (var i = 1; i <= 10; i++) {
        $canvas.drawLine({
            strokeStyle: 'black',
            strokeWidth: 1,
            rounded: true,
            closed: true,
            x1: i * 32,
            y1: 0,
            x2: i * 32,
            y2: 640
        });
    }
    //rows
    for (var j = 1; j <= 20; j++) {
        $canvas.drawLine({
            strokeStyle: 'black',
            strokeWidth: 1,
            rounded: true,
            closed: true,
            x1: 0,
            y1: j * 32,
            x2: 320,
            y2: j * 32
        });
    }
}


//timing

var time = 1000;

//representation of grid, 0 = empty, 1 = filled
var grid = new Array(24);
var placed = new Array(24);

for (var g = 0; g < 24; g++) {
    grid[g] = new Array(12);
    placed[g] = new Array(12);
    for (var h = 0; h < 12; h++) {
        grid[g][h] = 0;
        placed[g][h] = 0;
    }
}

//representation of blocks - 2D boolean array
var blocks = [
    [
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0]
    ], // I
    [
        [2, 2],
        [2, 2]
    ], // O
    [
        [3, 3, 3],
        [0, 3, 0],
        [0, 0, 0]
    ], // T
    [
        [4, 4, 0],
        [0, 4, 4],
        [0, 0, 0]
    ], // S
    [
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0]
    ], // Z
    [
        [6, 6, 6],
        [0, 0, 6],
        [0, 0, 0]
    ], // J
    [
        [7, 7, 7],
        [7, 0, 0],
        [0, 0, 0]
    ] // L
];

var blockNames = ["I", "O", "T", "S", "Z", "J", "L"];
// for rotation
var centers = [
    [0, 0],
    [0, 0],
    [0, 1],
    [1, 1],
    [1, 1],
    [0, 1],
    [0, 1]
];

var colors = ["cyan", "yellow", "purple", "green", "red", "blue", "orange"];

var curBlock;
var hasBlock = false;


//abstract-like class for each block
class Block {
    //type  = 2D array config, name = 1 character abbreviation
    constructor(type, name, center, pos) {
        this.type = type;
        this.name = name;
        this.center = center;
        this.pos = pos;
      this.rostate = 1;
    }
    //rotate block 90 degrees clockwise
    


}



function clearGrid() {
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[0].length; j++) {
            grid[i][j] = 0;
        }
    }
}

//add new block to grid
function addBlock() {
    var index = Math.floor(Math.random() * (7));

    var name = blockNames[index];
    var blocktype = blocks[index]
    var center = centers[index];
    var pos = [20, 0];
    center[0] += 20;
    curBlock = new Block(blocktype, name, center, pos);

    //add to grid
    for (var k = 0; k < blocktype.length; k++) {
        for (var l = 0; l < blocktype[0].length; l++) {
            grid[k + 20][l] = blocktype[k][l];//start from 20th row
        }
    }


}


function canMove() {
    var free = true;
    var shape = curBlock.type;
    var col = curBlock.pos[1];
    var row = curBlock.pos[0];
    try {
        for (var n = 0; n < shape.length; n++) {
            var y = row + n - 1;

            for (var m = 0; m < shape.length; m++) {
                //check for positions lower in placed
                var x = col + m;
              
                if(grid[y+1][x] > 0){
                  if (placed[y][x] != 0) {//future box filled
                      free = false;
                  }
                }

            }
        }
    } catch (err) {
        //hit bottom
        free = false;
    } finally {
        if (free) {
            //set bottom left pos one row below (to be reassigned in grid)
            
            curBlock.pos[0] = curBlock.pos[0] - 1;
        }
        return free;
    }


}

//move grid one row down (if possible) and draw
function moveBlock() {
    //check if block can move down
    if (canMove()) {
        clearGrid();

        var pos = curBlock.pos;
        var num = blockNames.indexOf(curBlock.name) + 1;
        var shape = curBlock.type;
        for (var i = 0; i < shape.length; i++) {
            for (var j = 0; j < shape.length; j++) {
                if (shape[i][j] != 0) {
                    grid[pos[0] + i][pos[1] + j] = num;
                }
            }
        }
    } else {

        //block can't move - add to placed array
        var pos = curBlock.pos;
        var num = blockNames.indexOf(curBlock.name) + 1;
        var shape = curBlock.type;
        for (var i = 0; i < shape.length; i++) {
            for (var j = 0; j < shape.length; j++) {
                if (shape[i][j] != 0) {
                    placed[pos[0] + i][pos[1] + j] = num;
                }
            }
        }
        hasBlock = false;
    }

}
function rotateCounterClockwise(a){
  var n=a.length;
			for (var i=0; i<n/2; i++) {
				for (var j=i; j<n-i-1; j++) {
					var tmp=a[i][j];
					a[i][j]=a[j][n-i-1];
					a[j][n-i-1]=a[n-i-1][n-j-1];
					a[n-i-1][n-j-1]=a[n-j-1][i];
					a[n-j-1][i]=tmp;
				}
			}
  return a;
      
}

function rotate(){
  var shape = curBlock.type;
  if(shape.length == 4){
    var free = true;
      var changed = rotateCounterClockwise(shape);
        var col = curBlock.pos[1];
    var row = curBlock.pos[0];
      try{
        for(var i = 0; i < 4; i++){
          for(var j = 0; j < 4; j++){
            if(changed[i][j] != 0){
              if(placed[row+i][col+j] !=0){
                free = false;
              }
            }
          }
        }
      }catch(err){
        //walls
        free = false;
      }finally{
        if(free){
          curBlock.shape = changed;
        }
        $('canvas').clearCanvas();
        moveBlock();
      }  
  }else if(shape.length == 3){
      var free = true;
      var changed = rotateCounterClockwise(shape);
        var col = curBlock.pos[1];
    var row = curBlock.pos[0];
      try{
        for(var i = 0; i < 3; i++){
          for(var j = 0; j < 3; j++){
            if(changed[i][j] != 0){
              if(placed[row+i][col+j] !=0){
                free = false;
              }
            }
          }
        }
      }catch(err){
        //walls
        free = false;
      }finally{
        if(free){
          curBlock.shape = changed;
        }
        $('canvas').clearCanvas();
        moveBlock();
      }     
           }
}

//draw current grid and placed to convas
function drawCurrentGrid() {


    for (var i = 0; i < 20; i++) {
        for (var j = 0; j < 10; j++) {
            if (grid[i][j] > 0) {
                var num = grid[i][j];
                var color = colors[num - 1];

                var y = 1 + j * 32;
                var x = 612 - (1 + i * 32);


                $canvas.drawRect({
                    fillStyle: color,
                    strokeStyle: color,
                    strokeWidth: 4,
                    x: y,
                    y: x, // 1+i*32, j*32
                    fromCenter: false,
                    width: 30,
                    height: 28
                });
            } else if (placed[i][j] > 0) {
                var num = placed[i][j];
                var color = colors[num - 1];

                var y = 1 + j * 32;
                var x = 612 - (1 + i * 32);

                $canvas.drawRect({
                    fillStyle: color,
                    strokeStyle: color,
                    strokeWidth: 4,
                    x: y,
                    y: x, // 1+i*32, j*32
                    fromCenter: false,
                    width: 30,
                    height: 28
                });
            }

        }
    }

}

function checkFull(arr){
  var res = true;
  for(var i = 0; i < arr.length;i++){
    if(arr[i] == 0){
      res = false;
    }
  }
  return res;
}

function clearRows(){
  var r = -1;
  for(var i = 0; i < placed.length;i++){
    if(checkFull(placed[i])){
      for(var j = 0; j < placed[i].length;j++){
    placed[i][j] = 0;
  }
     r = i;
    }
  }
  if(r!=-1){
for(var i =r; i < 24; i++){

for(var j =0;j < 10; j++){
try{
placed[i] = placed[i+1]
}catch(err){}
}
}
placed[23] = [0,0,0,0,0,0,0,0,0,0];
    $('canvas').clearCanvas();
    drawCurrentGrid();
     drawGrid();
    

       
  }
}

function update() {
  
    if (!hasBlock) {
        addBlock();
        hasBlock = true;
    } else {
        $('canvas').clearCanvas();
        moveBlock();
        drawCurrentGrid();
        drawGrid();
      if(curBlock.name == 'I'){
      console.log(grid)
      }
    }
  clearRows();
}

//user controls
$(document).on('keydown', function(e){
  var key = e.which;
  switch(key) {
    case 39:
      if(canMoveDir("right")){
        clearGrid();
        var pos = curBlock.pos;
        var num = blockNames.indexOf(curBlock.name) + 1;
        var shape = curBlock.type;
        for (var i = 0; i < shape.length; i++) {
            for (var j = 0; j < shape.length; j++) {
                if (shape[i][j] != 0) {
                    grid[pos[0] + i][pos[1] + j] = num;
                }
            }
        }
      }
      break;
    case 37:
      if(canMoveDir("left")){
        clearGrid();
        var pos = curBlock.pos;
        var num = blockNames.indexOf(curBlock.name) + 1;
        var shape = curBlock.type;
        for (var i = 0; i < shape.length; i++) {
            for (var j = 0; j < shape.length; j++) {
                if (shape[i][j] != 0) {
                    grid[pos[0] + i][pos[1] + j] = num;
                }
            }
        }
      }
      break;
    case 38:
      rotate();
      break;
    case 40:
      time = 50;
    default:
}
  $('canvas').clearCanvas();
  drawCurrentGrid();
  drawGrid();
  
});

$(document).on("keyup", function(e){
  var key = e.which;
  switch(key){
    case 40:
      time = 1000;
      break;    
            }
});

function canMoveDir(direction) {
    if (direction == "left") {
        //check if left side is clear - walls and placed 
        var state = true;
        var pos = curBlock.type;
        var shape = curBlock.type;
        var col = curBlock.pos[1];
        var row = curBlock.pos[0];
      try{
        for (var i = 0; i < shape.length; i++) {
            var y = row + i;
            for (var j = 0; j < shape.length; j++) {
                var x = col + j - 1;
              if(grid[y][x+1] != 0){
                if (placed[y][x] != 0) {
                    state = false;
                }
              }
            }
        }
      }catch(err){
        //hit right wall
        state = false;
      }finally{
        if(state){
          curBlock.pos[1] = curBlock.pos[1] - 1;
        }
        return state;
      }
    } else {
        //check if right side is clear
      var state = true;
        var pos = curBlock.type;
      var name = curBlock.name;
        var shape = curBlock.type;
        var col = curBlock.pos[1];
        var row = curBlock.pos[0];
      
      try{
        for (var i = 0; i < shape.length; i++) {
            var y = row + i;
            for (var j = 0; j < shape.length; j++) {
                var x = col + j + 1;
              if(name !== 'I'){
                if(col>=7){
                  throw "should not move";
                      console.log("test");
                    }else if(grid[y][x-1] != 0){
                if (placed[y][x] != 0) {
                    console.log(name);
                    
                    
                  }
                }
              }else{
                if(grid[y][x-1] != 0){
                if (placed[y][x] != 0) {
                  state = false;
                  }
                }
              }
            }
        }
      }catch(err){
        //hit right wall
        state = false;
      }finally{
        if(state){
          curBlock.pos[1] = curBlock.pos[1] + 1;
        }
        return state;
      }
    }
}


// timestamp of the last game() call
var last = 0;
var requestId;
function game(now) {
  requestId = undefined;

    //update grid every second, increase with level
    if (!last || now - last >= time) {
        last = now;
        update();
    
    }

    start();
}

function start() {
    if (!requestId) {
       requestId = window.requestAnimationFrame(game);
    }
}

function stop() {
    if (requestId) {
       window.cancelAnimationFrame(requestId);
       requestId = undefined;
    }
}

drawGrid();//draw background grid
