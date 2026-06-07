'use client'
import { kanaDictionary } from '@/lib/kanaDictionary'
import { useCharacters } from '@/state/ChooseCharacters'
import { useGameContainer, Difficulty } from '@/state/GameContainer'
import { useGame } from '@/state/Game'
import { cn } from '@/lib/utils'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CharacterGroup from './CharacterGroup'

type KanaType = keyof typeof kanaDictionary

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; count: number; steps: number }[] = [
  { value: 'easy',   label: 'Easy',   count: 3, steps: 5  },
  { value: 'medium', label: 'Medium', count: 6, steps: 7  },
  { value: 'hard',   label: 'Hard',   count: 9, steps: 10 },
]

function GroupSection({ kanaType, filter }: { kanaType: KanaType; filter: 'basic' | 'alt' | 'similar' }) {
  const groups = kanaDictionary[kanaType]
  const filtered = Object.keys(groups).filter(k => {
    if (filter === 'basic')   return !k.endsWith('_a') && !k.endsWith('_s')
    if (filter === 'alt')     return k.endsWith('_a')
    return k.endsWith('_s')
  })

  if (filtered.length === 0) return null

  return (
    <div className="space-y-1.5">
      {filtered.map(groupName => (
        <CharacterGroup key={groupName} groupName={groupName} kanaType={kanaType} />
      ))}
    </div>
  )
}

function ChooseCharacters() {
  const { selectedGroup, setSelectedGroup, errMsg, setErrMsg } = useCharacters()
  const { difficulty, setDifficulty, setDecidedGroups } = useGameContainer()
  const { setGameState } = useGame()

  const handleSelectAll = (kanaType: KanaType) => {
    const allGroups = Object.keys(kanaDictionary[kanaType])
    const merged = [...selectedGroup, ...allGroups]
    setSelectedGroup(merged.filter((g, i) => merged.indexOf(g) === i))
  }

  const handleSelectNone = (kanaType: KanaType) => {
    const kanaGroups = new Set(Object.keys(kanaDictionary[kanaType]))
    setSelectedGroup(selectedGroup.filter(g => !kanaGroups.has(g)))
  }

  const handleStart = () => {
    if (selectedGroup.length === 0) {
      setErrMsg('Please select at least one character group.')
      return
    }
    setErrMsg('')
    setDecidedGroups(selectedGroup)
    setGameState('game')
  }


  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold">Select Characters</h2>
        <p className="text-sm text-muted-foreground">Click a group to toggle it. Selected groups will appear highlighted.</p>
      </div>

      <Tabs defaultValue="hiragana">
        <TabsList>
          <TabsTrigger value="hiragana">Hiragana (ひらがな)</TabsTrigger>
          <TabsTrigger value="katakana">Katakana (カタカナ)</TabsTrigger>
        </TabsList>

        {(['hiragana', 'katakana'] as KanaType[]).map(kanaType => (
          <TabsContent key={kanaType} value={kanaType} className="space-y-4 mt-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleSelectAll(kanaType)}>Select All</Button>
              <Button variant="outline" size="sm" onClick={() => handleSelectNone(kanaType)}>Select None</Button>
            </div>

            <div className="space-y-5">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Basic</p>
                <GroupSection kanaType={kanaType} filter="basic" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Dakuten & Combinations</p>
                <GroupSection kanaType={kanaType} filter="alt" />
              </div>
              {kanaType === 'katakana' && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Similar Looking</p>
                  <GroupSection kanaType={kanaType} filter="similar" />
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="space-y-2">
        <p className="text-sm font-semibold">Difficulty</p>
        <div className="flex gap-2">
          {DIFFICULTY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setDifficulty(opt.value)}
              className={cn(
                'flex-1 px-3 py-2 rounded-md border text-sm font-medium transition-colors',
                difficulty === opt.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'hover:bg-accent border-border'
              )}
            >
              <div>{opt.label}</div>
              <div className={cn('text-xs', difficulty === opt.value ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                {opt.count} chars × {opt.steps} steps
              </div>
            </button>
          ))}
        </div>
      </div>

      {errMsg && <p className="text-destructive text-sm">{errMsg}</p>}

      <div className="flex items-center justify-between pt-2 border-t">
        <p className="text-sm text-muted-foreground">
          {selectedGroup.length} group{selectedGroup.length !== 1 ? 's' : ''} selected
        </p>
        <Button onClick={handleStart} disabled={selectedGroup.length === 0}>
          Start Quiz
        </Button>
      </div>
    </div>
  )
}

export default ChooseCharacters
