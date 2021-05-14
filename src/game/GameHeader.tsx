import { PairsGame } from './index'
import { observer } from 'mobx-react'
import React, { useEffect, useRef, useState } from 'react'

const GameHeader = observer(({ game }: { game: PairsGame }) => {
  const [now, setNow] = useState(+new Date())
  const timer = useRef<any>(null)
  const updateNow = () => {
    setNow(+new Date())
    timer.current = setTimeout(() => {
      updateNow()
    }, 100)
  }

  useEffect(() => {
    updateNow()

    return () => {
      clearTimeout(timer.current)
    }
  }, [game.startedAt])

  const diff = PairsGame.getFormattedDiff(game.startedAt ?? +new Date(), now)

  return (
    <div className="GameHeader">
      <div className="text-center mb-4">
        {!game.startedAt && <div className="">click on a card to start the game</div>}
        {game.startedAt && (
          <div className="">
            {diff} | {game.actions} click
            {game.actions > 1 && 's'} | {game.cards.length / 2 - game.resolvedCards.length} cards
            left{' '}
          </div>
        )}
      </div>
    </div>
  )
})

export default GameHeader
