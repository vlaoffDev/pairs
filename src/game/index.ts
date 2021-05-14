import _ from 'lodash'
import { makeAutoObservable, observable, action, computed } from 'mobx'
const TIMEOUT = 1500

export type Card = {
  id: number
}

export type Score = {
  name: string
  time: string
  clicks: string
  score: number
  id: string
  createdAt: Date
}

export class PairsGame {
  @observable cards!: Card[]
  @observable openCards: [number | undefined, number | undefined] = [undefined, undefined]
  @observable actions: number
  @observable startedAt?: number
  @observable resolvedCards: Card['id'][] = []
  @observable lastActionTimeout?: any
  @observable isGameOver = false
  @observable timeEnd: number | null = null

  constructor(cards: Card[]) {
    makeAutoObservable(this)
    this.cards = cards
    this.actions = 0
  }

  static initGame(size = 18) {
    const cards: Card[] = Array(size)
      .fill(null)
      .map((_x, index) => ({
        id: index + 1
      }))

    const pairs = _.shuffle([...cards, ...cards])

    return new PairsGame(pairs)
  }

  @computed get hasOpenCard() {
    return this.openCards[0] !== undefined
  }

  @action showCard(index: number) {
    if (!this.startedAt) {
      this.startedAt = +new Date()
    }
    if (this.hasOpenCard && index === this.openCards[0]) {
      return
    }

    this.actions++

    this.lastActionTimeout && clearTimeout(this.lastActionTimeout)
    this.lastActionTimeout = setTimeout(() => {
      this.hideCards()
    }, TIMEOUT)

    if (this.openCards[0] != null && this.openCards[1] != null) {
      this.hideCards()
    }

    if (this.hasOpenCard) {
      this.openCards[1] = index
      this.checkCards()
    } else {
      this.hideCards()
      this.openCards[0] = index
    }
  }

  @action checkCards() {
    if (this.openCards[0] == null || this.openCards[1] == null) {
      return
    }

    if (assertSameCards(this.cards, this.openCards[0], this.openCards[1])) {
      this.resolvedCards.push(getCardByIndex(this.cards, this.openCards[0]).id)
      this.hideCards()
    }
  }

  @action hideCards() {
    this.openCards = [undefined, undefined]
    if (this.resolvedCards.length === this.cards.length / 2) {
      return this.endGame()
    }
  }

  @action endGame() {
    this.lastActionTimeout && clearTimeout(this.lastActionTimeout)
    this.isGameOver = true
    this.timeEnd = +new Date()
  }

  @computed get resolvedIndexes() {
    return this.cards
      .map((card, index) => (this.assertIsResolved(card.id) ? index : null))
      .filter((x) => x != null)
  }

  @computed get time() {
    const end = this.timeEnd || +new Date()

    return PairsGame.getFormattedDiff(this.startedAt ?? +new Date(), end)
  }

  @computed get score() {
    const start = this.startedAt || +new Date()
    const end = this.timeEnd || +new Date()

    return (end - start) / 1000 + this.actions * 3
  }

  static getFormattedDiff(start: number, end: number) {
    const diff = (end - start) / 1000
    const minutes = Math.floor((diff / 60) % 60)
    const seconds = Math.floor(diff % 60)

    return `0${minutes > 0 ? minutes : 0}:${
      seconds > 10 ? seconds : seconds > 0 ? `0${seconds}` : '00'
    }`
  }

  assertIsResolved(id: Card['id']) {
    return this.resolvedCards.includes(id)
  }

  assertIsShown(id: Card['id'], index: number) {
    return this.assertIsResolved(id) || this.assertIsOpen(index)
  }

  assertIsOpen(index: number) {
    return this.openCards[0] === index || this.openCards[1] === index
  }
}

const assertSameCards = (cards: Card[], index1: number, index2: number): boolean => {
  const firstCard = getCardByIndex(cards, index1)
  const secondCard = getCardByIndex(cards, index2)

  return firstCard.id === secondCard.id
}

const getCardByIndex = (cards: Card[], index: number): Card => {
  return cards[index]
}
