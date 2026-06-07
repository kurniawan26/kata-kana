import { create } from 'zustand'

export type Difficulty = 'easy' | 'medium' | 'hard'

type GameContainerState = {
  stage: number;
  setStage: (newStage: number) => void;
  isLocked: boolean;
  setIsLocked: (newIsLocked: boolean) => void;
  decidedGroups: string[];
  setDecidedGroups: (newDecidedGroups: string[]) => void;
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
}

export const useGameContainer = create<GameContainerState>((set) => ({
  stage: 1,
  setStage: (newStage: number) => set({ stage: newStage }),
  isLocked: false,
  decidedGroups: typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('decidedGroups') || 'null') || []
    : [],
  setDecidedGroups: (newDecidedGroups: string[]) => {
    localStorage.setItem('decidedGroups', JSON.stringify(newDecidedGroups));
    set({ decidedGroups: newDecidedGroups });
  },
  setIsLocked: (newIsLocked: boolean) => set({ isLocked: newIsLocked }),
  difficulty: 'easy',
  setDifficulty: (difficulty: Difficulty) => set({ difficulty }),
}))
