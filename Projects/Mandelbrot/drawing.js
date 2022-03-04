let scale = 1;
let rect_0x = 0;
let rect_1x = 0;
let rect_0y = 0;
let rect_1y = 0;
let rect_scale;
let d;
let x_lower = -2;
let x_higher = 0.47;
let y_lower = -1.12;
let y_higher = 1.12;
let img;

function setup() {
    createCanvas(800, 800);
    pixelDensity(1);
    d = pixelDensity();
    rect_scale = height / width;
    img = createImage(width, height);
    mandelbrotCalc();
}

function mandelbrotCalc() {
    img.loadPixels();
    // let width_restriction = (width*d)/scale;
    // let height_restriction = (height*d)/scale;
    for (let r = 0; r < img.height * d; r++) {
        for (let c = 0; c < img.width * d; c++) {
            let x0 = map(c, 0, img.width * d, x_lower, x_higher);
            let y0 = map(r, 0, img.height * d, y_lower, y_higher);
            let x = 0;
            let y = 0;
            let iteration = 0;
            let max_iteration = 1500;
            while (x*x + y*y <= 2*2 && iteration < max_iteration) {
                let xtemp = x*x - y*y + x0;
                y = 2*x*y + y0;
                x = xtemp;
                iteration++;
            }
            let hue = iteration / max_iteration;
            let v = iteration < max_iteration ? 1 : 0;
            let i = 4 * (r * img.width * d + c);
            let rgb = hsv2rgb(hue, 1, v);
            img.pixels[i] = rgb['red'];
            img.pixels[i+1] = rgb['green'];
            img.pixels[i+2] = rgb['blue'];
            img.pixels[i+3] = 255;
        }
    }
    console.log("done");
    img.updatePixels();
}

function draw () {
    rect_1x = mouseX;
    rect_1y = mouseY;
    image(img, 0, 0);
    noFill();
    stroke('white');
    strokeWeight(1);
    if (!mouseIsPressed) {
        rect_0x = mouseX;
        rect_0y = mouseY;
    } else {
        if ((rect_1y > rect_0y && rect_1x > rect_0x) || (rect_1y < rect_0y && rect_1x < rect_0x)) {
            rect_1y = rect_0y + (rect_1x - rect_0x) * rect_scale;
        } else {
            rect_1y = rect_0y - (rect_1x - rect_0x) * rect_scale;
        }
    }
    if (rect_0x != rect_1x) {
        rect(rect_0x, rect_0y, rect_1x-rect_0x, rect_1y-rect_0y);
    }
}

function mousePressed() {
    rect_0x = mouseX;
    rect_0y = mouseY;
}

function mouseReleased() {
    rect_1x = mouseX;
    rect_1y = mouseY;
    if ((rect_1y > rect_0y && rect_1x > rect_0x) || (rect_1y < rect_0y && rect_1x < rect_0x)) {
        rect_1y = rect_0y + (rect_1x - rect_0x) * rect_scale;
    } else {
        rect_1y = rect_0y - (rect_1x - rect_0x) * rect_scale;
    }
    if (0 <= rect_0x <= width && 0 <= rect_1x <= width && 0 <= rect_0y <= height && 0 <= rect_1y <= height) {
        if (rect_0x != rect_1x) {
            let total_x = x_higher - x_lower;
            let total_y = y_higher - y_lower;
            if (rect_0x > rect_1x) {
                [rect_0x, rect_1x] = swap(rect_0x, rect_1x);
            }
            if (rect_0y > rect_1y) {
                [rect_0y, rect_1y] = swap(rect_0y, rect_1y);
            }
            x_higher = x_lower + rect_1x/width * total_x;
            x_lower = x_lower + rect_0x/width * total_x;
            y_higher = y_lower + rect_1y/width * total_y;
            y_lower = y_lower + rect_0y/width * total_y;
            mandelbrotCalc();
        }
    }
    rect_1x = rect_0x;
}

function swap(x, y) {
    let temp = x;
    x = y;
    y = temp;
    return [x, y];
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