import { useReducer, type ReactNode } from 'react';
import { gameReducerFunction, type State, type Action } from './reducers/gameReducer/gameReducer';
import { WonCellsColorTypes } from './types/types';
import { StateCtx, DispatchCtx } from './reducers/gameReducer/gameReducerContext';


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