import { observer } from 'mobx-react'
import { Card, PairsGame } from './index'
import React, { useEffect, useState } from 'react'
import GameOver from './GameOver'
import LeaderBoard from './LeaderBoard'
import axios from 'axios'

const GameCard = observer(
  ({ game, index, card }: { game: PairsGame; index: number; card: Card }) => {
    const [isResolved, setIsResolved] = useState(false)

    const onClick = (index: number) => {
      game.showCard(index)
    }

    useEffect(() => {
      if (game.resolvedIndexes.includes(index)) {
        setTimeout(() => {
          setIsResolved(true)
        }, 800)
      }
    }, [game.resolvedIndexes.length])

    return (
      <div className={'card__container cursor-pointer'} key={index} onClick={() => onClick(index)}>
        <div
          className={`card card__front ${game.assertIsShown(card.id, index) && 'card--open'} ${
            isResolved && 'card--resolved'
          }`}>
          {' '}
          {card.id}
        </div>
        <div
          className={`card card__back ${
            !game.assertIsShown(card.id, index) && 'card--open'
          }`}></div>
      </div>
    )
  }
)

const GameBoard = observer(({ game, reset }: { game: PairsGame; reset: () => void }) => {
  const [leaderBoard, setLeaderBoard] = useState([])

  useEffect(() => {
    refetch()
  }, [])

  const refetch = async () => {
    const { scores } = await axios
      .get('http://localhost:3001/scores')
      .then(({ data }) => data && data)

    setLeaderBoard(scores)
  }

  return (
    <>
      {!game.isGameOver && (
        <div className="GameBoard grid grid-cols-6 gap-1 md:gap-4">
          {game.cards.map((card, index) => (
            <GameCard game={game} index={index} card={card} key={`${index}-${card.id}`} />
          ))}
        </div>
      )}
      {game.isGameOver && <GameOver game={game} reset={reset} refetch={refetch} />}
      <LeaderBoard leaderBoard={leaderBoard} />
    </>
  )
})

export default GameBoard
