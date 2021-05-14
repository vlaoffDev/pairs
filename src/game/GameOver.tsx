import React, { useState } from 'react'
import axios from 'axios'
import { PairsGame } from './index'

const GameOver = ({
  game,
  refetch,
  reset
}: {
  game: PairsGame
  refetch: () => void
  reset: () => void
}) => {
  const [name, setName] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name) {
      return
    }

    await axios.post('http://localhost:3001/scores', {
      data: {
        name,
        time: game.time,
        clicks: game.actions,
        score: game.score
      }
    })
    refetch()
    setIsSubmitted(true)
  }

  return (
    <div className="GameOver text-center py-10">
      <h2 className="text-3xl mb-4">Game over</h2>
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <p>
        You finished the game in {game.time} minutes and {game.actions} clicks
      </p>
      <p>enter your name to join the leader board</p>
      {!isSubmitted && (
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            value={name}
            onInput={handleInput}
            className={'border border-gray-200 h-10 px-2'}
            placeholder="My name is..."
            required={true}
          />
          <button type="submit" className="p-1 px-2 bg-blue-900 text-white uppercase text-sm h-10">
            Send
          </button>
        </form>
      )}
      {isSubmitted && (
        <div className="text-center mt-4">
          <button
            className="p-1 px-2 bg-blue-900 text-white uppercase text-sm h-10"
            onClick={() => reset()}>
            Play again
          </button>
        </div>
      )}
    </div>
  )
}

export default GameOver
