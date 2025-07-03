import { useReducer, type ReactNode } from "react";
import {
  gameReducerFunction,
  type State,
  type Action,
} from "./reducers/gameReducer/gameReducer";
import { WonCellsColorTypes } from "./types/types";
import {
  StateCtx,
  DispatchCtx,
} from "./reducers/gameReducer/gameReducerContext";
import { TicTacToeEngine } from "./game/TicTacToeEngine";

export function GameProvider({ children }: { children: ReactNode }) {
  const initialPlayers = [
    { name: "User", moveValue: "X" as const, isAutomated: false, score: 0 },
    { name: "Computer", moveValue: "O" as const, isAutomated: true, score: 0 },
  ];

  const gameEngine = new TicTacToeEngine();

  const [state, dispatch] = useReducer<State, [Action]>(gameReducerFunction, {
    gameField: {
      cells: [
        [{ value: "" }, { value: "" }, { value: "" }],
        [{ value: "" }, { value: "" }, { value: "" }],
        [{ value: "" }, { value: "" }, { value: "" }],
      ],
      isFreezed: false,
    },
    gameStatus: "playing",
    winner: null,
    winningCells: [],
    players: initialPlayers,
    currentPlayer: initialPlayers[0],
    wonCellsColor: WonCellsColorTypes.LostColor,
    gameEngine,
  });

  return (
    <StateCtx.Provider value={state}>
      <DispatchCtx.Provider value={dispatch}>{children}</DispatchCtx.Provider>
    </StateCtx.Provider>
  );
}
