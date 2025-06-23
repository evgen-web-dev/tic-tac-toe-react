import { createContext, useReducer, useContext, type ReactNode, type Dispatch } from 'react';
import { gameReducerFunction, type State, type Action } from './reducers/gameReducer';
import { WonCellsColorTypes } from './types/types';


const StateCtx = createContext<State | undefined>(undefined)
const DispatchCtx = createContext<Dispatch<Action> | undefined>(undefined);


export function GameProvider({ children }: { children: ReactNode }) {
    
  const initialPlayers = [
    { name: 'User', moveValue: 'x', isAutomated: false, score: 0 },
    { name: 'Computer', moveValue: 'o', isAutomated: true, score: 0 },
  ];

  const [state, dispatch] = useReducer<State, [Action]>(gameReducerFunction, {
      gameField: {
          cells: [
          [ {value: ''}, {value: ''}, {value: ''} ],
          [ {value: ''}, {value: ''}, {value: ''} ],
          [ {value: ''}, {value: ''}, {value: ''} ],
          ],
          isFreezed: false
      },
      isGameFinishedBy: null,
      players: initialPlayers,
      currentPlayer: initialPlayers[0],
      wonCellsColor: WonCellsColorTypes.LostColor
  });

  
  return (
    <StateCtx.Provider value={state}>
      <DispatchCtx.Provider value={dispatch}>
        {children}
      </DispatchCtx.Provider>
    </StateCtx.Provider>
  )
}

export function useGameState() {
  const ctx = useContext(StateCtx)
  if (!ctx) throw new Error('useGameState must be inside <GameProvider>')
  return ctx
}

export function useGameDispatch() {
  const ctx = useContext(DispatchCtx)
  if (!ctx) throw new Error('useGameDispatch must be inside <GameProvider>')
  return ctx
}
