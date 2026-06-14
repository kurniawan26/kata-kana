'use client'
import { kanaDictionary } from '@/lib/kanaDictionary'
import { useGameContainer } from '@/state/GameContainer'
import { useGame } from '@/state/Game'
import { shuffle } from '@/lib/helperFunc'
import { cn } from '@/lib/utils'
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const QUIZ_CONFIG = {
  easy:   { charsPerStep: 3, totalSteps: 5  },
  medium: { charsPerStep: 6, totalSteps: 7  },
  hard:   { charsPerStep: 9, totalSteps: 10 },
}

type QuizItem = { char: string; romajis: string[] }
type StepResult = { items: QuizItem[]; answers: string[]; correct: boolean[] }

function buildPool(decidedGroups: string[]): QuizItem[] {
  const pool: QuizItem[] = []
  for (const groupName of decidedGroups) {
    const kanaType = groupName.startsWith('h_') ? 'hiragana' : 'katakana'
    const kanaData = kanaDictionary[kanaType] as Record<string, { characters: Record<string, string[]> }>
    const groupData = kanaData[groupName]
    if (!groupData) continue
    Object.entries(groupData.characters).forEach(([char, romajis]) => {
      pool.push({ char, romajis: romajis as string[] })
    })
  }
  return pool
}

function pickItems(pool: QuizItem[], count: number): QuizItem[] {
  return shuffle([...pool]).slice(0, Math.min(count, pool.length))
}

function StepDots({ total, current, results }: { total: number; current: number; results: StepResult[] }) {
  return (
    <div className="flex gap-1.5 flex-wrap justify-center">
      {Array.from({ length: total }, (_, i) => {
        const stepResult = results[i]
        const isCurrent = i + 1 === current
        const isDone = i < results.length

        let bg = 'bg-muted'
        if (isCurrent) bg = 'bg-primary'
        else if (isDone) {
          const ratio = stepResult.correct.filter(Boolean).length / stepResult.items.length
          bg = ratio >= 0.7 ? 'bg-green-400' : 'bg-red-400'
        }

        return (
          <div
            key={i}
            className={cn('rounded-full transition-all', bg, isCurrent ? 'w-4 h-4' : 'w-2.5 h-2.5')}
          />
        )
      })}
    </div>
  )
}

function Game() {
  const { decidedGroups, difficulty } = useGameContainer()
  const { setGameState } = useGame()

  const config = QUIZ_CONFIG[difficulty] ?? QUIZ_CONFIG.easy

  const pool = useMemo(() => buildPool(decidedGroups), [decidedGroups])

  const [step, setStep] = useState(1)
  const [stepItems, setStepItems] = useState<QuizItem[]>(() => pickItems(pool, config.charsPerStep))
  const [userAnswers, setUserAnswers] = useState<string[]>(() => Array(config.charsPerStep).fill(''))
  const [stepSubmitted, setStepSubmitted] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<StepResult[]>([])
  const [sessionDone, setSessionDone] = useState(false)

  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!stepSubmitted) firstInputRef.current?.focus()
  }, [step, stepSubmitted])

  if (pool.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">No characters found in selected groups.</p>
        <Button onClick={() => setGameState('chooseCharacters')}>Go Back</Button>
      </div>
    )
  }

  const stepResults = stepItems.map((item, i) => {
    const answer = (userAnswers[i] ?? '').trim().toLowerCase()
    return item.romajis.map(r => r.toLowerCase()).includes(answer)
  })

  const stepCorrectCount = stepResults.filter(Boolean).length
  const allFilled = userAnswers.every(a => a.trim().length > 0)

  const handleSubmit = () => {
    const result: StepResult = {
      items: stepItems,
      answers: [...userAnswers],
      correct: stepResults,
    }
    setCompletedSteps(prev => [...prev, result])
    setStepSubmitted(true)
  }

  const handleNext = () => {
    if (step >= config.totalSteps) {
      setSessionDone(true)
      return
    }
    setStep(s => s + 1)
    setStepItems(pickItems(pool, config.charsPerStep))
    setUserAnswers(Array(config.charsPerStep).fill(''))
    setStepSubmitted(false)
  }

  const handleRestart = () => {
    setStep(1)
    setStepItems(pickItems(pool, config.charsPerStep))
    setUserAnswers(Array(config.charsPerStep).fill(''))
    setStepSubmitted(false)
    setCompletedSteps([])
    setSessionDone(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter' && !stepSubmitted) {
      if (index < stepItems.length - 1) {
        const next = document.getElementById(`quiz-input-${index + 1}`) as HTMLInputElement
        next?.focus()
      } else if (allFilled) {
        handleSubmit()
      }
    }
  }

  // — Final results screen —
  if (sessionDone) {
    const totalCorrect = completedSteps.reduce((sum, s) => sum + s.correct.filter(Boolean).length, 0)
    const totalAnswers = completedSteps.reduce((sum, s) => sum + s.items.length, 0)
    const pct = Math.round((totalCorrect / totalAnswers) * 100)

    return (
      <div className="max-w-lg mx-auto p-4 md:p-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Quiz Complete!</h2>
          <p className="text-5xl font-bold">{pct}<span className="text-xl text-muted-foreground">%</span></p>
          <p className="text-muted-foreground">{totalCorrect} / {totalAnswers} correct across {config.totalSteps} steps</p>
        </div>

        <div className="space-y-2">
          {completedSteps.map((s, si) => {
            const correct = s.correct.filter(Boolean).length
            const ratio = correct / s.items.length
            return (
              <div key={si} className={cn(
                'flex items-center gap-3 p-3 rounded-lg border',
                ratio >= 0.7 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              )}>
                <span className="text-sm font-medium w-16 shrink-0 text-muted-foreground">Step {si + 1}</span>
                <div className="flex gap-1.5 flex-wrap flex-1">
                  {s.items.map((item, ii) => (
                    <span
                      key={ii}
                      className={cn(
                        'text-base px-1 rounded',
                        s.correct[ii] ? 'text-green-700' : 'text-red-600'
                      )}
                      title={s.correct[ii] ? s.answers[ii] : `${s.answers[ii]} → ${item.romajis[0]}`}
                    >
                      {item.char}
                    </span>
                  ))}
                </div>
                <span className={cn('text-sm font-semibold shrink-0', ratio >= 0.7 ? 'text-green-600' : 'text-red-600')}>
                  {correct}/{s.items.length}
                </span>
              </div>
            )
          })}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => setGameState('chooseCharacters')}>
            Change Settings
          </Button>
          <Button className="flex-1" onClick={handleRestart}>
            Play Again
          </Button>
        </div>
      </div>
    )
  }

  // — Step screen —
  const totalCorrectSoFar = completedSteps.reduce((sum, s) => sum + s.correct.filter(Boolean).length, 0)
  const totalAnsweredSoFar = completedSteps.reduce((sum, s) => sum + s.items.length, 0)

  return (
    <div className="max-w-lg mx-auto p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium capitalize">{difficulty}</span>
          <span className="text-muted-foreground">
            {totalAnsweredSoFar > 0 && `${totalCorrectSoFar}/${totalAnsweredSoFar} correct so far`}
          </span>
        </div>
        <StepDots total={config.totalSteps} current={step} results={completedSteps} />
        <p className="text-center text-xs text-muted-foreground">Step {step} of {config.totalSteps}</p>
      </div>

      {/* Character grid */}
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {stepItems.map((item, i) => {
          const isCorrect = stepSubmitted ? stepResults[i] : null
          return (
            <div
              key={i}
              className={cn(
                'flex flex-col items-center gap-1.5 p-2 md:p-4 rounded-xl border transition-colors',
                isCorrect === true  && 'border-green-400 bg-green-50',
                isCorrect === false && 'border-red-400 bg-red-50',
                isCorrect === null  && 'border-border bg-card'
              )}
            >
              <span className="text-4xl md:text-5xl leading-none select-none">{item.char}</span>
              <Input
                id={`quiz-input-${i}`}
                ref={i === 0 ? firstInputRef : undefined}
                value={userAnswers[i] ?? ''}
                onChange={e => {
                  const next = [...userAnswers]
                  next[i] = e.target.value
                  setUserAnswers(next)
                }}
                onKeyDown={e => handleKeyDown(e, i)}
                disabled={stepSubmitted}
                placeholder="romaji"
                className={cn(
                  'text-center text-sm',
                  isCorrect === true  && 'border-green-400',
                  isCorrect === false && 'border-red-400'
                )}
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
              />
              {isCorrect === false && (
                <p className="text-[11px] text-red-600 text-center">
                  {item.romajis.join(' / ')}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Actions */}
      {!stepSubmitted ? (
        <Button className="w-full" disabled={!allFilled} onClick={handleSubmit}>
          Submit
        </Button>
      ) : (
        <div className="space-y-2">
          <p className={cn(
            'text-center text-sm font-medium',
            stepCorrectCount === stepItems.length ? 'text-green-600' : stepCorrectCount >= Math.ceil(stepItems.length * 0.7) ? 'text-green-600' : 'text-red-500'
          )}>
            {stepCorrectCount} / {stepItems.length} correct
          </p>
          <Button className="w-full" onClick={handleNext}>
            {step >= config.totalSteps ? 'See Results' : `Next Step →`}
          </Button>
        </div>
      )}

      <button
        onClick={() => setGameState('chooseCharacters')}
        className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back to character selection
      </button>
    </div>
  )
}

export default Game
