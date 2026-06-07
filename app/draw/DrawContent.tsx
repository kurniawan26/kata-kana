'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { kanaDictionary } from '@/lib/kanaDictionary'
import DrawCanvas, { DrawCanvasHandle } from '@/components/DrawCanvas'
import { Button } from '@/components/ui/button'
import { playKanaAudio } from '@/lib/playKanaAudio'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'

type KanaType = keyof typeof kanaDictionary
type CharEntry = { char: string; romajis: string[]; groupName: string; kanaType: KanaType }

const BRUSH_SIZES = [
  { label: 'S', value: 4 },
  { label: 'M', value: 8 },
  { label: 'L', value: 14 },
]

// Build full ordered list once at module level (hiragana then katakana)
const ALL_CHARS: CharEntry[] = (() => {
  const result: CharEntry[] = []
  for (const kanaType of ['hiragana', 'katakana'] as KanaType[]) {
    const kanaData = kanaDictionary[kanaType] as Record<string, { characters: Record<string, string[]> }>
    for (const [groupName, groupData] of Object.entries(kanaData)) {
      for (const [char, romajis] of Object.entries(groupData.characters)) {
        result.push({ char, romajis: romajis as string[], groupName, kanaType })
      }
    }
  }
  return result
})()

export default function DrawContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const charParam = searchParams.get('char') ?? ''
  const [brushSize, setBrushSize] = useState(8)
  const [showRomaji, setShowRomaji] = useState(true)
  const canvasRef = useRef<DrawCanvasHandle>(null)

  const currentIndex = useMemo(
    () => Math.max(0, ALL_CHARS.findIndex(e => e.char === charParam)),
    [charParam]
  )
  const current = ALL_CHARS[currentIndex]

  const navigate = useCallback((dir: 1 | -1) => {
    const next = ALL_CHARS[Math.max(0, Math.min(ALL_CHARS.length - 1, currentIndex + dir))]
    router.replace(`/draw?char=${encodeURIComponent(next.char)}`)
  }, [currentIndex, router])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') navigate(1)
      if (e.key === 'ArrowLeft')  navigate(-1)
      if (e.key === 'Backspace' || e.key === 'Delete') canvasRef.current?.clear()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navigate])

  if (!current) return null

  const isHiragana = current.kanaType === 'hiragana'

  return (
    <main className="p-4 md:p-6">
      <div className="max-w-sm mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <Link href="/learning" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Chart
          </Link>
          <span className="text-xs text-muted-foreground">
            {isHiragana ? 'Hiragana' : 'Katakana'} · {currentIndex + 1} / {ALL_CHARS.length}
          </span>
        </div>

        {/* Character display */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3">
            <p className="text-7xl font-medium leading-none">{current.char}</p>
            <button
              onClick={() => playKanaAudio(current.char)}
              className="text-2xl text-muted-foreground hover:text-foreground transition-colors"
              title="Play pronunciation"
            >
              🔊
            </button>
          </div>
          {showRomaji && (
            <p className="text-xl text-muted-foreground mt-2">{current.romajis[0]}</p>
          )}
        </div>

        {/* Canvas */}
        <div className="flex justify-center">
          <DrawCanvas ref={canvasRef} guideChar={current.char} brushSize={brushSize} />
        </div>

        {/* Brush + Clear */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex gap-1.5">
            {BRUSH_SIZES.map(b => (
              <button
                key={b.label}
                onClick={() => setBrushSize(b.value)}
                className={cn(
                  'w-9 h-9 rounded-full border text-xs font-semibold transition-colors',
                  brushSize === b.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:bg-accent'
                )}
              >
                {b.label}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => canvasRef.current?.clear()}>
            Clear
          </Button>
        </div>

        {/* Prev / hint toggle / Next */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} disabled={currentIndex === 0}>
            ← Prev
          </Button>
          <button
            onClick={() => setShowRomaji(v => !v)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            {showRomaji ? 'Hide' : 'Show'} hint
          </button>
          <Button variant="ghost" size="sm" onClick={() => navigate(1)} disabled={currentIndex === ALL_CHARS.length - 1}>
            Next →
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          ← → arrow keys to navigate · Backspace to clear
        </p>
      </div>
    </main>
  )
}
