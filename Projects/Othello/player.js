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

class MonteCarlo {

  constructor(timeout = 3, UCB1ExploreParam = 2) {
    this.name = "MonteCarlo";
    this.max_depth = timeout;
    this.UCB1ExploreParam = UCB1ExploreParam
    this.timeout = timeout
    this.nodes = new Map()
  }

  makeNode(state) {
    if (!this.nodes.has(state)) {
      let unexpandedPlays = state.getAllValidMoves().slice()
      let node = new MonteCarloNode(null, null, state, unexpandedPlays)
      this.nodes.set(state, node)
    }
  }

  runSearch(state, timeout = 3) {

    this.makeNode(state)

    let draws = 0
    let totalSims = 0
    
    let end = Date.now() + timeout * 1000

    while (Date.now() < end) {
      let node = this.select(state)
      let winner = null
      
      if (node.state.game_over) {
        let final_score = node.state.printScore();
        if (final_score[0] > final_score[1]) {
          winner = 1
        } else if (final_score[1] > final_score[0]) {
          winner = -1
        } else {
          winner = 0
        }
      }

      if (node.isLeaf() === false && winner === null) {
        node = this.expand(node)
        winner = this.simulate(node)
      }
      this.backpropagate(node, winner)

      if (winner === 0) draws++
      totalSims++
    }

    return { runtime: timeout, simulations: totalSims, draws: draws }
  }

  bestPlay(state, policy = "robust") {

    this.makeNode(state)

    // If not all children are expanded, not enough information
    if (this.nodes.get(state).isFullyExpanded() === false)
      throw new Error("Not enough information!")

    let node = this.nodes.get(state)
    let allPlays = node.allPlays()
    let bestPlay

    // Most visits (robust child)
    if (policy === "robust") {
      let max = -Infinity
      for (let play of allPlays) {
        let childNode = node.childNode(play)
        if (childNode.n_plays > max) {
          bestPlay = play
          max = childNode.n_plays
        }
      }
    }

    // Highest winrate (max child)
    else if (policy === "max") {
      let max = -Infinity
      for (let play of allPlays) {
        let childNode = node.childNode(play)
        let ratio = childNode.n_wins / childNode.n_plays
        if (ratio > max) {
          bestPlay = play
          max = ratio
        }
      }
    }

    return bestPlay
  }

  select(state) {
    let node = this.nodes.get(state)
    while(node.isFullyExpanded() && !node.isLeaf()) {
      let plays = node.allPlays()
      let bestPlay
      let bestUCB1 = -Infinity
      for (let play of plays) {
        let childUCB1 = node.childNode(play).getUCB1(this.UCB1ExploreParam)
        if (childUCB1 > bestUCB1) {
          bestPlay = play
          bestUCB1 = childUCB1
        }
      }
      node = node.childNode(bestPlay)
    }
    return node
  }

  expand(node) {
    let plays = node.unexpandedPlays()
    let index = Math.floor(Math.random() * plays.length)
    let play = plays[index]
    let tempState = _.cloneDeep(node.state)
    tempState.makeMove(play[0], play[1])
    let childState = tempState
    let childUnexpandedPlays = childState.getAllValidMoves()
    let childNode = node.expand(play, childState, childUnexpandedPlays)
    this.nodes.set(childState, childNode)

    return childNode
  }

  simulate(node) {

    let state = node.state
    let winner = null
    if (node.state.game_over) {
      let final_score = node.state.printScore();
      if (final_score[0] > final_score[1]) {
        winner = 1
      } else if (final_score[1] > final_score[0]) {
        winner = -1
      } else {
        winner = 0
      }
    }

    while (winner === null) {
      let plays = state.getAllValidMoves()
      let play = plays[Math.floor(Math.random() * plays.length)]
      state.makeMove(play[0], play[1])
      if (node.state.game_over) {
        let final_score = node.state.printScore();
        if (final_score[0] > final_score[1]) {
          winner = 1
        } else if (final_score[1] > final_score[0]) {
          winner = -1
        } else {
          winner = 0
        }
      }
    }

    return winner
  }

  backpropagate(node, winner) {

    while (node !== null) {
      node.n_plays += 1
      // Parent's choice
      if (node.state.turn == -winner) {
        node.n_wins += 1
      }
      node = node.parent
    }
  }

  getStats(state) {
    let node = this.nodes.get(state)
    let stats = { n_plays: node.n_plays, n_wins: node.n_wins, children: [] }
    for (let child of node.children.values()) {
      if (child.node === null) stats.children.push({ play: child.play, n_plays: null, n_wins: null})
      else stats.children.push({ play: child.play, n_plays: child.node.n_plays, n_wins: child.node.n_wins})
    }
    return stats
  }

  findMove(currentBoard, trace=null, x=null, y=null) {
    if (currentBoard.getAllValidMoves().length == 1) {
      return currentBoard.getAllValidMoves()[0]
    }
    let board = _.cloneDeep(currentBoard)
    this.runSearch(board, this.timeout)
    return this.bestPlay(board, "robust")
  }
}