import { type Player, type GameField, type GameFinishedBy } from "../../types/types";
import { hasNumericValue } from "../../utils/utils";

export type GameEngineProps = {
    gameField: GameField;
    currentPlayer: Player;
    players: Player[];
}

export class TicTacToeEngine {

    private game: GameEngineProps;

    constructor(gameProps?: GameEngineProps) {
        const initialPlayers = [
            { name: 'User', moveValue: 'x', isAutomated: false, score: 0 },
            { name: 'Computer', moveValue: 'o', isAutomated: true, score: 0 },
        ];

        this.game = {
            gameField: {
                board: gameProps?.gameField?.board || this.createEmptyBoard(),
                isFreezed: gameProps?.gameField?.isFreezed || false
            },
            players: gameProps?.players || initialPlayers,
            currentPlayer: gameProps?.currentPlayer || initialPlayers[0]
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
        return this.game.currentPlayer;
    }


    clone(): TicTacToeEngine {
        const clone = new TicTacToeEngine();

        clone.game.gameField = {
            ...this.game.gameField,
            board: this.game.gameField.board.map(row => {
                return [...row].map(rowCell => ({ ...rowCell }))
            }) as GameField['board'],
        }
        clone.game.currentPlayer = { ...this.game.currentPlayer };
        clone.game.players = this.game.players.map(player => ({ ...player }));

        return clone;
    }


    resetGame() {
        this.game.gameField = {
            board: this.createEmptyBoard(),
            isFreezed: false,
        }
        this.game.currentPlayer = this.game.players[0];
    }


    createEmptyBoard(): GameField['board'] {
        return Array(3).fill(null).map(() => Array(3).fill({ value: '' })) as GameField['board'];
    }


    makeMove(coordinates: [number, number]) {
        const [row, cell] = coordinates;
        if (hasNumericValue(row, cell)) {
            this.game.gameField.board[ row! ][ cell! ].value = this.game.currentPlayer.moveValue;
        }
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

        for (let i = 0; i < 3; i++) {
            if (this.game.gameField.board[i][0].value === this.game.currentPlayer.moveValue
                && this.game.gameField.board[i][1].value === this.game.currentPlayer.moveValue
                && this.game.gameField.board[i][2].value === this.game.currentPlayer.moveValue
            ) {
                gameFinishedBy = { type: 'row-won', rowIndex: i };
                break;
            }
        }


        for (let j = 0; j < 3; j++) {
            if (this.game.gameField.board[0][j].value === this.game.currentPlayer.moveValue
                && this.game.gameField.board[1][j].value === this.game.currentPlayer.moveValue
                && this.game.gameField.board[2][j].value === this.game.currentPlayer.moveValue
            ) {
                gameFinishedBy = { type: 'col-won', colIndex: j };
                break;
            }
        }

        if (this.game.gameField.board[0][0].value === this.game.currentPlayer.moveValue
            && this.game.gameField.board[1][1].value === this.game.currentPlayer.moveValue
            && this.game.gameField.board[2][2].value === this.game.currentPlayer.moveValue
        ) {
            gameFinishedBy = { type: 'diagonal-won', diagonalType: 'left' };
        }
        if (this.game.gameField.board[0][2].value === this.game.currentPlayer.moveValue
            && this.game.gameField.board[1][1].value === this.game.currentPlayer.moveValue
            && this.game.gameField.board[2][0].value === this.game.currentPlayer.moveValue
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
        const prevPlayerIndex = this.game.players.findIndex((curPlayer: Player) => curPlayer.name === this.game.currentPlayer.name);
        this.game.currentPlayer = this.game.players[prevPlayerIndex === (this.game.players.length - 1) ? 0 : prevPlayerIndex + 1];
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
        this.game.players = this.game.players.map((player) => player.name === this.game.currentPlayer.name ? {...player, score: player.score + 1} : player);
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

}