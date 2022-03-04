let globe = [];
let globe1 = [];
let s;
let total = 20;
let a = 1;
let b = 1;
let offset = 0;
let m = 0;
let mchange = 0;
let shapes = [];
let shapesCount = 0;
let prevSmoothness = -2;
let wait = 40;
let waiting = false;
let loop = true;
let cam;

var s1 = function( sketch ) {
    sketch.setup = function() {
        let canvas1 = sketch.createCanvas(600, 600, sketch.WEBGL);
        canvas1.position(0, 0);
        sketch.colorMode(sketch.HSB);
        globe = [...Array(total+1)].map(e => Array(total+1));
        globe1 = [...Array(total+1)].map(e => Array(total+1));
        let s1 = new Shape(8, 60, 100, 30, 2, 10, 10, 10);
        let s2 = new Shape(7, 0.2, 1.7, 1.7, 7, 0.2, 1.7, 1.7);
        let s3 = new Shape(3, 1, 1, 1, 6, 2, 1, 1);
        let s4 = new Shape(6, 1, 1, 1, 3, 1, 1, 1);
        let s5 = new Shape(2, 0.7, 3, 2, 7, 0.7, 3, 2);
        let s6 = new Shape(0, 12, 1, 1, 10, 2, 1, 1);
        shapes.push(s1);
        shapes.push(s6);
        shapes.push(s2);
        shapes.push(s3);
        shapes.push(s4);
        shapes.push(s5);
        let allCurrent = document.getElementById("allCurrent");
        allCurrent.innerHTML = "";
        for (let i = 0; i < shapes.length; i++) {
            var shapeElement = document.createElement("div");
            shapeElement.draggable=true;
            shapeElement.className="box";
            var node = document.createTextNode(shapes[i].m0 + ", " + shapes[i].n10 + ", " + shapes[i].n20 + ", " + shapes[i].n30 + ", " + shapes[i].m1 + ", " + shapes[i].n11 + ", " + shapes[i].n21 + ", " +shapes[i].n31);
            shapeElement.appendChild(node);
            allCurrent.appendChild(shapeElement);
        }
        MakeDraggable();
        cam = sketch.createEasyCam(p5.RendererGL);
        cam.setDistance(700);
        cam.setRotation([0.7323170420757202, 0.4321220405274498, 0.36125893186946745, -0.3827195789613942]);
        // cam.rotation = ;
    }
    sketch.draw = function () {
        // console.log(cam.getRotation());
        sketch.background(0);
        sketch.noStroke();
        sketch.lights();
        if (shapes.length > 0) {
            let s = shapes[shapesCount % shapes.length];
            let s2 = shapes[(shapesCount+1) % shapes.length];
            let raw = -1;
            let smoothness = 1;
            if (waiting) {
                if (wait == 0) {
                    waiting = false;
                    prevSmoothness = -2;
                    mchange = -1;
                    shapesCount = (shapesCount + 1) % shapes.length;
                    wait = 20;
                } else {
                    mchange = 1;
                    wait--;
                }
            } else {
                raw = sketch.sin(mchange);
                smoothness = raw;
                mchange += 0.05 ;
            }
            let m0 = sketch.map(smoothness, -1, 1, s.m0, s2.m0);
            let n10 = sketch.map(smoothness, -1, 1, s.n10, s2.n10);
            let n20 = sketch.map(smoothness, -1, 1, s.n20, s2.n20);
            let n30 = sketch.map(smoothness, -1, 1, s.n30, s2.n30);
            let m1 = sketch.map(smoothness, -1, 1, s.m1, s2.m1);
            let n11 = sketch.map(smoothness, -1, 1, s.n11, s2.n11);
            let n21 = sketch.map(smoothness, -1, 1, s.n21, s2.n21);
            let n31 = sketch.map(smoothness, -1, 1, s.n31, s2.n31);
            if (raw < prevSmoothness) {
                waiting = true;
            } else {
                prevSmoothness = raw;
            }
            let r = 200;
            for (let i = 0; i <= total; i++) {
                let lat = sketch.map(i, 0, total, -sketch.HALF_PI, sketch.HALF_PI);
                let r2 = sketch.superShape(lat, m1, n11, n21, n31);
                for (let j = 0; j <= total; j++) {
                    let lon = sketch.map(j, 0, total, -sketch.PI, sketch.PI);
                    let r1 = sketch.superShape(lon, m0, n10, n20, n30);
                    let x = r * r1 * sketch.cos(lon) * r2 * sketch.cos(lat);
                    let y = r * r1 * sketch.sin(lon) * r2 * sketch.cos(lat);
                    let z = r * r2 * sketch.sin(lat);
                    globe[i][j] = sketch.createVector(x, y, z);
                }
            }
            // stroke(255);
            offset = (offset + 1) % 360;
            for (let i = 0; i < total; i++) {
                let hu = sketch.map(i, 0, total-1, 0, 360*6);
                sketch.fill((hu + offset) % 360, 75, 75);
                sketch.beginShape(sketch.TRIANGLE_STRIP);
                for (let j = 0; j <= total; j++) {
                    let v1 = globe[i][j];
                    sketch.vertex(v1.x, v1.y, v1.z);
                    let v2 = globe[i+1][j];
                    sketch.vertex(v2.x, v2.y, v2.z);
                }
                sketch.endShape();
            }
        }
    }
    sketch.superShape = function (theta, m, n1, n2, n3) {
        return sketch.pow(sketch.pow(sketch.abs((1/a) * sketch.cos(m * theta / 4)), n2) + sketch.pow(sketch.abs((1/b) * sketch.sin(m * theta / 4)), n3), (-1/n1));
    }
}

new p5(s1);

var s2 = function ( sketch ) {
    sketch.setup = function () {
        let canvas2 = sketch.createCanvas(600, 600, sketch.WEBGL);
        canvas2.position(600, 0);
        sketch.colorMode(sketch.HSB);
        cam2 = sketch.createEasyCam();
        cam2.setDistance(700);
        cam2.setRotation([0.7323170420757202, 0.4321220405274498, 0.36125893186946745, -0.3827195789613942]);
        s = new Shape(0, 1, 1, 1, 0, 1, 1, 1);
    }
    sketch.draw = function () {
        sketch.fill(0);
        sketch.background(0);
        sketch.noStroke();
        sketch.lights();
        let r = 200;
        for (let i = 0; i <= total; i++) {
            let lat = sketch.map(i, 0, total, -sketch.HALF_PI, sketch.HALF_PI);
            let r2 = sketch.superShape(lat, s.m1, s.n11, s.n21, s.n31);
            for (let j = 0; j <= total; j++) {
                let lon = sketch.map(j, 0, total, -sketch.PI, sketch.PI);
                let r1 = sketch.superShape(lon, s.m0, s.n10, s.n20, s.n30);
                let x = r * r1 * sketch.cos(lon) * r2 * sketch.cos(lat);
                let y = r * r1 * sketch.sin(lon) * r2 * sketch.cos(lat);
                let z = r * r2 * sketch.sin(lat);
                globe1[i][j] = sketch.createVector(x, y, z);
            }
        }
        // stroke(255); 
        offset = (offset + 1) % 360;
        for (let i = 0; i < total; i++) {
            let hu = sketch.map(i, 0, total-1, 0, 360);
            // sketch.fill((hu + offset) % 360, 100, 100);
            sketch.fill(hu%360, 75, 75);
            sketch.beginShape(sketch.TRIANGLE_STRIP);
            for (let j = 0; j <= total; j++) {
                let v1 = globe1[i][j];
                sketch.vertex(v1.x, v1.y, v1.z);
                let v2 = globe1[i+1][j];
                sketch.vertex(v2.x, v2.y, v2.z);
            }
            sketch.endShape();
        }

    }
    sketch.superShape = function (theta, m, n1, n2, n3) {
        return sketch.pow(sketch.pow(sketch.abs((1/a) * sketch.cos(m * theta / 4)), n2) + sketch.pow(sketch.abs((1/b) * sketch.sin(m * theta / 4)), n3), (-1/n1));
    }
}

new p5(s2);

class Shape {
    constructor(m0, n10, n20, n30, m1, n11, n21, n31) {
        this.m0 = m0;
        this.n10 = n10;
        this.n20 = n20;
        this.n30 = n30;
        this.m1 = m1;
        this.n11 = n11;
        this.n21 = n21;
        this.n31 = n31;
    }
}