import React from 'react'

import './Ranking.css'

const Ranking = () => {
  const cards = []
  const ranks = [
    'A',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K'
  ]
  const suits = ['♥', '♦', '♠', '♣']
  const suitColor = {
    '♠': 'black',
    '♣': 'black',
    '♦': 'red',
    '♥': 'red'
  }

  let id = 1
  for (let i = 0; i < suits.length; i++) {
    for (let k = 0; k < ranks.length; k++) {
      let card = {
        id,
        rank: ranks[k],
        suit: suits[i]
      }
      cards.push(card)
      id++
    }
  }
  const highCard = [cards[0], cards[19], cards[29], cards[22], cards[46]]
  const onePair = [cards[0], cards[39], cards[17], cards[1], cards[44]]
  const twoPair = [cards[51], cards[25], cards[10], cards[36], cards[2]]
  const threeOfAKind = [cards[11], cards[11], cards[11], cards[46], cards[33]]
  const straight = [cards[24], cards[49], cards[9], cards[21], cards[46]]
  const flush = [cards[41], cards[48], cards[44], cards[49], cards[39]]
  const fullHouse = [cards[25], cards[25], cards[25], cards[49], cards[49]]
  const fourOfAKind = [cards[39], cards[39], cards[39], cards[39], cards[1]]
  const straightFlush = [cards[29], cards[30], cards[31], cards[32], cards[33]]
  const royalFlush = [cards[0], cards[12], cards[11], cards[10], cards[9]]

  console.log(cards)
  return (
    <div className="ranking">
      <h2>Hand strength</h2>

      <h3>High card</h3>
      <div className="deck">
        {highCard.map(card => (
          <div key={card.id} className={`card ${suitColor[card.suit]}`}>
            <span className="card-suit card-suit-top">{card.suit}</span>
            <span className="card-number">{card.rank}</span>
            <span className="card-suit card-suit-bottom">{card.suit}</span>
          </div>
        ))}
      </div>

      <h3>One pair</h3>
      <div className="deck">
        {onePair.map(card => (
          <div key={card.id * 100} className={`card ${suitColor[card.suit]}`}>
            <span className="card-suit card-suit-top">{card.suit}</span>
            <span className="card-number">{card.rank}</span>
            <span className="card-suit card-suit-bottom">{card.suit}</span>
          </div>
        ))}
      </div>

      <h3>Two pair</h3>
      <div className="deck">
        {twoPair.map(card => (
          <div key={card.id * 200} className={`card ${suitColor[card.suit]}`}>
            <span className="card-suit card-suit-top">{card.suit}</span>
            <span className="card-number">{card.rank}</span>
            <span className="card-suit card-suit-bottom">{card.suit}</span>
          </div>
        ))}
      </div>

      <h3>3 of a kind</h3>
      <div className="deck">
        {threeOfAKind.map(card => (
          <div key={card.id * 300} className={`card ${suitColor[card.suit]}`}>
            <span className="card-suit card-suit-top">{card.suit}</span>
            <span className="card-number">{card.rank}</span>
            <span className="card-suit card-suit-bottom">{card.suit}</span>
          </div>
        ))}
      </div>

      <h3>Straight</h3>
      <div className="deck">
        {straight.map(card => (
          <div key={card.id * 400} className={`card ${suitColor[card.suit]}`}>
            <span className="card-suit card-suit-top">{card.suit}</span>
            <span className="card-number">{card.rank}</span>
            <span className="card-suit card-suit-bottom">{card.suit}</span>
          </div>
        ))}
      </div>

      <h3>Flush</h3>
      <div className="deck">
        {flush.map(card => (
          <div key={card.id} className={`card ${suitColor[card.suit]}`}>
            <span className="card-suit card-suit-top">{card.suit}</span>
            <span className="card-number">{card.rank}</span>
            <span className="card-suit card-suit-bottom">{card.suit}</span>
          </div>
        ))}
      </div>

      <h3>Full House</h3>
      <div className="deck">
        {fullHouse.map(card => (
          <div key={card.id} className={`card ${suitColor[card.suit]}`}>
            <span className="card-suit card-suit-top">{card.suit}</span>
            <span className="card-number">{card.rank}</span>
            <span className="card-suit card-suit-bottom">{card.suit}</span>
          </div>
        ))}
      </div>

      <h3>4 of a kind</h3>
      <div className="deck">
        {fourOfAKind.map(card => (
          <div key={card.id} className={`card ${suitColor[card.suit]}`}>
            <span className="card-suit card-suit-top">{card.suit}</span>
            <span className="card-number">{card.rank}</span>
            <span className="card-suit card-suit-bottom">{card.suit}</span>
          </div>
        ))}
      </div>

      <h3>Straight flush</h3>
      <div className="deck">
        {straightFlush.map(card => (
          <div key={card.id} className={`card ${suitColor[card.suit]}`}>
            <span className="card-suit card-suit-top">{card.suit}</span>
            <span className="card-number">{card.rank}</span>
            <span className="card-suit card-suit-bottom">{card.suit}</span>
          </div>
        ))}
      </div>

      <h3>Royal flush</h3>
      <div className="deck">
        {royalFlush.map(card => (
          <div key={card.id} className={`card ${suitColor[card.suit]}`}>
            <span className="card-suit card-suit-top">{card.suit}</span>
            <span className="card-number">{card.rank}</span>
            <span className="card-suit card-suit-bottom">{card.suit}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Ranking
