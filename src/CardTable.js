import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { render } from '@testing-library/react';
import Card from './Card';
import uuid from 'uuid/v4';

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
  const [isDrawing, setIsDrawing] = useState(false);
  const [isShuffling, setIsShuffling] = useState(true);

  // for getting deckId
  useEffect(function getDeckIdWhenRendered() {
    async function getDeckId() {
      const deckResult = await axios.get(NEW_DECK_URL);
      setIsShuffling(false);
      setDeckId(deckResult.data.deck_id);
    }
    if (isShuffling === true) {
      getDeckId();
    }
  }, [isShuffling]);

  useEffect(function getCardFromDeck() {
    async function getCard() {
      const cardResult = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/`)
      setIsDrawing(false);
      const newCard = { image: cardResult.data.cards[0].image, key: uuid() }
      setDeck(deck => [...deck, newCard])
    }
    if (isDrawing === true) {
      getCard();
    }
  }, [isDrawing]);

  function drawCard(evt) {
    setIsDrawing(true);
  }


  function shuffleDeck(evt) {
    setIsShuffling(true);
    setDeck([]);
  }

  function showButtonOrMsg() {
    if (deck.length >= 52) {
      return <p>NO MORE CARDS!</p>
    } else {
      return <button onClick={drawCard}>GIMME A CARD!</button>
    }
  }

  // shuffle deck button
  // if clicked -> change deckCont state
  // trigger useEffect for getDeckId
  // Reset deck and cardCount to initial values

  return (
    <div>
      {showButtonOrMsg()}
      {!isShuffling &&
        <button onClick={shuffleDeck}>Shuffle Cards</button>}
      {deck.map(
        card => (<Card
          key={card.key}
          image={card.image}
        />)
      )}
    </div>
  )
}

export default CardTable;