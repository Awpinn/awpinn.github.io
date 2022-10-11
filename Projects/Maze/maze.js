const h = 10;
const w = 10;
let start = [0, 0];
let end = [h-1, w-1];
let first = true;
let lightblue = '#BCD2E8';
let darkblue = '#2E5984';
let generating = true;
let findPath = true;
let xcr = start[0];
let xcc = start[1];
let xar = start[0];
let xac = start[1];
let visited = Array.from({ length: h }, () => 
  Array.from({ length: w }, () => false)
);
let final = Array.from({ length: h }, () => 
  Array.from({ length: w }, () => false)
);
// there is h-1 horizontal walls and it can be split into w segments
let wallsHorizontal = Array.from({ length: h-1 }, () => 
  Array.from({ length: w }, () => true)
);
let wallsVertical = Array.from({ length: w-1 }, () => 
  Array.from({ length: h }, () => true)
); 
let currPos = start;
let prevPos = [currPos];
let fullPath = [currPos];

function setup() {
  frameRate(5);
  createCanvas(500, 500);
  if (generating) {
    [xcr, xcc, xar, xac] = nextMove(xcr, xcc, xar, xac);
    console.log(xcr, xcc, xar, xac);
  } else {
    fastGeneration(xcr, xcc, xar, xac);
    currPos = start;
  }
}

function draw() {
  strokeWeight(1);
  background(255);
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (visited[r][c]) {
        if (final[r][c]) {
          stroke(lightblue);
          fill(lightblue)
          rect(c*(width/w), r*(height/h), (width/w), (height/h));
        } else {
          stroke(darkblue);
          fill(darkblue);
          rect(c*(width/w), r*(height/h), (width/w), (height/h));
        }
      }
    }
  }
  fill('green');
  rect(currPos[1]*(width/w), currPos[0]*(height/h), (width/w), (height/h));
  noFill();
  stroke('black');
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (c != w-1) {
        if (wallsVertical[c][r]) {
          line((c+1)*(width/w), r*(height/h), (c+1)*(width/w), (r+1)*(height/h))
        }
      }
      if (r != h-1) {
        if (wallsHorizontal[r][c]) {
          line(c*(width/w), (r+1)*(height/h), (c+1)*(width/w), (r+1)*(height/h))
        }
      }
    }
  }
  // if (generating && (currPos[0] != start[0] || currPos[1] != start[1])) {
  if (generating) {
    [xcr, xcc, xar, xac] = nextMove(xcr, xcc, xar, xac);
    console.log(xcr, xcc, xar, xac);
  }
  if (currPos[0] == start[0] && currPos[1] == start[1]) {
    if (first) {
      for (let i = 0; i < final.length; i++) {
        for (let j = 0; j < final[0].length; j++) {
          visited[i][j] = false;
          final[i][j] = false;
        }
      }
      visited[start[0]][start[1]] = true;
    } else {
      if (findPath) {
        findNext();
      }
    }
  }
  strokeWeight(2);
  rect(0, 0, width, height);
}

// function lookDirection(cr, cr, ar, ac) {
//   if (ac > cc) { if (wallsVertical[cc][cr]) { return false }};
//   if (ac < cc) { if (wallsVertical[ac][cr]) { return false }};
//   if (ar > cr) { if (wallsHorizontal[cr][cc]) { return false }};
//   if (ar < cr) { if (wallsHorizontal[ar][cc]) { return false }};
//   fullPath.push(currPos);
//   currPos = [ar, ac];
//   visited[ar][ac] = true;
// }

// function findNext() {
//   console.log(currPos);
//   let x = currPos[0];
//   let y = currPos[1];
//   if (x != 0) {
//     if (!visited[x-1][y]) {
//       lookDirection(x, y, x-1, y);
//     }
//   }
//   if (y != w-1) {
//     if (!visited[x][y+1]) {
//       lookDirection(x, y, x, y+1);
//     }
//   }
//   if (x != h-1) {
//     if (!visited[x+1][y]) {
//       lookDirection(x, y, x+1, y);
//     }
//   }
//   if (y != 0) {
//     if (!visited[x][y-1]) {
//       lookDirection(x, y, x, y-1);
//     }
//   }
  
// }

function nextMove(cr, cc, ar, ac) {
  moveHelper(cr, cc, ar, ac);
  let move = ['n', 'e', 's', 'w'];
  move = shuffle(move);
  for (let i = 0; i < 4; i++) {
    switch(move[i]) {
      case 'n':
        if (ar > 0) {
          if (!visited[ar-1][ac]) {
            return[ar, ac, ar-1, ac];
          }
        }
      case 'e':
        if (ac < w) {
          if (!visited[ar][ac+1]) {
            return[ar, ac, ar, ac+1];
          }
        }
      case 's':
        if (ar < h) {
          if (!visited[ar+1][ac]) {
            return[ar, ac, ar+1, ac];
          }
        }
      case 'w':
        if (ac > 0) {
          if (!visited[ar][ac-1]) {
            return[ar, ac, ar, ac-1];
          }
        }
    }
  }
}

function fastGeneration(cr, cc, ar, ac) {
  if (ar < 0 || ar >= h || ac < 0 || ac >= w) {
    return false;
  }
  if (visited[ar][ac]) {
    return false;
  }
  moveHelper(cr, cc, ar, ac);
  let move = ['n', 'e', 's', 'w'];
  move = shuffle(move);
  for (let i = 0; i < 4; i++) {
    switch(move[i]) {
      case 'n':
        fastGeneration(ar, ac, ar-1, ac);
      case 'e':
        fastGeneration(ar, ac, ar, ac+1);
      case 's':
        fastGeneration(ar, ac, ar+1, ac);
      case 'w':
        fastGeneration(ar, ac, ar, ac-1);
    }
  }
}

function moveHelper(cr, cc, ar, ac) {
  if (ac > cc) wallsVertical[cc][cr] = false;
  if (ac < cc) wallsVertical[ac][cr] = false;
  if (ar > cr) wallsHorizontal[cr][cc] = false;
  if (ar < cr) wallsHorizontal[ar][cc] = false;
  prevPos.push(currPos);
  currPos = [ar, ac];
  visited[ar][ac] = true;  
}

// function nextMove() {
//   let move = ['n', 'e', 's', 'w'];
//   let changed = false;
//   move = shuffle(move);
//   loop1:
//     for (let i = 0; i < 4; i++) {
//       let x = currPos[0];
//       let y = currPos[1];
//       switch(move[i]) {
//         case 'n':
//           if (x != 0) {
//             if (!visited[x-1][y]) {
//               moveHelper(x, y, x-1, y);
//               changed = true;
//               break loop1;
//             }
//           }
//           break;
//         case 'e':
//           if (y != w-1) {
//             if (!visited[x][y+1]) {
//               moveHelper(x, y, x, y+1);
//               changed = true;
//               break loop1;
//             }
//           }
//           break;
//         case 's':
//           if (x != h-1) {
//             if (!visited[x+1][y]) {
//               moveHelper(x, y, x+1, y);
//               changed = true;
//               break loop1;
//             }
//           }
//           break;
//         case 'w':
//           if (y != 0) {
//             if (!visited[x][y-1]) {
//               moveHelper(x, y, x, y-1);
//               changed = true;
//               break loop1;
//             }
//           }
//           break;
//       }
//     }
//   if (!changed) {
//     final[currPos[0]][currPos[1]] = true;
//     currPos = prevPos.pop();    
//   }
// }
