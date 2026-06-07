'use client'
import React from 'react'
import { useGame } from '@/state/Game'
import ChooseCharacters from '@/components/ChooseCharacters'
import Game from '@/components/Game'

function GameContainer() {
  const { gameState } = useGame()

  return (
    <div>
      {gameState === 'chooseCharacters' && <ChooseCharacters />}
      {gameState === 'game' && <Game />}
    </div>
  )
}

export default GameContainer
