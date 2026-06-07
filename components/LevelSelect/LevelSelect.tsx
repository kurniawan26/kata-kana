'use client'
import React, { useState } from 'react'
import { LEVELS, getStars } from '@/lib/levels'
import { useLevel, isLevelUnlocked } from '@/state/Level'
import { useGameContainer, Difficulty } from '@/state/GameContainer'
import { useGame } from '@/state/Game'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; count: number }[] = [
  { value: 'easy',   label: 'Easy',   count: 3 },
  { value: 'medium', label: 'Medium', count: 6 },
  { value: 'hard',   label: 'Hard',   count: 9 },
]

function StarRow({ score }: { score: number }) {
  const stars = getStars(score)
  return (
    <div className="flex justify-center gap-0.5 mt-1">
      {[1, 2, 3].map(i => (
        <span key={i} className={cn('text-xs', i <= stars ? 'text-yellow-400' : 'text-muted-foreground/25')}>
          ★
        </span>
      ))}
    </div>
  )
}

function LevelSelect() {
  const { bestScores, setCurrentLevel } = useLevel()
  const { difficulty, setDifficulty, setDecidedGroups } = useGameContainer()
  const { setGameState } = useGame()
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const selectedLevel = LEVELS.find(l => l.id === selectedId)

  const handleStart = () => {
    if (!selectedLevel) return
    setCurrentLevel(selectedLevel.id)
    setDecidedGroups(selectedLevel.groups)
    setGameState('game')
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold">Select Level</h2>
        <p className="text-sm text-muted-foreground">Score ≥ 70% to unlock the next level</p>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {LEVELS.map(level => {
          const unlocked = isLevelUnlocked(level.id, bestScores)
          const score = bestScores[level.id] ?? 0
          const played = score > 0
          const isSelected = selectedId === level.id

          return (
            <button
              key={level.id}
              onClick={() => unlocked && setSelectedId(level.id)}
              disabled={!unlocked}
              className={cn(
                'flex flex-col items-center p-2.5 rounded-xl border transition-all text-center',
                isSelected  && 'border-primary bg-primary/10 shadow-md ring-1 ring-primary',
                !isSelected && unlocked && 'border-border hover:bg-accent',
                !unlocked   && 'border-border/30 opacity-40 cursor-not-allowed',
              )}
            >
              <span className="text-[10px] text-muted-foreground font-medium">Lv.{level.id}</span>
              <span className="text-xs font-semibold mt-0.5 leading-tight">{level.name}</span>
              <span className="text-base mt-1 tracking-tight">{level.kanaPreview.slice(0, 3)}</span>
              {unlocked ? (
                played ? <StarRow score={score} /> : <span className="text-[10px] text-muted-foreground mt-1">tap</span>
              ) : (
                <span className="text-xs mt-1">🔒</span>
              )}
            </button>
          )
        })}
      </div>

      {selectedLevel && (
        <div className="border rounded-xl p-4 space-y-4 bg-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-base">
                Level {selectedLevel.id} — {selectedLevel.name}
              </p>
              <p className="text-lg tracking-widest mt-0.5">{selectedLevel.kanaPreview}</p>
            </div>
            {(bestScores[selectedLevel.id] ?? 0) > 0 && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Best</p>
                <p className="text-lg font-bold">{Math.round((bestScores[selectedLevel.id] ?? 0) * 100)}%</p>
                <StarRow score={bestScores[selectedLevel.id] ?? 0} />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium">Difficulty</p>
            <div className="flex gap-2">
              {DIFFICULTY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setDifficulty(opt.value)}
                  className={cn(
                    'flex-1 py-1.5 px-2 rounded-md border text-sm font-medium transition-colors',
                    difficulty === opt.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:bg-accent border-border'
                  )}
                >
                  {opt.label}
                  <span className={cn('block text-[10px]', difficulty === opt.value ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                    {opt.count} chars
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Button className="w-full" onClick={handleStart}>
            Start Level {selectedLevel.id}
          </Button>
        </div>
      )}
    </div>
  )
}

export default LevelSelect
