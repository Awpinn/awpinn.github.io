class ManualPlayer {
  constructor() {
    this.name = "Player";
    this.max_depth = 0;
  }  
}

class RandomPlayer {
  constructor() {
    this.name = "Random";
    this.max_depth = 0;
  }

  findMove(board){
    let moves = [];
    for (let row = 0; row < board.size; row++) {
      for (let col = 0; col < board.size; col++) {
        if (board.isValidMove(row,col)) {
          moves.push([row,col]);
        }
      }
    }
    return moves[floor(random(0, moves.length))];
  }
}

class GreedyPlayer {
  constructor() {
    this.name = "Greedy";
    this.max_depth = 0;
  }
  
  greedy(board) {
    validMoves = board.getAllValidMoves();
    if (board.turn == 1) {
      let bestVal = [[0,0], -Infinity];
      for (let move = 0; move < validMoves.length; move++) {
        board.makeMove(validMoves[move][0], validMoves[move][1]);
        if (board.white_score - board.black_score > bestVal[1]) {
          bestVal = [validMoves[move], board.white_score - board.black_score];
        }
        board.undoMove();
      }
      return bestVal;
    } else {
      let bestVal = [[0,0], Infinity];
      for (let move = 0; move < validMoves.length; move++) {
        board.makeMove(validMoves[move][0], validMoves[move][1]);
        if (board.white_score - board.black_score < bestVal[1]) {
          bestVal = [validMoves[move], board.white_score - board.black_score];
        }
        board.undoMove();
      }
      return bestVal;
    }
  }
  
  findMove(currentBoard) {
    let board = Object.assign(Object.create(Object.getPrototypeOf(currentBoard)), currentBoard); // more code that might not work, i don't know how to clone a class instance
    let move = this.greedy(board)[0];
    return move;
  }
}

class PlayerMM {
  constructor(max_depth, heuristic=null) {
    this.name = "Min-Max";
    this.max_depth = max_depth;
    if (heuristic == null) {
      this.heuristic = betterHeuristic; // this line might not work look at later / if bugs lol
    } else {
      this.heuristic = heuristic;
    }
  }
  
  minimax(board, depth) {
    let validMoves = board.getAllValidMoves();
    if (board.game_over || board.depth == 0) {
      return [null, this.heuristic(board)];
    }
    let bestVal = [[0, 0], 0];
    if (board.turn == 1) {
      bestVal = [[0, 0], -Infinity];
      for (let child = 0; child < validMoves.length; child++) {
        board.makeMove(validMoves[child][0], validMoves[child][1]);
        let v = this.minimax(board, depth-1);
        board.undoMove();
        if (v[1] > bestVal[1]) {
          bestVal = [validMoves[child], v[1]];
        }
      }
      return bestVal;
    } else {
      bestVal = [[0, 0], Infinity];
      for (let child = 0; child < validMoves.length; child++) {
        board.makeMove(validMoves[child][0], validMoves[child][1]);
        let v = this.minimax(board, depth-1);
        board.undoMove();
        if (v[1] < bestVal[1]) {
          bestVal = [validMoves[child], v[1]];
        }
      }
      return bestVal;
    }
  }
  
  findMove(currentBoard) {
    let board = JSON.parse(JSON.stringify(currentBoard)); // more code that might not work, i don't know how to clone a class instance
    let move = this.minimax(board, this.max_depth)[0];
    return move;
  }
}



class PlayerAB {
  constructor(max_depth, heuristic=null) {
    this.name = "Alpha-Beta";
    this.max_depth = max_depth;
    if (heuristic == null) {
      this.heuristic = betterHeuristic; // this line might not work look at later / if bugs lol
    } else {
      this.heuristic = heuristic;
    }
  }
  
  alphaBeta(board, depth, alpha, beta) {
    let validMoves = board.getAllValidMoves();
    if (board.game_over || depth == 0) {
      return [null, this.heuristic(board)];
    }
    let bestVal = [[0, 0], 0];
    if (board.turn == 1) {
      bestVal = [[0, 0], -Infinity];
      for (let child = 0; child < validMoves.length; child++) {
        board.makeMove(validMoves[child][0], validMoves[child][1]);
        let v = this.alphaBeta(board, depth-1, alpha, beta);
        board.undoMove();
        if (v[1] > bestVal[1]) {
          bestVal = [validMoves[child], v[1]];
        }
        alpha = max(alpha, bestVal[1])
        if (beta <= alpha) {
          break;
        }
      }
      return bestVal;
    } else {
      bestVal = [[0, 0], Infinity];
      for (let child = 0; child < validMoves.length; child++) {
        board.makeMove(validMoves[child][0], validMoves[child][1]);
        let v = this.alphaBeta(board, depth-1, alpha, beta);
        board.undoMove();
        if (v[1] < bestVal[1]) {
          bestVal = [validMoves[child], v[1]];
        }
        beta = min(beta, bestVal[1]);
        if (beta <= alpha) {
          break;
        }
      }
      return bestVal;
    }
  }
  
  findMove(currentBoard) {
    const board = _.cloneDeep(currentBoard); // more code that might not work, i don't know how to clone a class instance
    let move = this.alphaBeta(board, this.max_depth, -Infinity, Infinity)[0];
    return move;
  }
}