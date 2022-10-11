let size = 8;
let width = 100;
let board;
let recentMove = [-1, -1];
let stop_game = false;

let header = "";

let blue=[0,0,255];
let red=[255,0,0];
let green=[0,102,54];
let white=[255,255,255];
let transparent_white=[85,153,121];
let black=[0,0,0];
let transparent_black=[0,51,27];
let yellow=[255,255,51];

let white_player = null;
let black_player = null;

function MoveHelper(player) {
  if (!(player instanceof ManualPlayer)) {
    let validMoves = board.getAllValidMoves();
    if (validMoves.length != 0) {
      let move = player.findMove(board);
      console.log(move);
      board.makeMove(move[0], move[1]);
    } else {
      board.turn = -board.turn;
    }
  }
}

function setup() {
  console.log(white_player, black_player);
  board = new Board(size);
  let myCanvas = createCanvas(board.size*width, board.size*width+50);
  // frameRate(1);
}

function draw() {
  console.log(board.turn);
  background(white);
  noStroke();
  textSize(width/3);
  textAlign(CENTER, CENTER);
  if (board.turn == 1) {
    fill('white');
    rect(0, 0, (width*size), 50);
    fill('black');
  } else {
    fill('black');
    rect(0, 0, (width*size), 50);
    fill('white');
  }
  text(header, ((width*size)/2), 25);
  let count = 0;
  for (let row = 0; row < board.size; row++) {
    for (let col = 0; col < board.size; col++) {
      if (board.isValidMove(row, col)) {
        count++;
        fill(yellow);
      } else {
        fill(black);
      }
      rect(width*col, 50+width*row, width, width);
      fill(green);
      rect(2+width*col,50+2+width*row,width-4,width-4);
      if (board.board[row][col] == 1) {
        fill(white);
      } else if(board.board[row][col] == -1) {
        fill(black);
      }
      circle(width/2+width*col, 50+width/2+width*row, width-6);
    }
  }
  if (board.game_over) {
    let finalScore = board.printScore();
    for (let row = 0; row < board.size; row++) {
      for (let col = 0; col < board.size; col++) {
        if (board.board[row][col] == 0) {
          if (board.turn == 1) {
            fill(transparent_black);
          } else if (board.turn == -1) {
            fill(transparent_white);
          }
          circle(width/2+width*col, 50+width/2+width*row, width-6);
        }
      }
    }
    if (finalScore[0] + finalScore[1] != board.size * board.size) {
    }
    if (finalScore[0] > finalScore[1]) {
      header = 'White Player Won ' + finalScore[0] + ' - ' + finalScore[1];
    } else if (finalScore[0] < finalScore[1]) {
      header = 'Black Player Won ' + finalScore[1] + ' - ' + finalScore[0];
    } else {
      header = 'It was a Tie!'
    }
  }
  if (!(white_player == null)) {
    if (!board.game_over) {
      let white_depth = "";
      let black_depth = "";
      if (white_player.max_depth != 0) {
        white_depth = " " + white_player.max_depth + " ";
      }
      if (black_player.max_depth != 0) {
        black_depth = " " + black_player.max_depth;
      }
      header = white_player.name + white_depth + ' vs ' + black_player.name + black_depth;
      
      textSize(width/3);
      textAlign(CENTER, CENTER);
      if (board.turn == 1) {
        fill('white');
        rect(0, 0, (width*size), 50);
        fill('black');
      } else {
        fill('black');
        rect(0, 0, (width*size), 50);
        fill('white');
      }
      text(header, ((width*size)/2), 25);
      if (board.turn == -1) {
        fill('black');
        rect(0, 0, (width*size), 50);
        fill('white');
        text(header, ((width*size)/2), 25);
        MoveHelper(black_player); 
      }
      else if (board.turn == 1) {
        fill('white');
        rect(0, 0, (width*size), 50);
        fill('black');
        text(header, ((width*size)/2), 25);
        MoveHelper(white_player);
      }
    }
  }
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width*size && mouseY >= 50 && mouseY < (width*size+50)) {
    if (board.turn == 1 && white_player instanceof ManualPlayer) {
      let x = floor((mouseY-50) / ((board.size*width) / size));
      let y = floor(mouseX / ((board.size*width) / size));
      if (board.isValidMove(x, y)) {
        board.makeMove(x, y);
      }
    } 
    if (board.turn == -1 && black_player instanceof ManualPlayer) {
      let x = floor((mouseY-50) / ((board.size*width) / size));
      let y = floor(mouseX / ((board.size*width) / size));
      if (board.isValidMove(x, y)) {
        board.makeMove(x, y);
      }
    }
  }
}