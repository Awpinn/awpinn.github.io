let f = 0.055;
let k = 0.062;
let deltaT = 1.0;
let diffusionA = 1.0;
let diffusionB = 0.5;
let grid;
let next;

function setup() {
  noLoop();
  setInterval(redraw, 0);
  createCanvas(400, 400);
  pixelDensity(1);
  grid = [];
  next = [];
  for (let x = 0; x < width; x++) {
    grid[x] = [];
    next[x] = [];
    for (let y = 0; y < height; y++) {
      grid[x][y] = { a: 1, b: 0 };
      next[x][y] = { a: 1, b: 0 };
    }
  }

  for (var i = (height/2)-5; i < (height/2)+5; i++) {
    for (var j = (width/2)-5; j < (width/2)+5; j++) {
      grid[i][j].b = 1;
    }
  }
}

function draw() {
  background('white');
  for (let x = 1; x < width-1; x++) {
    for (let y = 1; y < height-1; y++) {
      next[x][y].a = updateCell('a', x, y);
      next[x][y].b = updateCell('b', x, y);
      next[x][y].a = constrain(next[x][y].a, 0, 1);
      next[x][y].b = constrain(next[x][y].b, 0, 1);
    }
  }


  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let i = (x + y * width)*4;
      var a = next[x][y].a;
      var b = next[x][y].b;
      var c = floor((a - b) * 255);
      c = constrain(c, 0, 255);
      pixels[i] = c;
      pixels[i + 1] = c;
      pixels[i + 2] = c;
      pixels[i + 3] = 255;
    }
  }
  updatePixels();

  swap();
}

function updateCell(type, x, y) {
  let a = grid[x][y].a;
  let b = grid[x][y].b;
  if (type == 'a') {
    return (a + (diffusionA * laplacianA(x, y)) - (a * b * b) + (f * (1 - a))) * deltaT;
  } if (type == 'b') {  
    return (b + (diffusionB * laplacianB(x, y)) + (a * b * b) - ((k + f) * b)) * deltaT;
  }
}

function swap () {
  var temp = grid;
  grid = next;
  next = temp;
}

function laplacianA(x, y) {
  var sumA = 0;
  sumA += grid[x][y].a * -1;
  sumA += grid[x - 1][y].a * 0.2;
  sumA += grid[x + 1][y].a * 0.2;
  sumA += grid[x][y + 1].a * 0.2;
  sumA += grid[x][y - 1].a * 0.2;
  sumA += grid[x - 1][y - 1].a * 0.05;
  sumA += grid[x + 1][y - 1].a * 0.05;
  sumA += grid[x + 1][y + 1].a * 0.05;
  sumA += grid[x - 1][y + 1].a * 0.05;
  return sumA;
}

function laplacianB(x, y) {
  var sumB = 0;
  sumB += grid[x][y].b * -1;
  sumB += grid[x - 1][y].b * 0.2;
  sumB += grid[x + 1][y].b * 0.2;
  sumB += grid[x][y + 1].b * 0.2;
  sumB += grid[x][y - 1].b * 0.2;
  sumB += grid[x - 1][y - 1].b * 0.05;
  sumB += grid[x + 1][y - 1].b * 0.05;
  sumB += grid[x + 1][y + 1].b * 0.05;
  sumB += grid[x - 1][y + 1].b * 0.05;
  return sumB;
}