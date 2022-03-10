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

    // modeled after monte carlo described in https://medium.com/@quasimik/monte-carlo-tree-search-applied-to-letterpress-34f41c86e238

    constructor(timeout=3, UCB1ExploreParam = 2) {
      this.UCB1ExploreParam = UCB1ExploreParam; // not 100% sure what the UCB1ExploreParam is but it is used in MonteCarloNode getUCB1()
      this.timeout = timeout; // timeout is the number of seconds that it takes to sample through possibilities of boards
      this.nodes = {}; // creates a new dictionary to be all of the nodes it has looked at
    }

    makeNode(state) {
      // makes a node and adds it to the dictionary if it isn't there already
      if (!(state in this.nodes)) {
        let unexpandedPlays = list(state.getAllValidMoves()) // it hasn't been seen before, so the unexpandedPlays are all of the valid moves
        let node = MonteCarloNode(None, None, state, unexpandedPlays) // creates the node from MonteCarloNode()
        this.nodes.update({state:node}) // adds it to the dictionary from the state
      }
    }

    runSearch(state, timeout) {
      // taking the timeout and a state
      this.makeNode(state) // makes a node for the state
      let draws = 0 // there have been 0 draws so far
      let totalSims = 0 // there have been 0 simulations so far
      let end = time() + timeout // the end is timeout seconds from now
      while (time() < end) { // while the game hasn't timed out
        let node = this.select(state) // selects a node
        // checks to see if there is a winner
        let winner = null; 
        if (node.state.game_over == true) {
          let finalScore = node.state.printScore();
          if (finalScore[0] > finalScore[1]) {
            winner = 1
          }
          else if (finalScore[1] > finalScore[0]) {
            winner = -1
          }
          else {
            winner = 0
          }
        }
        if (node.isLeaf() == false && winner == null) { // if there are valid moves below the current node and there is no winner
          node = this.expand(node) // expand the current node
          winner = this.simulate(node) // and determine who the winner would be
        }
        this.backpropagate(node, winner) // backpropogates the current node
        if (winner == 0) { draws+=1 } // increases the number of draws at a draw
        totalSims+=1 // there has been one more simulation
      }
      return [timeout, totalSims, draws];
    }

    bestPlay(state, policy = "robust") {
      let bestPlay;
        // returns the best play to make at the current state
        this.makeNode(state) // makes a node of the current state
        if (this.nodes.get(state).isFullyExpanded() == false) { // if the current node is not fully expanded
          throw "Not enough information!"; // then we don't know what the best move would be
        }
        let node = this.nodes.get(state) // gets the current node
        let allPlays = node.allPlays() // gets all the plays it could make
        if (policy == "robust") {
          let maximum = -math.inf // starts with the max -infinity (to be replaced)
          for (var play in allPlays) { // for each play
            let childNode = node.childNode(play) // gets the child node of the play
            if (childNode.n_plays > maximum) { // if the child node's number of plays is greater than the maximum
              bestPlay = play // replace the best play with the current play
              maximum = childNode.n_plays // the maximum is now the child node's number of plays
            }
          }
        }
        else if (policy == "max") {
          let maximum = -math.inf // starts with the max -infinity (to be replaced)
          for (var play in allPlays) { // for each play
            let childNode = node.childNode(play) // gets the child node of the play
            let ratio = childNode.n_wins / childNode.n_plays // gets the ratio of the child node's number of wins to the child node's number of plays
            if (ratio > maximum) { // if the ratio is greater than the maximum
              bestPlay = play // replace the best play with the current play
              maximum = ratio // the maximum is now the child node's ratio
            }
          }
        }
        return bestPlay // returns the best play
    }

    select(state) {
      // selects the best semi-random node to expand using the UCB1 algorithm
      let node = this.nodes.get(state)
      while (node.isFullyExpanded() && !node.isLeaf()) {
        plays = node.allPlays()
        bestPlay = None
        bestUCB1 = -math.inf
        for (var play in plays) {
          childUCB1 = node.childNode(play).getUCB1(this.UCB1ExploreParam)
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
      plays = node.unexpandedPlays()
      index = random.randint(0,len(plays)-1)
      play = plays[index]
      tempState = copy.deepcopy(node.state)
      tempState.makeMove(play[0], play[1])
      childState = tempState
      childUnexpandedPlays = list(tempState.getAllValidMoves())
      childNode = node.expand(play, childState, childUnexpandedPlays)
      this.nodes[childState] = childNode
      return childNode
    }

    simulate(node) {
      state = node.state
      winner = null;
      if (node.state.game_over) {
          finalScore = node.state.printScore()
          if (finalScore[0] > finalScore[1]) {
            winner = 1
          }
          else if (finalScore[1] > finalScore[0]) {
            winner = -1
          }
          else {
            winner = 0
          }
      }
      while (winner == null) {
        plays = list(state.getAllValidMoves())
        play = plays[random.randint(0,len(plays)-1)]
        state.makeMove(play[0], play[1])
        if (node.state.game_over) {
          finalScore = node.state.printScore()
          if (finalScore[0] > finalScore[1]) {
            winner = 1
          }
          else if (finalScore[1] > finalScore[0]) {
            winner = -1
          }
          else {
            winner = 0
          }
        }
      }
      return winner
    }

    backpropagate(node, winner) {
      while (node != null) {
        node.n_plays += 1
        if (node.state.turn == -winner) {
          node.n_wins += 1
        }
        node = node.parent
      }
    }

    getStats(state) {
      node = this.nodes.get(state)
      stats = [node.n_plays, node.n_wins, []]
      for (var child in node.children.values()) {
        if (child.node == null) {
          stats.children.push([child.play, None, None])
        }
        else {
          stats.children.push([child.play, child.node.n_plays, child.node.n_wins])
        }
        return stats
      }
    }

    findMove(currentBoard, trace=None, x=None, y=None) {
        if (len(list(currentBoard.getAllValidMoves())) == 1) {
            return list(currentBoard.getAllValidMoves())[0]
        }
        board = copy.deepcopy(currentBoard)
        this.runSearch(board, this.timeout)
        return this.bestPlay(board, "robust")
    }
}