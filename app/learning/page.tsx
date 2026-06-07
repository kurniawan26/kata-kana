'use client'
import { kanaDictionary } from '@/lib/kanaDictionary'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from 'react'

type KanaType = keyof typeof kanaDictionary

function CharacterCell({ char, romajis }: { char: string; romajis: string[] }) {
  return (
    <div className="flex flex-col items-center justify-center w-14 h-16 rounded-md border bg-card hover:bg-accent transition-colors cursor-default select-none">
      <span className="text-2xl leading-none">{char}</span>
      <span className="text-xs text-muted-foreground mt-1">{romajis[0]}</span>
    </div>
  )
}

function GroupRow({ characters }: { characters: Record<string, string[]> }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {Object.entries(characters).map(([char, romajis]) => (
        <CharacterCell key={char} char={char} romajis={romajis} />
      ))}
    </div>
  )
}

function KanaSection({ kanaType }: { kanaType: KanaType }) {
  const groups = kanaDictionary[kanaType]

  const basicGroups = Object.entries(groups).filter(([key]) => !key.endsWith('_a') && !key.endsWith('_s'))
  const altGroups = Object.entries(groups).filter(([key]) => key.endsWith('_a'))
  const similarGroups = Object.entries(groups).filter(([key]) => key.endsWith('_s'))

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Basic</h3>
        <div className="space-y-2">
          {basicGroups.map(([groupName, groupData]) => (
            <GroupRow key={groupName} characters={groupData.characters} />
          ))}
        </div>
      </div>

      {altGroups.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Dakuten & Combinations</h3>
          <div className="space-y-2">
            {altGroups.map(([groupName, groupData]) => (
              <GroupRow key={groupName} characters={groupData.characters} />
            ))}
          </div>
        </div>
      )}

      {similarGroups.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Similar Looking</h3>
          <div className="space-y-2">
            {similarGroups.map(([groupName, groupData]) => (
              <GroupRow key={groupName} characters={groupData.characters} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function LearningPage() {
  return (
    <main className="p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">Japanese Kana</h1>
        <p className="text-muted-foreground mb-6">Reference chart for Hiragana and Katakana characters</p>

        <Card className="p-4">
          <Tabs defaultValue="hiragana">
            <TabsList>
              <TabsTrigger value="hiragana">Hiragana (ひらがな)</TabsTrigger>
              <TabsTrigger value="katakana">Katakana (カタカナ)</TabsTrigger>
            </TabsList>
            <TabsContent value="hiragana" className="mt-4">
              <KanaSection kanaType="hiragana" />
            </TabsContent>
            <TabsContent value="katakana" className="mt-4">
              <KanaSection kanaType="katakana" />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </main>
  )
}

export default LearningPage
