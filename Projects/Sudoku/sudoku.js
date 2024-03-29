let width = 500;
let size = 9;
let distance = width/size;
let attempts = 15;
let counter = 1;
let selectedNum = 1;
let manual = true;

let board = Array(size).fill().map(() => Array(size).fill(0));
let finalBoard = Array(size).fill().map(() => Array(size).fill(0));
let start = Array(size).fill().map(() => Array(size).fill(0));

function setup() {
    for (let i = 1; i <= 9; i++) {
        let curCell = document.getElementById("cell"+i);
        curCell.style.backgroundColor = "#f0f0f0";
    }
    manual = true;
    updateSelectedNum(1);
    // noLoop();
    frameRate(1);   
    createCanvas(width, width);
    generateBoard(finalBoard);
    board = _.cloneDeep(finalBoard);
    removeFromBoard(board);
    start = _.cloneDeep(board);
    textAlign(CENTER, CENTER);
    textSize(distance);
    // draw();
    // console.log(solveBoard(board));
    // console.log("done");
}

function draw() {
    background('white');
    for (let x = 0; x <= size; x++) {
        if (x % 3 == 0) {
            strokeWeight(5);
        } else {
            strokeWeight(2);
        }
        line(0, x*distance, width, x*distance);
        line(x*distance, 0, x*distance, width);
    }
    // put in the for sure numbers
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (start[row][col] != 0) {
                fill('black');
                text(''+board[row][col], col*distance+distance/2, row*distance+distance/2+3);
            }
            else if (board[row][col] != 0) {
                fill('#2a5a5a');
                text(''+board[row][col], col*distance+distance/2, row*distance+distance/2+3);
            }
        }
    }
}

function mousePressed() {
    if (manual) {
      if (mouseButton === LEFT) {
        if (mouseX >= 0 && mouseX <= width && mouseY >=0 && mouseY <= width && start[floor(mouseY/distance)][floor(mouseX/distance)] == 0) {
            board[floor(mouseY/distance)][floor(mouseX/distance)] = selectedNum;
        }
      } else if (mouseButton === RIGHT) {
        if (mouseX >= 0 && mouseX <= width && mouseY >=0 && mouseY <= width && start[floor(mouseY/distance)][floor(mouseX/distance)] == 0) {
            board[floor(mouseY/distance)][floor(mouseX/distance)] = 0;
        }
      }
    }
  }

function solveBoard(grid) {
    let row = 0;
    let col = 0;
    loop1:
        for (row = 0; row < size; row++) {
            for (col = 0; col < size; col++) {
                if (grid[row][col] == 0) {
                    for (let value = 1; value <= 9; value++) {
                        let currCol = grid.map(x => x[col]);
                        if (!(grid[row].includes(value))) {
                            if (!(currCol.includes(value))) {
                                let rowOffset = floor(row/3);
                                let colOffset = floor(col/3);
                                let square = [];
                                for (let i = 0; i < 3; i++) {
                                    for (let j = 0; j < 3; j++) {
                                        square.push(grid[i+3*rowOffset][j+3*colOffset]);
                                    }
                                }
                                if (!(square.includes(value))) {
                                    grid[row][col]=value;
                                    if (checkBoard(grid)) {
                                        counter++;
                                        break;
                                    } else {
                                        let x = solveBoard(grid);
                                        if (x != null && x[0] == true) {
                                            return [true, grid];
                                        }
                                    }
                                }
                            }
                        }
                    }
                    break loop1;
                }
            }
        }
        grid[row][col] = 0
}

function updateSelectedNum(x) {
    let name = "cell" + selectedNum;
    let curCell = document.getElementById(name);
    curCell.style.backgroundColor = "#f0f0f0";
    name = "cell" + x;
    curCell = document.getElementById(name);
    curCell.style.backgroundColor = "lightblue";
    selectedNum = x;
}

function generateBoard(grid) {
    numberList = [1,2,3,4,5,6,7,8,9];
    let row = 0;
    let col = 0;
    loop1:
        for (row = 0; row < size; row++) {
            for (col = 0; col < size; col++) {
                if (grid[row][col] == 0) {
                    numberList = shuffle(numberList);
                    for (let x = 0; x < numberList.length; x++) {
                        let currVal = numberList[x];
                        let currCol = grid.map(x => x[col]);
                        if (!(grid[row].includes(currVal))) {
                            if (!(currCol.includes(currVal))) {
                                let rowOffset = floor(row/3);
                                let colOffset = floor(col/3);
                                let square = [];
                                for (let i = 0; i < 3; i++) {
                                    for (let j = 0; j < 3; j++) {
                                        square.push(grid[i+3*rowOffset][j+3*colOffset]);
                                    }
                                }
                                if (!(square.includes(currVal))) {
                                    grid[row][col] = currVal;
                                    if (checkBoard(grid)) {
                                        return true;
                                    }
                                    if (generateBoard(grid)) {
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                    break loop1;
                }
            }
        }
    grid[row][col] = 0;
}

function checkBoard (grid) {
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (grid[row][col]  == 0) {
                return false;
            }
        }
    }
    return true;
}

function shuffle(grid) {
    let currentIndex = grid.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = floor(random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [grid[currentIndex], grid[randomIndex]] = [
        grid[randomIndex], grid[currentIndex]];
    }
  
    return grid;
}

function removeFromBoard(grid) {
    while (attempts > 0) {
        let row = floor(random() * size);
        let col = floor(random() * size);
        while (grid[row][col] == 0) {
            row = floor(random() * size);
            col = floor(random() * size);
        }
        let backup = grid[row][col];
        grid[row][col] = 0;

        let copyGrid = _.cloneDeep(grid);

        counter = 0;
        solveBoard(grid, counter);
        if (counter != 1) {
            grid[row][col] = backup;
            attempts--;
        }
    }
}