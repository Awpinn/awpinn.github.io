let f = 0.055;
let k = 0.062;
let deltaT = 1;
let diffusionA = 1.0;
let diffusionB = 0.5;
let grid;
let next;
let distance = 250;

function setup() {
  console.log(f, k);
  noLoop();
  setInterval(redraw, 0);
  createCanvas(500, 500);
  pixelDensity(distance/500);
  grid = [];
  next = [];
  for (let x = 0; x < distance; x++) {
    grid[x] = [];
    next[x] = [];
    for (let y = 0; y < distance; y++) {
      grid[x][y] = { a: 1, b: 0 };
      next[x][y] = { a: 1, b: 0 };
    }
  }

  for (var i = (distance/2)-5; i < (distance/2)+5; i++) {
    for (var j = (distance/2)-5; j < (distance/2)+5; j++) {
      grid[i][j].b = 1;
    }
  }
}

function update() {
  for (let x = 1; x < distance-1; x++) {
    for (let y = 1; y < distance-1; y++) {
      next[x][y].a = updateCell('a', x, y);
      next[x][y].b = updateCell('b', x, y);
      next[x][y].a = constrain(next[x][y].a, 0, 1);
      next[x][y].b = constrain(next[x][y].b, 0, 1);
    }
  }
  swap();
}

function mouseDragged() {
  if (mouseX >= 10 && mouseX < (width - 10) && mouseY >= 10 && mouseY < (height - 10)) {
    for (let x = 0; x < distance/50; x++) {
      for (let y = 0; y < distance/50; y++) {
        let tempX = constrain(floor(((mouseX/width)*distance) + x), 0, distance-1);
        let tempY = constrain(floor(((mouseY/height)*distance) + y), 0, distance-1);
        grid[tempX][tempY].a = 0;
        grid[tempX][tempY].b = 0;
      }
    }
  }
}

function draw() {
  background('white');
  update();

  loadPixels();
  for (let x = 0; x < distance; x++) {
    for (let y = 0; y < distance; y++) {
      let i = (x + y * distance)*4;
      var a = next[x][y].a;
      var b = next[x][y].b;
      var c = map((a-b), 0, 1, 1, 0);
      var rgb = new Array();
      rgb['red']=rgb['green']=rgb['blue']=0;
      if (c > 0.01) {
        rgb = hsv2rgb(map(x, 0, distance, 0, 1), map(y, 0, distance, 0, 1), c)
      }
      if (c > 0.9) {
        let cChange = (c-0.9)*10;
        rgb['red'] = rgb['red'] * (1 - cChange) + 255 * cChange;
        rgb['green'] = rgb['green'] * (1 - cChange) + 255 * cChange;
        rgb['blue'] = rgb['blue'] * (1 - cChange) + 255 * cChange;
        if (c > 1) {
          rgb['red'] = 255;
          rgb['green'] = 255;
          rgb['blue'] = 255;
        }
      }
      pixels[i] = rgb['red'];
      pixels[i + 1] = rgb['green'];
      pixels[i + 2] = rgb['blue'];
      pixels[i + 3] = 255;
    }
  }
  updatePixels();
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

function hsv2rgb(h,s,v) {
  // Adapted from http://www.easyrgb.com/math.html
  // hsv values = 0 - 1, rgb values = 0 - 255
  var r, g, b;
  var RGB = new Array();
  if(s==0){
    RGB['red']=RGB['green']=RGB['blue']=Math.round(v*255);
  }else{
    // h must be < 1
    var var_h = h * 6;
    if (var_h==6) var_h = 0;
    //Or ... var_i = floor( var_h )
    var var_i = Math.floor( var_h );
    var var_1 = v*(1-s);
    var var_2 = v*(1-s*(var_h-var_i));
    var var_3 = v*(1-s*(1-(var_h-var_i)));
    if(var_i==0){ 
      var_r = v; 
      var_g = var_3; 
      var_b = var_1;
    }else if(var_i==1){ 
      var_r = var_2;
      var_g = v;
      var_b = var_1;
    }else if(var_i==2){
      var_r = var_1;
      var_g = v;
      var_b = var_3
    }else if(var_i==3){
      var_r = var_1;
      var_g = var_2;
      var_b = v;
    }else if (var_i==4){
      var_r = var_3;
      var_g = var_1;
      var_b = v;
    }else{ 
      var_r = v;
      var_g = var_1;
      var_b = var_2
    }
    //rgb results = 0 ÷ 255  
    RGB['red']=Math.round(var_r * 255);
    RGB['green']=Math.round(var_g * 255);
    RGB['blue']=Math.round(var_b * 255);
    }
  return RGB;  
};