import { create } from 'zustand'

type GameState = {
  gameState: 'chooseCharacters' | 'game'
  setGameState: (newGameState: 'chooseCharacters' | 'game') => void
}

export const useGame = create<GameState>((set) => ({
  gameState: 'chooseCharacters',
  setGameState: (newGameState) => set({ gameState: newGameState }),
}))
