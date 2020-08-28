import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { render } from '@testing-library/react';
import Card from './Card';

const NEW_DECK_URL = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1';

/** CardTable renders a draw card button and all drawn cards in deck
 * 
 *  State
 * - deckId: string
 * - deck: array of card info like [{"image": "https://deckofcardsapi.com/static/img/KH.png"}, ...]
 * - cardCount: number
 * 
 * App -> CardTable -> Card
 */
function CardTable() {
  const [deckId, setDeckId] = useState(null);
  const [deck, setDeck] = useState([]);
  const [cardCount, setCardCount] = useState(0);

  // for getting deckId, only called once
  useEffect(function getDeckIdWhenMounted() {
    async function getDeckId() {
      const deckResult = await axios.get(NEW_DECK_URL);
      setDeckId(deckResult.data.deck_id);
    }
    getDeckId();
  }, []);

  useEffect(function getCardFromDeck() {
    async function getCard() {
      const cardResult = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/`)
      const newCard = {image: cardResult.data.cards[0].image}
      setDeck(deck => [...deck, newCard])
    }
    getCard();
  }, [cardCount]);

  function increaseCount(evt) {
    if (cardCount <= 52) {
      setCardCount(c => c + 1);
    }
  }

  function showButtonOrMsg() {
    if (cardCount >= 52) {
      return <p>NO MORE CARDS!</p>
    } else {
      return <button onClick={increaseCount} >GIMME A CARD!</button>
    }
  }


  return (
    <div>
      {showButtonOrMsg()}
      {deck.map(
        card => (<Card
          image={card.image}
        />)
      )}
    </div>
  )
}

export default CardTable;