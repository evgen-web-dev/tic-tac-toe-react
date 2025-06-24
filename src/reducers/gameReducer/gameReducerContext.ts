import  { createContext, type Dispatch, useContext } from "react";
import type { State, Action } from "./gameReducer";


export const StateCtx = createContext<State | undefined>(undefined)
export const DispatchCtx = createContext<Dispatch<Action> | undefined>(undefined);


export function useGameState() {
  const ctx = useContext(StateCtx)
  if (!ctx) throw new Error('useGameState must be inside <GameProvider>');
  return ctx
}

export function useGameDispatch() {
  const ctx = useContext(DispatchCtx)
  if (!ctx) throw new Error('useGameDispatch must be inside <GameProvider>');
  return ctx
}