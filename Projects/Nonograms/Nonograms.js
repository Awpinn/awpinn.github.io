let SIZE = 10;
let width = 400;
let distance = width/SIZE;
let BOARD = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
let finalBoard =  Array(SIZE).fill().map(() => Array(SIZE).fill(0));

// 2D array, each row has a list of the restrictions for that column
let COLRESTRICTIONS = [];

// 2D array, each row has a list of the restrictions for that row
let ROWRESTRICTIONS = [];

// 3D array, each row has every possible version of the respective row.
let ROWLIST = [];

// 3D array, each row has every possible version of the respective column.
let COLLIST = [];

let draggedVar = 1;
let knownBoard = true;
let autoX = false;
let showWrong = false;
let finished = false;
let rgb = [256, 0, 0];

let manual = true;
let done = false;
let xframerate = 1;
let xwidth = 500;
let tryFinishBoard = false;
let finishBoardRow = 0;
let finishBoardCol = 0;
let percent = 50;

function setup() {
  loop();
  frameRate(60);
  manual = true;
  finished = false;
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
  submitRestrictions();
  loop();
  frameRate(xframerate);
  tryFinishBoard = true;
  finished = false;
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
  BOARD = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
  finalBoard = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
  validBoard();
  while (AIPLAY(SIZE, finalBoard, ROWLIST, COLLIST) == 1);
  console.log(finalBoard);
  knownBoard = true;
  finished = false;
  setup();
}

function clearBoard() {
  finished = false; 
  manual = true;
  BOARD = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
  setup();
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


// function to initialize the board with the restrictions entered on the webstie
function submitRestrictions() {
  manual = true;
  knownBoard = false;
  BOARD = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
  ROWLIST = []
  COLLIST = []
  for (let x = 1; x <= SIZE; x++) {
    let currRowText = document.getElementById('row'+x).value;
    if (currRowText.length == 0) {
      ROWRESTRICTIONS[x-1] = [0];
    } else {
      let currRow = currRowText.split(",")
      let rowx = [];
      for (let i = 0; i < currRow.length; i++) {
        rowx.push(parseInt(currRow[i]));
      }
      ROWRESTRICTIONS[x-1] = rowx;
    }
    let currColText = document.getElementById('col'+x).value;
    if (currColText.length == 0) {
      COLRESTRICTIONS[x-1] = [0];
    } else {
      let currCol = currColText.split(",")
      let colx = [];
      for (let i = 0; i < currCol.length; i++) {
        colx.push(parseInt(currCol[i]));
      }
      COLRESTRICTIONS[x-1] = colx;
    }
  }
  
  for (let row = 0; row < ROWRESTRICTIONS.length; row++) {
    ROWLIST.push(initial_list(ROWRESTRICTIONS[row], SIZE));
  }
  for (let col = 0; col < COLRESTRICTIONS.length; col++) {
    COLLIST.push(initial_list(COLRESTRICTIONS[col], SIZE));
  }
}

// function to check if the board has been fully correctly solved
function checkFinished() {
  result = true;
  if (!knownBoard) {
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (BOARD[i][j] == 0) {
          finished = false;
          return;
        }
      }
    }
    finished = true;
    return;
  }
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (finalBoard[i][j] != BOARD[i][j]) {
        finished = false;
        return;
      }
    }
  }
  finished = true;
}

// p5.js builtin function to draw to the canvas
function draw() {
  if (tryFinishBoard && !finished) {
    if (ROWLIST.length != 0){
      if (!manual){
        let x = 0;
        while (x == 0 && !finished) {
          if (finishBoardRow != SIZE) {
            x = AIPLAY(SIZE, BOARD, ROWLIST, COLLIST, finishBoardRow, null)
            finishBoardRow += 1
          } else {
            x = AIPLAY(SIZE, BOARD, ROWLIST, COLLIST, null, finishBoardCol)
            finishBoardCol += 1
            if (finishBoardCol == SIZE) {
              finishBoardRow = 0;
              finishBoardCol = 0;
            }
          }
          checkFinished();
        }
      }
    }
    if (finished) frameRate(60);
  }
  if (autoX) {
    allRows = []
    allCols = []
    for (let i = 0; i < SIZE; i++) {
      let row = []
      let rowBool = false;
      let col = []
      let colBool = false;
      for (let j = 0; j < SIZE; j++) {
        if (BOARD[i][j] == 1) {
          if (rowBool == true) {
            row.push(row.pop()+1);
          } else {
            row.push(1);
            rowBool = true;
          }
        } else {
          rowBool = false;
        }
        if (BOARD[j][i] == 1) {
          if (colBool == true) {
            col.push(col.pop()+1);
          } else {
            col.push(1);
            colBool = true;
          }
        } else {
          colBool = false;
        }
      }
      allRows.push(row);
      allCols.push(col);
    }
    for (let i = 0; i < SIZE; i++) {
      if (arraysEqual(ROWRESTRICTIONS[i], allRows[i])) {
        for (let j = 0; j < SIZE; j++) {
          if (BOARD[i][j] != 1) BOARD[i][j] = -1
        }
      }
      if (arraysEqual(COLRESTRICTIONS[i], allCols[i])) {
        for (let j = 0; j < SIZE; j++) {
          if (BOARD[j][i] != 1) BOARD[j][i] = -1
        }
      }
    }
  }
  if (!finished) checkFinished();
  if (finished) {
    // frameRate(60);
    let step = 2;
    if (rgb[0] > 0 && rgb[1] >= 0 && rgb[2] == 0) {
      rgb[0] -= step;
      rgb[1] += step;
    }
    else if (rgb [1] > 0 && rgb[2] >= 0 && rgb[0] == 0) {
      rgb[1] -= step;
      rgb[2] += step;
    }
    else if (rgb [2] > 0 && rgb[0] >= 0 && rgb[1] == 0) {
      rgb[2] -= step;
      rgb[0] += step;
    }
  }
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (BOARD[col][row] == 1) {
        if (finished) {
          fill(rgb[0], rgb[1], rgb[2]);
        }
        else if (knownBoard) {
          if (finalBoard[col][row] == 1 || !showWrong) {
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
          if (finalBoard[col][row] == 0 || !showWrong) {
            stroke('black');
          } else {
            stroke('red');
          }
        } else {
          stroke('black');
        }
        strokeWeight(width/150);
        line(row*distance, col*distance, row*distance+distance, col*distance+distance);
        line(row*distance+distance, col*distance, row*distance, col*distance+distance);
        stroke('black');
        strokeWeight(3);
      } else {
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
}

// p5.js inbuilt function called when mouseDragged, sets any square to be either a square or x depending on which mouse key is pressed
function mouseDragged() {
  if (manual) {
    if (mouseX >= 0 && mouseX <= width && mouseY >=0 && mouseY <= width) {
      BOARD[floor(mouseY/distance)][floor(mouseX/distance)] = draggedVar;
    }
  }
}

// p5.js inbuilt function called when mouse is pressed, will set it to be a square on an x on the current square depending on which mouse key is pressed
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

function AIPLAY(SIZE, BOARD, ROWLIST, COLLIST, row=null, col=null) {
  tempAutoX = autoX;
  autoX = false;
  let changing = false;
  if (row != null) {
    let tempRow = [...BOARD[row]];
    ROWLIST[row] = prune_lines(ROWLIST[row], BOARD[row]);
    let currRow = eliminate_options(ROWLIST[row], SIZE);
    if (currRow.length != SIZE) {
      console.log("Does this happen?");
      autoX = tempAutoX;
      return -1;
    }
    for (let col = 0; col < SIZE; col++) {
      if (BOARD[row][col] != currRow[col]) changing = true;
      BOARD[row][col] = currRow[col];
    }
  } else if (col != null) {
    let tempBoardCol = [];
    for (let row = 0; row < SIZE; row++) {
      tempBoardCol.push(BOARD[row][col]);
    }
    let tempCol = [...tempBoardCol];
    COLLIST[col] = prune_lines(COLLIST[col], tempBoardCol);
    console.log(COLLIST[col])
    let currCol = eliminate_options(COLLIST[col], SIZE);
    if (currCol.length != SIZE) {
      console.log("Does this happen?");
      return -1;
    }
    for (let row = 0; row < SIZE; row++) {
      if (BOARD[row][col] != currCol[row]) changing = true;
      BOARD[row][col] = currCol[row];
    }
  } else {
    for (let row = 0; row < SIZE; row++) {
      let tempRow = [...BOARD[row]];
      let tempRowList = [...ROWLIST[row]];
      ROWLIST[row] = prune_lines(ROWLIST[row], BOARD[row]);
      if (tempRowList.length != ROWLIST[row].length) {
        changing = true;
      }
      let currRow = eliminate_options(ROWLIST[row], SIZE);
      if (currRow.length != SIZE) {
        console.log("Does this happen?");
        autoX = tempAutoX;
        return -1;
      }
      for (let col = 0; col < SIZE; col++) {
        BOARD[row][col] = currRow[col];
      }
      // BOARD[row] = currRow;
    }
    for (let col = 0; col < SIZE; col++) {
      let tempColList = [...COLLIST[col]];
      let tempBoardCol = [];
      for (let row = 0; row < SIZE; row++) {
        tempBoardCol.push(BOARD[row][col]);
      }
      let tempCol = [...tempBoardCol];
      COLLIST[col] = prune_lines(COLLIST[col], tempBoardCol);
      if (tempColList.length != COLLIST[col].length) {
        changing = true;
      }
      let currCol = eliminate_options(COLLIST[col], SIZE);
      if (currCol.length != SIZE) {
        console.log("Does this happen?");
        return -1;
      }
      for (let row = 0; row < SIZE; row++) {
        BOARD[row][col] = currCol[row];
      }
    }
  }
  autoX = tempAutoX;
  if (!changing) {
    return 0;
  }
  return 1;
}

// function AIPLAY(SIZE, BOARD, ROWLIST, COLLIST) {
//   let changing = false;
//   tempAutoX = autoX;
//   autoX = false;
//   for (let row = 0; row < SIZE; row++) {
//     let tempRow = [...BOARD[row]];
//     let tempRowList = [...ROWLIST[row]];
//     ROWLIST[row] = prune_lines(ROWLIST[row], BOARD[row]);
//     if (!arraysEqual(tempRowList, ROWLIST[row])) {
//       changing = true;
//     }
//     let currRow = eliminate_options(ROWLIST[row], SIZE);
//     if (currRow.length != SIZE) {
//       console.log("Does this happen?");
//       autoX = tempAutoX;
//       return -1;
//     }
//     if (!arraysEqual(tempRow, currRow)) {
//       queue.push(['r', row, currRow]);
//     }
//     for (let col = 0; col < SIZE; col++) {
//       BOARD[row][col] = currRow[col];
//     }
//     // BOARD[row] = currRow;
//   }
//   for (let col = 0; col < SIZE; col++) {
//     let tempColList = [...COLLIST[col]];
//     let tempBoardCol = [];
//     for (let row = 0; row < SIZE; row++) {
//       tempBoardCol.push(BOARD[row][col]);
//     }
//     let tempCol = [...tempBoardCol];
//     COLLIST[col] = prune_lines(COLLIST[col], tempBoardCol);
//     if (!arraysEqual(tempColList, COLLIST[col])) {
//       changing = true;
//     }
//     let currCol = eliminate_options(COLLIST[col], SIZE);
//     if (currCol.length != SIZE) {
//       console.log("Does this happen?");
//       return -1;
//     }
//     for (let row = 0; row < SIZE; row++) {
//       BOARD[row][col] = currCol[row];
//     }
//     if (!arraysEqual(tempCol, currCol)) {
//       queue.push(['c', col, currCol]);
//     }
//   }
//   autoX = tempAutoX;
//   if (!changing) {
//     return 0;
//   }
//   return 1;
// }

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
      let sum = size;
      for (let j = 0; j < temp.length; j++) sum -= temp[j];
      if (sum != 0) temp.push(sum);
      result.push(temp);
    }
    x++;
  }
  return result;
}

function eliminate_options(lines, size) {
  // should fill in what is implied by the lines list
  // lines is a row of rowlist or collist which is every possible valid version of the line.

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
  // lines is every valid version of the current row/col
  // final is what is currently on the board.

  let result = []

  for (let i = 0; i < lines.length; i++) {
    let curLine = lines[i];
    let parity = -1;
    let valid = true;
    let offset = 0;
    let remaining = SIZE;
    for (let j = 0; j < curLine.length && valid; j++) {
      let curOffset = offset;
      let curRestriction = curLine[j];
      remaining -= curLine[j];
      for (let x = curOffset; x < curRestriction+curOffset && valid; x++) {
        offset += 1;
        if (parity == 1 && final[x] == -1) valid = false;
        if (parity == -1 && final[x] == 1) valid = false;
      }
      parity = -parity
    }
    let curOffset = offset;
    for (let j = curOffset; j < remaining+curOffset && valid; j++) {
      offset += 1;
      if (parity == 1 && final[j] == -1) valid = false;
      if (parity == -1 && final[j] == 1) valid = false;
    }
    if (valid) result.push(curLine);
    // if possible, add to result.
  }
  if (result.length == 0) {
    console.log("what?");
  }
  // let sum = 0;
  // for (let i = 0; i < result.length; i++) {
  //   sum += result[i];
  // }
  // if (SIZE - sum > 0) {
  //   result.push(SIZE - sum);
  // }
  return result;

  for (let i = 0; i < lines.length; i++) {
    // this code is to buffer the end of the current line to be -1s
    let sum = 0;
    // for (let x = 0; x < lines[i].length; x++) {
    //   sum += lines[i][x];
    // }
    // if (final.length - sum != 0) {
    //   lines[i].push(final.length - sum);
    // }
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
  ROWRESTRICTIONS = [];
  COLRESTRICTIONS = [];
  ROWLIST = [];
  COLLIST = [];
  // verified to be correct
  finalBoard = Array(SIZE).fill().map(() => Array(SIZE).fill(0));

  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      let x = (random() * 100 < percent);
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
}

function validBoard() {
  let valid = false;
  while (!valid) {
    initialSetup();
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