import { create } from 'zustand'
import { PASSING_SCORE } from '@/lib/levels'

type LevelState = {
  currentLevel: number
  bestScores: Record<number, number>
  setCurrentLevel: (level: number) => void
  recordScore: (levelId: number, score: number) => void
}

export const useLevel = create<LevelState>((set, get) => ({
  currentLevel: 1,
  bestScores: typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('levelBestScores') || '{}')
    : {},
  setCurrentLevel: (level) => set({ currentLevel: level }),
  recordScore: (levelId, score) => {
    const { bestScores } = get()
    const updated = { ...bestScores, [levelId]: Math.max(bestScores[levelId] ?? 0, score) }
    localStorage.setItem('levelBestScores', JSON.stringify(updated))
    set({ bestScores: updated })
  },
}))

export function isLevelUnlocked(levelId: number, bestScores: Record<number, number>): boolean {
  if (levelId === 1) return true
  return (bestScores[levelId - 1] ?? 0) >= PASSING_SCORE
}
