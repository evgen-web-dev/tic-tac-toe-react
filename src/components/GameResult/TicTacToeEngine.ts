import { type Player, type GameField, type GameFinishedBy, type DifficultyLevel, type FieldCell } from "../../types/types";
import { hasNumericValue, shuffleArray } from "../../utils/utils";

export type GameEngineProps = {
    gameField: GameField;
    players: Player[];
    difficultyLevel: DifficultyLevel
}

type GameSettings = {
    level: DifficultyLevel;
    userName: string;
}

export class TicTacToeEngine {

    private game: GameEngineProps;

    static userPlayerDefaultName = 'User';

    private static BOARD_LOCAL_STORAGE_KEY = 'board' as const;
    private static SETTINGS_LOCAL_STORAGE_KEY = 'settings' as const;
    private static SCORE_LOCAL_STORAGE_KEY = 'score' as const;
    private static LINES = [
        // rows
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        // cols
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        // diags
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]],
    ] as Readonly<[number, number][][]>;
    private static SIDES = [[0, 1], [1, 0], [1, 2], [2, 1]] as Readonly<[number, number][]>
    private static CORNERS = [[0, 0], [0, 2], [2, 0], [2, 2]] as Readonly<[number, number][]>;


    constructor(gameProps?: GameEngineProps) {
        const savedSettings = this.getSavedSettingsFromLocalStorage();

        const defaultPlayers = [
            { id: 'real-user', name: savedSettings?.userName || TicTacToeEngine.userPlayerDefaultName, moveValue: 'x', isAutomated: false, score: 0, isActive: true },
            { id: 'bot-user', name: 'Computer', moveValue: 'o', isAutomated: true, score: 0, isActive: false },
        ];

        const savedGameScore = this.getSavedScoreFromLocalStorage();

        this.game = {
            gameField: {
                board: gameProps?.gameField?.board || this.createEmptyBoard(),
                isFreezed: gameProps?.gameField?.isFreezed || false
            },
            players: gameProps?.players || defaultPlayers.map((player, index) => ({...player, score: savedGameScore[index]})),
            difficultyLevel: gameProps?.difficultyLevel || savedSettings?.level || "simple"
        }
    }


    getGame() {
        return this.game;
    }


    getGameField() {
        return this.game.gameField;
    }


    getPlayers() {
        return this.game.players;
    }


    getCurrentPlayer(): Player {
        return this.game.players.find(player => player.isActive)!;
    }


    getCurrentPlayerOpponent(): Player {
        const currentPlayer = this.getCurrentPlayer();
        return this.game.players.find(player => player.moveValue !== currentPlayer.moveValue)!;
    }


    getDiffucultyLevel(): DifficultyLevel {
        return this.game.difficultyLevel;
    }


    getSavedBoardFromLocalStorage(): GameField['board'] | null {
        return JSON.parse(localStorage.getItem(TicTacToeEngine.BOARD_LOCAL_STORAGE_KEY) || 'null');
    }


    getSavedSettingsFromLocalStorage(): GameSettings | null {
        return JSON.parse(localStorage.getItem(TicTacToeEngine.SETTINGS_LOCAL_STORAGE_KEY) || 'null');
    }


    getSavedScoreFromLocalStorage(): number[] {
        return JSON.parse(localStorage.getItem(TicTacToeEngine.SCORE_LOCAL_STORAGE_KEY) || '[0,0]');
    }


    private saveBoardToLocalStorage(boardToSave: GameField['board'] | null): void {
        localStorage.setItem(TicTacToeEngine.BOARD_LOCAL_STORAGE_KEY, JSON.stringify(boardToSave ? boardToSave : null));
    }


    private saveSettingsToLocalStorage(): void {
        const settings: GameSettings = {
            level: this.getDiffucultyLevel(),
            userName: TicTacToeEngine.getUserPlayer(this.getPlayers()).name
        };
        localStorage.setItem(TicTacToeEngine.SETTINGS_LOCAL_STORAGE_KEY, JSON.stringify(settings));
    }


    private saveScoreToLocalStorage(): void {
        localStorage.setItem(TicTacToeEngine.SCORE_LOCAL_STORAGE_KEY, JSON.stringify(this.game.players.map(player => player.score)));
    }


    setGameFieldBoard(board: GameField['board']) {
        this.game.gameField.board = board;
    }


    setDiffucultyLevel(newLevel: DifficultyLevel) {
        this.game.difficultyLevel = newLevel;
        this.saveSettingsToLocalStorage();
    }


    setUserName(userId: string, name: string) {
        this.game.players = this.game.players.map(player => (player.id === userId ? { ...player, name: name } : player));
        this.saveSettingsToLocalStorage();
    }


    clone(): TicTacToeEngine {
        const clone = new TicTacToeEngine();

        clone.game.gameField = {
            ...this.game.gameField,
            board: this.game.gameField.board.map(row => {
                return [...row].map(rowCell => ({ ...rowCell }))
            }) as GameField['board'],
        }
        clone.game.players = this.game.players.map(player => ({ ...player }));
        clone.game.difficultyLevel = this.game.difficultyLevel;

        return clone;
    }


    resetGame() {
        this.game.gameField = {
            board: this.createEmptyBoard(),
            isFreezed: false,
        }
        this.game.players = this.game.players.map(player => ({ ...player, isActive: player.isAutomated === false }));
        this.saveBoardToLocalStorage(null);
    }


    resetSavedGameBoard() {
        this.saveBoardToLocalStorage(null);
    }


    createEmptyBoard(): GameField['board'] {
        return Array(3).fill(null).map(() => Array(3).fill({ value: '' })) as GameField['board'];
    }


    makeMove(coordinates?: [number, number]): boolean {
        const checkedCoordinates = coordinates || this.getNextMoveCoordinates();

        if (checkedCoordinates) {
            const [row, cell] = checkedCoordinates;
            if (hasNumericValue(row, cell) && this.game.gameField.board[row!][cell!].value === '') {
                this.game.gameField.board[row!][cell!].value = this.getCurrentPlayer()!.moveValue;
                return true;
            }
        }

        return false;
    }


    private findWinningMove(moveValue: string): [number, number] | null {
        let lineCellsData: Array<{ coords: [number, number], cell: FieldCell }>;

        let filledCellsCount = 0;
        let lastEmptyCellCoordinates: [number, number] | null = null;

        for (const line of TicTacToeEngine.LINES) {
            lineCellsData = line.map(([row_i, col_i]) => ({ coords: [row_i, col_i], cell: this.game.gameField.board[row_i][col_i] }));

            filledCellsCount = 0;
            lastEmptyCellCoordinates = null;

            for (const cellData of lineCellsData) {
                if (cellData.cell.value === '') {
                    lastEmptyCellCoordinates = cellData.coords;
                }
                else if (cellData.cell.value === moveValue) {
                    filledCellsCount++;
                }

                if (filledCellsCount === 2 && lastEmptyCellCoordinates) {
                    return lastEmptyCellCoordinates;
                }
            }
        }

        return null;
    }


    getNextMoveCoordinates(): [number, number] | null {
        if (this.getDiffucultyLevel() === 'hard') {
            // win if posible
            let move = this.findWinningMove(this.getCurrentPlayer()!.moveValue);
            if (move) return move;

            // block opponent's win if possible
            move = this.findWinningMove(this.getCurrentPlayerOpponent().moveValue);
            if (move) return move;

            // take center cell if possible
            if (!this.game.gameField.board[1][1].value) {
                return [1, 1]
            }

            // take empty corner if possible
            for (const [row_i, col_i] of shuffleArray([...TicTacToeEngine.CORNERS])) {
                if (!this.game.gameField.board[row_i][col_i].value) {
                    return [row_i, col_i];
                }
            }

            // take empty side if possible
            for (const [row_i, col_i] of shuffleArray([...TicTacToeEngine.SIDES])) {
                if (!this.game.gameField.board[row_i][col_i].value) {
                    return [row_i, col_i];
                }
            }
        }

        else {
            let row_i: number;
            let col_i: number;

            do {
                row_i = Math.floor(Math.random() * 3);
                col_i = Math.floor(Math.random() * 3);
            } while (this.game.gameField.board[row_i][col_i].value)

            return [row_i, col_i];
        }

        return null;
    }


    checkIfWin(): GameFinishedBy {
        let gameFinishedBy: GameFinishedBy = null;

        const currentPlayer = this.getCurrentPlayer()!;

        for (let i = 0; i < 3; i++) {
            if (this.game.gameField.board[i][0].value === currentPlayer.moveValue
                && this.game.gameField.board[i][1].value === currentPlayer.moveValue
                && this.game.gameField.board[i][2].value === currentPlayer.moveValue
            ) {
                gameFinishedBy = { type: 'row-won', rowIndex: i };
                break;
            }
        }


        for (let j = 0; j < 3; j++) {
            if (this.game.gameField.board[0][j].value === currentPlayer.moveValue
                && this.game.gameField.board[1][j].value === currentPlayer.moveValue
                && this.game.gameField.board[2][j].value === currentPlayer.moveValue
            ) {
                gameFinishedBy = { type: 'col-won', colIndex: j };
                break;
            }
        }

        if (this.game.gameField.board[0][0].value === currentPlayer.moveValue
            && this.game.gameField.board[1][1].value === currentPlayer.moveValue
            && this.game.gameField.board[2][2].value === currentPlayer.moveValue
        ) {
            gameFinishedBy = { type: 'diagonal-won', diagonalType: 'left' };
        }
        if (this.game.gameField.board[0][2].value === currentPlayer.moveValue
            && this.game.gameField.board[1][1].value === currentPlayer.moveValue
            && this.game.gameField.board[2][0].value === currentPlayer.moveValue
        ) {
            gameFinishedBy = { type: 'diagonal-won', diagonalType: 'right' };
        }

        if (gameFinishedBy === null && this.isGameFieldFilled()) {
            gameFinishedBy = { type: 'draw-game' };
        }

        // if gameFinishedBy === null (so current game-round is finished) - resetting saved board in local storage
        this.saveBoardToLocalStorage(gameFinishedBy === null ? this.getGameField().board : null);

        return gameFinishedBy;
    }


    freezeGameField(isFreezed: boolean) {
        this.game.gameField.isFreezed = isFreezed;
    }


    switchToNextPlayer() {
        const prevPlayerIndex = this.game.players.findIndex((curPlayer: Player) => curPlayer.isActive);
        const nextPlayerIndex = prevPlayerIndex === (this.game.players.length - 1) ? 0 : prevPlayerIndex + 1;
        this.game.players = this.game.players.map((player: Player, index: number) => ({ ...player, isActive: index === nextPlayerIndex }));
    }


    isGameFieldFilled() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.game.gameField.board[i][j].value === '') {
                    return false;
                }
            }
        }

        return true;
    }


    isGameFieldEmpty() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.game.gameField.board[i][j].value !== '') {
                    return false;
                }
            }
        }

        return true;
    }


    incrementCurrentPlayerScore() {
        this.game.players = this.game.players.map((player) => player.isActive ? { ...player, score: player.score + 1 } : player);
        this.saveScoreToLocalStorage();
    }


    highlightFromGameResult(gameResult: GameFinishedBy): void {
        if (gameResult) {
            const coordinatesToHightlight: Array<[number, number]> = [];

            switch (gameResult.type) {

                case 'diagonal-won': {
                    coordinatesToHightlight.push([1, 1]); // will always need to hightlight center cell if game is won by diagonal

                    switch (gameResult.diagonalType) {
                        case 'left': coordinatesToHightlight.push([0, 0], [2, 2]); break;
                        case 'right': coordinatesToHightlight.push([0, 2], [2, 0]); break;
                    }
                    break;
                }

                case 'col-won': {
                    for (let i = 0; i < 3; i++) { coordinatesToHightlight.push([i, gameResult.colIndex]); }
                    break;
                }

                case 'row-won': {
                    for (let j = 0; j < 3; j++) { coordinatesToHightlight.push([gameResult.rowIndex, j]); }
                    break;
                }

                case 'draw-game': {
                    break;
                }

            }

            for (const curCoordinatesPair of coordinatesToHightlight) {
                const [i, j] = curCoordinatesPair;
                this.game.gameField.board[i][j].isHightlighted = true;
            }
        }

    }


    resetGameScore(): void {
        this.game.players.forEach((player) => player.score = 0);
        this.saveScoreToLocalStorage();
    }


    static getActivePlayer(players: Player[]): Player {
        return players.find(player => player.isActive)!;
    }


    static getUserPlayer(players: Player[]): Player {
        return players.find(player => player.isAutomated === false)!;
    }

}