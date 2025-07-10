import { type Player, type GameField, type GameFinishedBy, type DifficultyLevel } from "../../types/types";
import { hasNumericValue } from "../../utils/utils";

export type GameEngineProps = {
    gameField: GameField;
    players: Player[];
    difficultyLevel: DifficultyLevel
}

export class TicTacToeEngine {

    private game: GameEngineProps;

    static userPlayerDefaultName = 'User';

    constructor(gameProps?: GameEngineProps) {
        this.game = {
            gameField: {
                board: gameProps?.gameField?.board || this.createEmptyBoard(),
                isFreezed: gameProps?.gameField?.isFreezed || false
            },
            players: gameProps?.players || [
                { id: 'real-user', name: TicTacToeEngine.userPlayerDefaultName, moveValue: 'x', isAutomated: false, score: 0, isActive: true },
                { id: 'bot-user', name: 'Computer', moveValue: 'o', isAutomated: true, score: 0, isActive: false },
            ],
            difficultyLevel: gameProps?.difficultyLevel || "simple"
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


    getCurrentPlayer() {
        return this.game.players.find(player => player.isActive);
    }


    getDiffucultyLevel(): DifficultyLevel {
        return this.game.difficultyLevel;
    }


    setDiffucultyLevel(newLevel: DifficultyLevel) {
        this.game.difficultyLevel = newLevel;
    }


    setUserName(userId: string, name: string) {
        this.game.players = this.game.players.map(player => (player.id === userId ? { ...player, name: name } : player));
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
        this.game.players = this.game.players.map(player => ({...player, isActive: player.isAutomated === false}));
    }


    createEmptyBoard(): GameField['board'] {
        return Array(3).fill(null).map(() => Array(3).fill({ value: '' })) as GameField['board'];
    }


    makeMove(coordinates: [number, number]): boolean {
        const [row, cell] = coordinates;
        if (hasNumericValue(row, cell) && this.game.gameField.board[row!][cell!].value === '') {
            this.game.gameField.board[row!][cell!].value = this.getCurrentPlayer()!.moveValue;
            return true;
        }
        return false;
    }


    getNextMoveCoordinates(): [number, number] {
        // needs refactoring - for more complicated logic
        for (let i = 0; i < this.game.gameField.board.length; i++) {
            for (let j = 0; j < this.game.gameField.board.length; j++) {
                if (this.game.gameField.board[i][j].value === '') {
                    return [i, j];
                }
            }
        }

        return [0, 0];
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

        return gameFinishedBy;
    }


    freezeGameField(isFreezed: boolean) {
        this.game.gameField.isFreezed = isFreezed;
    }


    switchToNextPlayer() {
        const prevPlayerIndex = this.game.players.findIndex((curPlayer: Player) => curPlayer.isActive);
        const nextPlayerIndex = prevPlayerIndex === (this.game.players.length - 1) ? 0 : prevPlayerIndex + 1;
        this.game.players = this.game.players.map((player: Player, index: number) => ({...player, isActive: index === nextPlayerIndex}));
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


    incrementCurrentPlayerScore() {
        this.game.players = this.game.players.map((player) => player.isActive ? { ...player, score: player.score + 1 } : player);
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


    static getActivePlayer(players: Player[]): Player {
        return players.find(player => player.isActive)!;
    }


    static getUserPlayer(players: Player[]): Player  {
        return players.find(player => player.isAutomated === false)!;
    }

}