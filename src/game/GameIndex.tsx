import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { PairsGame } from './index'
import GameHeader from './GameHeader'
import GameBoard from './GameBoard'

const GameIndex = observer(() => {
  const [game, setGame] = useState(() => PairsGame.initGame())

  const reset = async () => {
    setGame(PairsGame.initGame())
  }

  return (
    <div className="GameIndex container px-2 md:px-0 mx-auto pt-10">
      <div className="text-2xl md:text-5xl mb-4 text-center uppercase font-black">
        Find the matching pairs
      </div>
      {!game.isGameOver && <GameHeader game={game} />}
      <GameBoard game={game} reset={reset} />
    </div>
  )
})

export default GameIndex
