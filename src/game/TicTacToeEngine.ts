export type CellValue = 'X' | 'O' | '';
export type GameBoard = CellValue[][];
export type GameResult = 'win' | 'draw' | 'playing';
export type Position = { row: number; col: number };

export interface GameMove {
  position: Position;
  player: CellValue;
}

export interface GameState {
  board: GameBoard;
  currentPlayer: CellValue;
  result: GameResult;
  winner: CellValue | null;
  winningCells: Position[];
  moveHistory: GameMove[];
}

export class TicTacToeEngine {
  private board: GameBoard;
  private currentPlayer: CellValue;
  private moveHistory: GameMove[];

  constructor() {
    this.board = this.createEmptyBoard();
    this.currentPlayer = 'X';
    this.moveHistory = [];
  }

  private createEmptyBoard(): GameBoard {
    return Array(3).fill(null).map(() => Array(3).fill(''));
  }

  makeMove(row: number, col: number): boolean {
    if (!this.isValidMove(row, col)) {
      return false;
    }

    this.board[row][col] = this.currentPlayer;
    this.moveHistory.push({
      position: { row, col },
      player: this.currentPlayer
    });

    if (!this.isGameOver()) {
      this.switchPlayer();
    }

    return true;
  }

  isValidMove(row: number, col: number): boolean {
    return (
      row >= 0 && row < 3 &&
      col >= 0 && col < 3 &&
      this.board[row][col] === '' &&
      !this.isGameOver()
    );
  }

  private switchPlayer(): void {
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  }

  getGameState(): GameState {
    const result = this.getGameResult();
    const winningCells = result === 'win' ? this.getWinningCells() : [];
    const winner = result === 'win' ? this.getWinnerFromCells(winningCells) : null;

    return {
      board: this.board.map(row => [...row]),
      currentPlayer: this.currentPlayer,
      result,
      winner,
      winningCells,
      moveHistory: [...this.moveHistory]
    };
  }

  private getGameResult(): GameResult {
    if (this.hasWinner()) {
      return 'win';
    }
    if (this.isBoardFull()) {
      return 'draw';
    }
    return 'playing';
  }

  private hasWinner(): boolean {
    return this.getWinningCells().length > 0;
  }

  private getWinningCells(): Position[] {
    const winPatterns = [
      [[0,0], [0,1], [0,2]], [[1,0], [1,1], [1,2]], [[2,0], [2,1], [2,2]],
      [[0,0], [1,0], [2,0]], [[0,1], [1,1], [2,1]], [[0,2], [1,2], [2,2]],
      [[0,0], [1,1], [2,2]], [[0,2], [1,1], [2,0]]
    ];

    for (const pattern of winPatterns) {
      const cells = pattern.map(([row, col]) => ({ row, col, value: this.board[row][col] }));
      const firstValue = cells[0].value;
      
      if (firstValue !== '' && cells.every(cell => cell.value === firstValue)) {
        return cells.map(({ row, col }) => ({ row, col }));
      }
    }

    return [];
  }

  private getWinnerFromCells(winningCells: Position[]): CellValue | null {
    if (winningCells.length === 0) return null;
    const { row, col } = winningCells[0];
    return this.board[row][col];
  }

  private isBoardFull(): boolean {
    return this.board.every(row => row.every(cell => cell !== ''));
  }

  isGameOver(): boolean {
    return this.hasWinner() || this.isBoardFull();
  }

  getAvailableMoves(): Position[] {
    const moves: Position[] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.board[row][col] === '') {
          moves.push({ row, col });
        }
      }
    }
    return moves;
  }

  reset(): void {
    this.board = this.createEmptyBoard();
    this.currentPlayer = 'X';
    this.moveHistory = [];
  }

  clone(): TicTacToeEngine {
    const clone = new TicTacToeEngine();
    clone.board = this.board.map(row => [...row]);
    clone.currentPlayer = this.currentPlayer;
    clone.moveHistory = [...this.moveHistory];
    return clone;
  }

  getBestMove(): Position | null {
    if (this.isGameOver()) return null;
    
    const availableMoves = this.getAvailableMoves();
    if (availableMoves.length === 0) return null;

    return this.minimax('O', -Infinity, Infinity).position;
  }

  private minimax(
    player: CellValue, 
    alpha: number, 
    beta: number
  ): { score: number; position: Position | null } {
    const gameState = this.getGameState();
    
    if (gameState.result === 'win') {
      return { 
        score: gameState.winner === 'O' ? 10 : -10, 
        position: null 
      };
    }
    if (gameState.result === 'draw') {
      return { score: 0, position: null };
    }

    const availableMoves = this.getAvailableMoves();
    let bestMove: Position | null = null;
    let bestScore = player === 'O' ? -Infinity : Infinity;

    for (const move of availableMoves) {
      const tempEngine = this.clone();
      tempEngine.makeMove(move.row, move.col);
      
      const result = tempEngine.minimax(
        player === 'O' ? 'X' : 'O', 
        alpha, 
        beta
      );

      if (player === 'O') {
        if (result.score > bestScore) {
          bestScore = result.score;
          bestMove = move;
        }
        alpha = Math.max(alpha, bestScore);
      } else {
        if (result.score < bestScore) {
          bestScore = result.score;
          bestMove = move;
        }
        beta = Math.min(beta, bestScore);
      }

      if (beta <= alpha) {
        break;
      }
    }

    return { score: bestScore, position: bestMove };
  }
}