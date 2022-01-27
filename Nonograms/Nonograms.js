let SIZE = 10;
let width = 400;
let distance = width/SIZE;
let BOARD = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
let finalBoard =  Array(SIZE).fill().map(() => Array(SIZE).fill(0));
let COLRESTRICTIONS = [];
let ROWRESTRICTIONS = [];
let ROWLIST = [];
let COLLIST = [];
let draggedVar = 1;
let knownBoard = true;

let myCanvas;

let manual = true;
let done = false;
let xframerate = 1;
let xwidth = 500;

function setup() {
  frameRate(xframerate);
  manual = true;
  myCanvas = createCanvas(xwidth, xwidth);
  myCanvas.parent("board")
  document.getElementById("row").style.height = width+"px";
  document.getElementById("col").style.width = width+"px";
  for (let x = 1; x <= SIZE; x++) {
    if (ROWRESTRICTIONS.length == 0) {
      document.getElementById('row'+x).value = "";
      document.getElementById('col'+x).value = "";
    } else {
      document.getElementById('row'+x).value = ROWRESTRICTIONS[x-1];
      document.getElementById('col'+x).value = COLRESTRICTIONS[x-1];
    }
  }
  strokeWeight(3);
  fill('white');
  rect(0, 0, width+1.5, width+1.5);
  for (let i = 0; i < SIZE; i++) {
    if (i % 5 == 0) {
      strokeWeight(6);
    }
    line(i*distance, 0, i*distance, width);
    line(0, i*distance, width, i*distance);
    strokeWeight(3);
  }
  BOARD = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
}

function changeWidth() {
  width = xwidth;
  resizeCanvas(width, width);
  distance = width/SIZE;
  document.getElementById("row").style.height = width+"px";
  document.getElementById("col").style.width = width+"px";
  document.getElementById("boardBorder").style.width = (width+150)+"px";
  document.getElementById("boardBorder").style.height = (width+150)+"px";
}

function finishBoard() {
  loop();
  ROWLIST = [];
  COLLIST = [];
  for (let row = 0; row < ROWRESTRICTIONS.length; row++) {
    ROWLIST.push(initial_list(ROWRESTRICTIONS[row], SIZE));
  }
  for (let col = 0; col < COLRESTRICTIONS.length; col++) {
    COLLIST.push(initial_list(COLRESTRICTIONS[col], SIZE));
  }
  manual = false;
}

function randomBoard() {
  knownBoard = true;
  BOARD = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
  [ROWRESTRICTIONS, COLRESTRICTIONS, ROWLIST, COLLIST] = validBoard();
  setup();
}

function clearBoard() {
  manual = true;
  BOARD = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
}

function clearRestrictions() {
  manual = true;
  BOARD = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
  COLRESTRICTIONS = [];
  ROWRESTRICTIONS = [];
  ROWLIST = [];
  COLLIST = [];
  setup();
}

function submitRestrictions() {
  manual = true;
  knownBoard = false;
  BOARD = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
  ROWLIST = []
  COLLIST = []
  for (let x = 1; x <= SIZE; x++) {
    let currRowText = document.getElementById('row'+x).value;
    let currRow = currRowText.split(",")
    let rowx = [];
    for (let i = 0; i < currRow.length; i++) {
      rowx.push(parseInt(currRow[i]));
    }
    ROWRESTRICTIONS[x-1] = rowx;
    let currColText = document.getElementById('col'+x).value;
    let currCol = currColText.split(",")
    let colx = [];
    for (let i = 0; i < currCol.length; i++) {
      colx.push(parseInt(currCol[i]));
    }
    COLRESTRICTIONS[x-1] = colx;
  }
  for (let row = 0; row < ROWRESTRICTIONS.length; row++) {
    ROWLIST.push(initial_list(ROWRESTRICTIONS[row], SIZE));
  }
  for (let col = 0; col < COLRESTRICTIONS.length; col++) {
    COLLIST.push(initial_list(COLRESTRICTIONS[col], SIZE));
  }
}

function draw() {
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (BOARD[col][row] == 1) {
        if (knownBoard) {
          if (finalBoard[col][row] == 1) {
            fill('black');
          } else {
            fill('red');
          }
        } else {
          fill('black');
        }
        rect(row*distance, col*distance, distance, distance);
      } else if (BOARD[col][row] == -1) {
        fill('white');
        rect(row*distance, col*distance, distance, distance);
        if (knownBoard) {
          if (finalBoard[col][row] == 0) {
            stroke('black');
          } else {
            stroke('red');
          }
        } else {
          fill('black');
        }
        strokeWeight(3);
        line(row*distance, col*distance, row*distance+distance, col*distance+distance);
        line(row*distance+distance, col*distance, row*distance, col*distance+distance);
        stroke('black');
      }
      else {
        fill('white');
        rect(row*distance, col*distance, distance, distance);
      }
    }
  }
  for (let i = 0; i < SIZE; i++) {
    if (i % 5 == 0) {
      strokeWeight(6);
    }
    line(i*distance, 0, i*distance, width);
    line(0, i*distance, width, i*distance);
    strokeWeight(3);
  }

  done = true;

  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (BOARD[col][row] == 0) {
        done = false;
      }
    }
  }

  if (done) {
    console.log(boardIsValid([...ROWLIST], [...COLLIST]));
  }

  if (ROWLIST.length != 0){
    if (!manual){
      AIPLAY(SIZE, BOARD, ROWLIST, COLLIST);     
    }
  }
}

function mouseDragged() {
  if (manual) {
    if (mouseX >= 0 && mouseX <= width && mouseY >=0 && mouseY <= width) {
      BOARD[floor(mouseY/distance)][floor(mouseX/distance)] = draggedVar;
    }
  }
}

function mousePressed() {
  if (manual) {
    if (mouseButton === LEFT) {
      if (mouseX >= 0 && mouseX <= width && mouseY >=0 && mouseY <= width) {
        if (BOARD[floor(mouseY/distance)][floor(mouseX/distance)] == 1) {
          draggedVar = 0;
        } else {
          draggedVar = 1;
        }
      }
    } else if (mouseButton === RIGHT) {
      if (mouseX >= 0 && mouseX <= width && mouseY >=0 && mouseY <= width) {
        if (BOARD[floor(mouseY/distance)][floor(mouseX/distance)] == -1) {
          draggedVar = 0;
        } else {
          draggedVar = -1;
        }
      }
    }
    if (mouseX >= 0 && mouseX <= width && mouseY >=0 && mouseY <= width) {
      BOARD[floor(mouseY/distance)][floor(mouseX/distance)] = draggedVar;
    }
  }
}

function AIPLAY(SIZE, BOARD, ROWLIST, COLLIST) {
  let changing = false;
  for (let row = 0; row < SIZE; row++) {
    if (row == 1) {
      let x = 0;
      // pass
    }
    let tempRowList = [...ROWLIST[row]];
    ROWLIST[row] = prune_lines(ROWLIST[row], BOARD[row]);
    if (!arraysEqual(tempRowList, ROWLIST[row])) {
      changing = true;
    }
    let currRow = eliminate_options(ROWLIST[row], SIZE);
    if (currRow.length != SIZE) {
      return -1;
    }
    BOARD[row] = currRow;
  }
  for (let col = 0; col < SIZE; col++) {
    let tempColList = [...COLLIST[col]];
    let tempBoardCol = [];
    for (let row = 0; row < SIZE; row++) {
      tempBoardCol.push(BOARD[row][col]);
    }
    COLLIST[col] = prune_lines(COLLIST[col], tempBoardCol);
    if (!arraysEqual(tempColList, COLLIST[col])) {
      changing = true;
    }
    let currCol = eliminate_options(COLLIST[col], SIZE);
    if (currCol.length != SIZE) {
      return -1;
    }
    for (let row = 0; row < SIZE; row++) {
      BOARD[row][col] = currCol[row];
    }
  }
  if (!changing) {
    return 0;
  }
  return 1;
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function initial_list(lineSent, size) {
  // verified to be correct
  let line = [...lineSent];
  if (size == 0 || line.length == 0) {
    return [[]];
  }
  if (line.length == 1) {
    if (line[0] > size) {
      return [[]];
    }
    let result = [];
    let count = 0;
    while (count + line[0] <= size) {
      result.push([count, line[0]]);
      count++;
    }
    return result;
  }
  let result = [];
  let x = 0;
  while (x < size) {
    let tempLine = []
    for (let i = 1; i < line.length; i++) {
      tempLine.push(line[i])
    }
    let after = initial_list(tempLine, size - line[0] - x - 1);
    if (after.length == 1 && after[0].length == 0) {
      break;
    }
    for (let i = 0; i < after.length; i++) {
      let temp = [];
      temp.push(x);
      temp.push(line[0]);
      temp.push(after[i][0] + 1);
      for (let j = 1; j < after[i].length; j++) {
        temp.push(after[i][j]);
      }
      result.push(temp);
    }
    x++;
  }
  return result;
}

function eliminate_options(lines, size) {
  let result = [];
  let parity = -1;
  if (lines.length == 0) {
    return result;
  }
  for (let i = 0; i < lines[0].length; i++) {
    for (let x = 0; x < lines[0][i]; x++) {
      result.push(parity);
    }
    parity = -parity;
  }
  while (result.length != size) {
    result.push(-1)
  }
  for (let i = 1; i < lines.length; i++) {
    parity = -1; 
    let count = 0;
    for (let j = 0; j < lines[i].length; j++) {
      for (let k = 0; k < lines[i][j]; k++) {
        if (result[count] != parity) {
          result[count] = 0;
        }
        count++;
      }
      parity = -parity;
    }
  }
  return result
}

function prune_lines(lines, final) {
  for (let i = 0; i < lines.length; i++) {
    // this code is to buffer the end of the current line to be -1s
    let sum = 0;
    for (let x = 0; x < lines[i].length; x++) {
      sum += lines[i][x];
    }
    if (final.length - sum != 0) {
      lines[i].push(final.length - sum);
    }
    // (to here)
    let parity = -1;
    let count = 0;
    // count is the index variable
    for (let j = 0; j < lines[i].length; j++) {
      // for each number in the current line
      for (let k = 0; k < lines[i][j]; k++) {
        // repeat k times (the number of the current line)
        if (final[count] == -parity) {
          // if it must be opposite of this possible line, remove it
          lines[i] = [];
          break;
        }
        count++;
      }
      parity = -parity;
    }
  }
  let offset = 0;
  for (let i = 0; i < lines.length-offset; i++) {
    if (lines[i-offset].length == 0) {
      lines.splice(i-offset, 1);
      offset++;
    }
  }
  return lines;
}

function initialSetup() {
  // verified to be correct
  finalBoard = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
  let ROWRESTRICTIONS = [];
  let COLRESTRICTIONS = [];
  let ROWLIST = [];
  let COLLIST = [];

  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      let x = round(random());
      finalBoard[row][col] = x;
    }
  }

  for (let row = 0; row < SIZE; row++) {
    let ans = [];
    let curr = 0;
    for (let col = 0; col < SIZE; col++) {
      if (finalBoard[row][col] == 1) {
        curr++;
      } else {
        if (curr != 0) {
          ans.push(curr);
        }
        curr = 0;
      }
    }
    if (curr != 0) {
      ans.push(curr);
    }
    curr = 0;
    ROWRESTRICTIONS.push(ans);
  }

  for (let col = 0; col < SIZE; col++) {
    let ans = [];
    let curr = 0;
    for (let row = 0; row < SIZE; row++) {
      if (finalBoard[row][col] == 1) {
        curr++;
      } else {
        if (curr != 0) {
          ans.push(curr);
        }
        curr = 0;
      }
    }
    if (curr != 0) {
      ans.push(curr);
    }
    curr = 0;
    COLRESTRICTIONS.push(ans);
  }

  for (let row = 0; row < ROWRESTRICTIONS.length; row++) {
    ROWLIST.push(initial_list(ROWRESTRICTIONS[row], SIZE));
  }
  for (let col = 0; col < COLRESTRICTIONS.length; col++) {
    COLLIST.push(initial_list(COLRESTRICTIONS[col], SIZE));
  }
  return [ROWRESTRICTIONS, COLRESTRICTIONS, ROWLIST, COLLIST];
}

function validBoard() {
  let ROWRESTRICTIONS = []
  let COLRESTRICTIONS = []
  let ROWLIST = []
  let COLLIST = []
  let valid = false;
  while (!valid) {
    [ROWRESTRICTIONS, COLRESTRICTIONS, ROWLIST, COLLIST] = initialSetup();
    var tempRowList = [];
    for (var i = 0; i < ROWLIST.length; i++)
        tempRowList[i] = ROWLIST[i].slice();
    var tempColList = [];
    for (var i = 0; i < COLLIST.length; i++)
        tempColList[i] = COLLIST[i].slice();
    if (boardIsValid(tempRowList, tempColList)) {
      valid = true;
      break;
    }
  }
  BOARD = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
  return [ROWRESTRICTIONS, COLRESTRICTIONS, ROWLIST, COLLIST];
}

function boardIsValid(tempRowList, tempColList) {
  BOARD = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
  while (true) {
    result = AIPLAY(SIZE, BOARD, tempRowList, tempColList);
    if (result == -1) {
      return false;
    }
    if (result == 0) {
      done = true;
      for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
          if (BOARD[row][col] == 0) {
            done = false;
          }
        }
      }
      if (!done) {
        return false;
      } else {return true;}
    }
  }
}