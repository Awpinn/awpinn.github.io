let xframerate = 60;
let xwidth = 500;

let A = [200,100];
let B = [200,200];
let C = [0,100];

function setup() {
  // noLoop();
  frameRate(xframerate);
  createCanvas(xwidth, xwidth);
}

function draw() {
  fill('white');
  rect(0, 0, width, height);
  strokeWeight(3);
  stroke(0);
  let ABm = (B[1] - A[1]) / (B[0] - A[0]);
  let BCm = (C[1] - B[1]) / (C[0] - B[0]);
  let CAm = (C[1] - A[1]) / (C[0] - A[0]);
  let ABc = A[1] - (A[0] * ABm);
  let BCc = B[1] - (B[0] * BCm);
  let CAc = C[1] - (C[0] * CAm);
  let ABcC = ABm * C[0] - C[1];
  let BCcA = BCm * A[0] - A[1];
  let CAcB = CAm * B[0] - B[1];
  for (let i = 0; i < 20; i++) {
    if (ABm == 0) {
      line(0, A[1]-((A[1]-C[1])*i), 500, A[1]-((A[1]-C[1])*i));
      line(0, A[1]+((A[1]-C[1])*i), 500, A[1]+((A[1]-C[1])*i));
    } else if (abs(ABm) == Infinity) {
      line(A[0]+((A[0]-C[0])*i), 0, A[0]+((A[0]-C[0])*i), 500);
      line(A[0]-((A[0]-C[0])*i), 0, A[0]-((A[0]-C[0])*i), 500);
    } else{
      let ABxLo = (0 - ABc)/ABm;
      let ABxHi = (width - ABc)/ABm;
      line(ABxLo, 0, ABxHi, height);
    }
    if (BCm == 0) {
      line(0, B[1]-((B[1]-A[1])*i), 500, B[1]-((B[1]-A[1])*i));
      line(0, B[1]+((B[1]-A[1])*i), 500, B[1]+((B[1]-A[1])*i));
    } else if (abs(BCm) == Infinity) {
      line(B[0]+((B[0]-A[0])*i), 0, B[0]+((B[0]-A[0])*i), 500);
      line(B[0]-((B[0]-A[0])*i), 0, B[0]-((B[0]-A[0])*i), 500);
    } else{
      let BCxLo = (0 - BCc)/BCm;
      let BCxHi = (width - BCc)/BCm;
      line(BCxLo, 0, BCxHi, height);
    }
    if (CAm == 0) {
      line(0, A[1]-((A[1]-B[1])*i), 500, A[1]-((A[1]-B[1])*i));
      line(0, A[1]+((A[1]-B[1])*i), 500, A[1]+((A[1]-B[1])*i));
    } else if (abs(CAm) == Infinity) {
      line(A[0]+((A[0]-B[0])*i), 0, A[0]+((A[0]-B[0])*i), 500);
      line(A[0]-((A[0]-B[0])*i), 0, A[0]-((A[0]-B[0])*i), 500);
    } else{
      let CAxLo = (0 - CAc)/CAm;
      let CAxHi = (width - CAc)/CAm;
      line(CAxLo, 0, CAxHi, height);
    }
  }
  fill('red');
  stroke('red');
  circle(A[0], A[1], 5);
  circle(B[0], B[1], 5);
  circle(C[0], C[1], 5);
  fill('black');
  stroke('black');
  text("A", A[0], A[1]);
  text("B", B[0], B[1]);
  text("C", C[0], C[1]);
}

function mouseDragged() {
  if (mouseX >= 0 && mouseX <= width && mouseY >=0 && mouseY <= width) {
    if (mouseX <= A[0] + 10 && mouseX >= A[0] - 10 && mouseY >= A[1] - 10 && mouseY <= A[1] + 10) {
      A[0] = mouseX;
      A[1] = mouseY;
    }
  else if (mouseX <= B[0] + 10 && mouseX >= B[0] - 10 && mouseY >= B[1] - 10 && mouseY <= B[1] + 10) {
      B[0] = mouseX;
      B[1] = mouseY;
    }
  else if (mouseX <= C[0] + 10 && mouseX >= C[0] - 10 && mouseY >= C[1] - 10 && mouseY <= C[1] + 10) {
      C[0] = mouseX;
      C[1] = mouseY;
    }
  }
}

// function mouseDragged() {
//   if (mouseX >= 0 && mouseX <= width && mouseY >=0 && mouseY <= width) {
//     BOARD[floor(mouseY/distance)][floor(mouseX/distance)] = draggedVar;
//   }
// }

// function mousePressed() {
//   if (mouseButton === LEFT) {
//     if (mouseX >= 0 && mouseX <= width && mouseY >=0 && mouseY <= width) {
//       if (BOARD[floor(mouseY/distance)][floor(mouseX/distance)] == 1) {
//         draggedVar = 0;
//       } else {
//         draggedVar = 1;
//       }
//     }
//   } else if (mouseButton === RIGHT) {
//     if (mouseX >= 0 && mouseX <= width && mouseY >=0 && mouseY <= width) {
//       if (BOARD[floor(mouseY/distance)][floor(mouseX/distance)] == -1) {
//         draggedVar = 0;
//       } else {
//         draggedVar = -1;
//       }
//     }
//   }
//   if (mouseX >= 0 && mouseX <= width && mouseY >=0 && mouseY <= width) {
//     BOARD[floor(mouseY/distance)][floor(mouseX/distance)] = draggedVar;
//   }
// }
