'use client'
import { kanaDictionary } from '@/lib/kanaDictionary'
import { useCharacters } from '@/state/ChooseCharacters'
import { cn } from '@/lib/utils'
import React from 'react'

type KanaType = keyof typeof kanaDictionary

interface Props {
  groupName: string
  kanaType: KanaType
}

function CharacterGroup({ groupName, kanaType }: Props) {
  const { selectedGroup, setSelectedGroup } = useCharacters()
  const kanaData = kanaDictionary[kanaType] as Record<string, { characters: Record<string, string[]> }>
  const groupData = kanaData[groupName]
  const isSelected = selectedGroup.includes(groupName)

  if (!groupData) return null

  const toggle = () => {
    if (isSelected) {
      setSelectedGroup(selectedGroup.filter(g => g !== groupName))
    } else {
      setSelectedGroup([...selectedGroup, groupName])
    }
  }

  return (
    <div
      onClick={toggle}
      className={cn(
        'flex gap-2 flex-wrap p-2 rounded-md border cursor-pointer transition-all select-none',
        isSelected
          ? 'border-primary bg-primary/10 shadow-sm'
          : 'border-border hover:bg-accent'
      )}
    >
      {Object.entries(groupData.characters).map(([char, romajis]) => (
        <div key={char} className="flex flex-col items-center w-9">
          <span className="text-xl leading-none">{char}</span>
          <span className="text-[10px] text-muted-foreground mt-0.5">{(romajis as string[])[0]}</span>
        </div>
      ))}
    </div>
  )
}

export default CharacterGroup
