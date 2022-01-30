class Board {
  constructor(size) {
    this.white_score = 2;
    this.black_score = 2;
    this.size = size;
    this.turn = -1;
    this._trace = [];
    this.board = Array(this.size).fill().map(() => Array(this.size).fill(0));
    this.game_over = false;
    this.board[this.size/2-1][this.size/2-1] = 1;
    this.board[this.size/2][this.size/2] = 1;
    this.board[this.size/2-1][this.size/2] = -1;
    this.board[this.size/2][this.size/2-1] = -1;
    this.board_history = [];
    this.found = false;
  }
  
  resetBoard() {
    this.white_score = 2;
    this.black_score = 2;
    this.game_over = false;
    this.turn = -1;
    this._trace = [];
    this.board = Array(this.size).fill().map(() => Array(this.size).fill(0));
    this.board[this.size/2-1][this.size/2-1] = 1;
    this.board[this.size/2][this.size/2] = 1;
    this.board[this.size/2-1][this.size/2] = -1;
    this.board[this.size/2][this.size/2-1] = -1;
    this.board_history = [];
    this.found = false;
    return this;
  }
  
  printScore() {
    this.white_score = 0;
    this.black_score = 0;
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (this.board[x][y] == 1) {
          this.white_score++;
        } else if (this.board[x][y] == -1) {
          this.black_score++;
        }
      }
    }
    if (this.game_over) {
      if (this.turn == 1) {
        this.black_score = this.size*this.size - this.white_score;
      } else if (this.turn == -1) {
        this.white_score = this.size*this.size - this.black_score;
      }
    }
    return [this.white_score, this.black_score];
  }
  
  makeMove(x, y) {
    this._trace.push([x,y]);
    let tempBoard = [];
    for (let row = 0; row < this.size; row++) {
      let tempRow = [];
      for (let col = 0; col < this.size; col++) {
        tempRow.push(this.board[row][col]);
      }
      tempBoard.push(tempRow);
    }
    this.board_history.push(tempBoard);
    this.board[x][y] = this.turn;
    this.updateBoard(x, y);
    if (this.turn == 1) {
      this.white_score++;
    } else if (this.turn == -1) {
      this.black_score++;
    }
    this.turn = -this.turn;
    if (this.getAllValidMoves().length == 0) {
      this.turn = -this.turn;
      if (this.getAllValidMoves().length == 0) {
        this.turn = -this.turn
        this.game_over = true;
      }
    }
  }
  
  undoMove() {
    let x = 0;
    let y = 0;
    this.board = this.board_history.pop();
    [x, y] = this._trace.pop();
    [this.white_score, this.black_score] = this.printScore();
    this.turn = -this.turn;
    if (!this.isValidMove(x, y)) {
      this.turn = -this.turn;
    }
    this.game_over = false;
  }
  
  checkHelper(x, y) {
    if (this.board[x][y] == 0) {
      return -1;
    }
    if (!this.found && this.board[x][y] == this.turn) {
      return -1;
    }
    if (!this.found && this.board[x][y] == -this.turn) {
      this.found = true;
    }
    if (this.found && this.board[x][y] == this.turn) {
      return true;
    }
  }
  
  checkStraight(row, col) {
    let x = 0;
    let y = 0;
//     checking down
    this.found = false;
    [x, y] = [row, col];
    for (y = col+1; y < this.size; y++) {
      if (this.checkHelper(x, y) == -1) {
        break;
      }
      if (this.checkHelper(x, y)) {
        return true;
      }
    }
//     checking up
    this.found = false;
    [x, y] = [row, col];
    for (y = col-1; y >= 0; y--) {
      if (this.checkHelper(x, y) == -1) {
        break;
      }
      if (this.checkHelper(x, y)) {
        return true;
      }
    }
//     checking right
    this.found = false;
    [x, y] = [row, col];
    for (x = row+1; x < this.size; x++) {
      if (this.checkHelper(x, y) == -1) {
        break;
      }
      if (this.checkHelper(x, y)) {
        return true;
      }
    }
//     checking left
    this.found = false;
    [x, y] = [row, col];
    for (x = row-1; x >= 0; x--) {
      if (this.checkHelper(x, y) == -1) {
        break;
      }
      if (this.checkHelper(x, y)) {
        return true;
      }
    }
    return false;
  }
  
  checkDiagonal(row, col) {
    let x = 0;
    let y = 0;
//     checking up right
    this.found = false;
    [x, y] = [row, col];
    while (x < this.size-1 && y < this.size-1) {
      x++;
      y++;
      if (this.checkHelper(x, y) == -1) {
        break;
      } else if (this.checkHelper(x, y)) {
        return true;
      }
    }
//     checking down right
    this.found = false;
    [x, y] = [row, col];
    while (x < this.size-1 && y > 0) {
      x++;
      y--;
      if (this.checkHelper(x, y) == -1) {
        break;
      } else if (this.checkHelper(x, y)) {
        return true;
      }
    }
//     checking down left
    this.found = false;
    [x, y] = [row, col];
    while (x > 0 && y > 0) {
      x--;
      y--;
      if (this.checkHelper(x, y) == -1) {
        break;
      } else if (this.checkHelper(x, y)) {
        return true;
      }
    }
//     checking up left
    this.found = false;
    [x, y] = [row, col];
    while (x > 0 && y < this.size-1) {
      x--;
      y++;
      if (this.checkHelper(x, y) == -1) {
        break;
      } else if (this.checkHelper(x, y)) {
        return true;
      }
    }
    return false;
  }
  
  isValidMove(row, col) {
    if (this.board[row][col] != 0) {
      return false;
    }
    if (this.checkStraight(row, col)) {
      return true;
    }
    if (this.checkDiagonal(row, col)) {
      return true;
    }
    return false;
  }
  
  getAllValidMoves() {
    let result = [];
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.isValidMove(col, row)) {
          result.push([col, row]);
        }
      }
    }
    return result;
  }
  
  flipHelper(x, y) {
    this.board[x][y] = this.turn;
    if (this.turn == 1) {
      this.white_score++;
      this.black_score--;
    } else {
      this.white_score--;
      this.black_score++;
    }
  }
  
  flipStraight(row, col) {
    let x = 0;
    let y = 0;
//     flip up
    [x, y] = [row, col];
    let moves = [];
    while (y > 0) {
      y--;
      if (this.board[x][y] == 0) {
        break;
      }
      if (this.board[x][y] == (-this.turn)) {
        moves.push([x, y]);
      } else {
        for (let i = 0; i < moves.length; i++) {
          this.flipHelper(moves[i][0], moves[i][1]);
        }
        break;
      }
    }
//     flip down
    [x, y] = [row, col];
    moves = [];
    while (y < this.size-1) {
      y++;
      if (this.board[x][y] == 0) {
        break;
      }
      if (this.board[x][y] == -this.turn) {
        moves.push([x, y]);
      } else {
        for (let i = 0; i < moves.length; i++) {
          this.flipHelper(moves[i][0], moves[i][1]);
        }
        break;
      }
    }

//     flip right
    [x, y] = [row, col];
    moves = [];
    while (x < this.size-1) {
      x++;
      if (this.board[x][y] == 0) {
        break;
      }
      if (this.board[x][y] == -this.turn) {
        moves.push([x, y]);
      } else {
        for (let i = 0; i < moves.length; i++) {
          this.flipHelper(moves[i][0], moves[i][1]);
        }
        break;
      }
    }

//     flip left
    [x, y] = [row, col];
    moves = [];
    while (x > 0) {
      x--;
      if (this.board[x][y] == 0) {
        break;
      }
      if (this.board[x][y] == -this.turn) {
        moves.push([x, y]);
      } else {
        for (let i = 0; i < moves.length; i++) {
          this.flipHelper(moves[i][0], moves[i][1]);
        }
        break;
      }
    }
  }
  
  flipDiagonal(row, col) {
    let x = 0;
    let y = 0;
//     flip up left
    [x, y] = [row, col];
    let moves = [];
    while (y > 0 && x > 0) {
      y--;
      x--;
      if (this.board[x][y] == 0) {
        break;
      }
      if (this.board[x][y] == -this.turn) {
        moves.push([x, y]);
      } else {
        for (let i = 0; i < moves.length; i++) {
          this.flipHelper(moves[i][0], moves[i][1]);
        }
        break;
      }
    }
//     flip down left
    [x, y] = [row, col];
    moves = [];
    while (y < this.size-1 && x > 0) {
      y++;
      x--;
      if (this.board[x][y] == 0) {
        break;
      }
      if (this.board[x][y] == -this.turn) {
        moves.push([x, y]);
      } else {
        for (let i = 0; i < moves.length; i++) {
          this.flipHelper(moves[i][0], moves[i][1]);
        }
        break;
      }
    }
//     flip up right
    [x, y] = [row, col];
    moves = [];
    while (y > 0 && x < this.size-1) {
      y--;
      x++;
      if (this.board[x][y] == 0) {
        break;
      }
      if (this.board[x][y] == -this.turn) {
        moves.push([x, y]);
      } else {
        for (let i = 0; i < moves.length; i++) {
          this.flipHelper(moves[i][0], moves[i][1]);
        }
        break;
      }
    }
//     flip down right
    [x, y] = [row, col];
    moves = [];
    while (y < this.size-1 && x < this.size-1) {
      y++;
      x++;
      if (this.board[x][y] == 0) {
        break;
      }
      if (this.board[x][y] == -this.turn) {
        moves.push([x, y]);
      } else {
        for (let i = 0; i < moves.length; i++) {
          this.flipHelper(moves[i][0], moves[i][1]);
        }
        break;
      }
    }
  }
  
  updateBoard(row, col) {
    this.flipStraight(row, col);
    this.flipDiagonal(row, col);
  }
}