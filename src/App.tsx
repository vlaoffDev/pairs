import React from 'react'
import './App.css'
import { observer } from 'mobx-react'
import GameIndex from './game/GameIndex'

const App = observer(() => {
  return <GameIndex />
})

export default App
