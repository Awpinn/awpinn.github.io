function basicHeuristic(board) {
    return board.white_score - board.black_score
}

function evalDiscDiff(board) {
    // sees how far ahead or behind you are than the opponent
    return 100 * (board.white_score - board.black_score) / (board.white_score + board.black_score)
}

function evalControlCorners(board) {
    // checks to see who has possession of the corners (corners are extreme power)
    whiteCorners = 0
    blackCorners = 0

    if (board.board[0][0] == 1) whiteCorners += 1
    if (board.board[0][board.size-1] == 1) whiteCorners += 1
    if (board.board[board.size-1][0] == 1) whiteCorners += 1
    if (board.board[board.size-1][board.size-1] == 1) whiteCorners += 1
    
    if (board.board[0][0] == -1) blackCorners += 1
    if (board.board[0][board.size-1] == -1) blackCorners += 1
    if (board.board[board.size-1][0] == -1) blackCorners += 1
    if (board.board[board.size-1][board.size-1] == -1) blackCorners += 1

    return 100 * (whiteCorners - blackCorners) / (whiteCorners + blackCorners + 1)
}

function evalMobility(board) {
    // checks to see which player would have more moves
    whiteMoves = board.getAllValidMoves().length
    board.turn = -board.turn
    blackMoves = board.getAllValidMoves().length
    board.turn = -board.turn
    return 100 * (whiteMoves - blackMoves) / (whiteMoves + blackMoves + 1)
}

function betterHeuristic(board) {
    if (board.white_score + board.black_score < 20) { // early game
        // most important to go for corners in early game (mobility is good too)
        evaluation = 100 * evalControlCorners(board) + 5 * evalMobility(board)
        return evaluation
    }
    else if (board.white_score + board.black_score <=55) { // mid game
        // corners are still just as important, mobility is less important because you can surely find a move, the score starts to matter a little bit, and we start to look at the end of the game who would place the last piece
        evaluation = 100 * evalControlCorners(board) + 2 * evalMobility(board) + evalDiscDiff(board)
        return evaluation
    }
    else { // late game
        // corners are still just as important, mobility is even more important now (not sure why), the score is really really important now, and its even more important to check who will place the last move
        evaluation = 100 * evalControlCorners(board) + 10 * evalMobility(board) + 50 * evalDiscDiff(board)
        return evaluation
    }
}