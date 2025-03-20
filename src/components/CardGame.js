import React, { useState, useEffect } from 'react';
import './CardGame.css';

const CardGame = () => {
  // Game state
  const [deckId, setDeckId] = useState(null);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameStatus, setGameStatus] = useState('waiting'); // waiting, playing, finished
  const [winner, setWinner] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize a new deck
  const initializeDeck = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
      const data = await response.json();
      
      if (data.success) {
        setDeckId(data.deck_id);
        setGameStatus('waiting');
        setPlayerHand([]);
        setDealerHand([]);
        setWinner(null);
      }
    } catch (error) {
      console.error('Error initializing deck:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Draw cards from the deck
  const drawCards = async (count) => {
    if (!deckId) return [];
    
    try {
      const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`);
      const data = await response.json();
      
      if (data.success) {
        return data.cards;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error drawing cards:', error);
      return [];
    }
  };

  // Start the game by dealing initial cards
  const startGame = async () => {
    if (!deckId) return;
    
    // Deal 2 cards to player and dealer
    const drawnCards = await drawCards(4);
    
    if (drawnCards.length === 4) {
      setPlayerHand(drawnCards.slice(0, 2));
      setDealerHand(drawnCards.slice(2, 4));
      setGameStatus('playing');
    }
  };

  // Draw a new card for player
  const hit = async () => {
    if (gameStatus !== 'playing') return;
    
    const newCards = await drawCards(1);
    if (newCards.length > 0) {
      const updatedHand = [...playerHand, ...newCards];
      setPlayerHand(updatedHand);
      
      // Check if player busts
      if (calculateHandValue(updatedHand) > 21) {
        setWinner('dealer');
        setGameStatus('finished');
      }
    }
  };

  // Dealer's turn
  const stand = async () => {
    if (gameStatus !== 'playing') return;
    
    let currentDealerHand = [...dealerHand];
    let dealerPoints = calculateHandValue(currentDealerHand);
    const playerPoints = calculateHandValue(playerHand);
    
    // Dealer draws until reaching at least 17 points
    while (dealerPoints < 17) {
      const newCards = await drawCards(1);
      if (newCards.length > 0) {
        currentDealerHand = [...currentDealerHand, ...newCards];
        dealerPoints = calculateHandValue(currentDealerHand);
      } else {
        break;
      }
    }
    
    setDealerHand(currentDealerHand);
    
    // Determine winner
    if (dealerPoints > 21) {
      setWinner('player');
    } else if (playerPoints > dealerPoints) {
      setWinner('player');
    } else if (dealerPoints > playerPoints) {
      setWinner('dealer');
    } else {
      setWinner('tie');
    }
    
    setGameStatus('finished');
  };

  // Calculate the value of a hand
  const calculateHandValue = (hand) => {
    let value = 0;
    let aceCount = 0;
    
    for (const card of hand) {
      const cardValue = card.value;
      if (cardValue === 'ACE') {
        aceCount++;
        value += 11;
      } else if (['KING', 'QUEEN', 'JACK'].includes(cardValue)) {
        value += 10;
      } else {
        value += parseInt(cardValue);
      }
    }
    
    // Adjust for aces if needed
    while (value > 21 && aceCount > 0) {
      value -= 10;
      aceCount--;
    }
    
    return value;
  };

  // Initialize deck on component mount
  useEffect(() => {
    initializeDeck();
  }, []);

  return (
    <div className="card-game">
      <h1>Blackjack</h1>
      
      <div className="controls">
        {gameStatus === 'waiting' && (
          <button onClick={startGame} disabled={isLoading || !deckId}>
            Deal Cards
          </button>
        )}
        
        {gameStatus === 'playing' && (
          <>
            <button onClick={hit} disabled={isLoading}>
              Hit
            </button>
            <button onClick={stand} disabled={isLoading}>
              Stand
            </button>
          </>
        )}
        
        {gameStatus === 'finished' && (
          <button onClick={initializeDeck} disabled={isLoading}>
            New Game
          </button>
        )}
      </div>
      
      {gameStatus !== 'waiting' && (
        <>
          <div className="game-table">
            <div className="hand player-hand">
              <h2>Your Hand: {calculateHandValue(playerHand)}</h2>
              <div className="cards">
                {playerHand.map((card, index) => (
                  <img 
                    key={`player-${index}`}
                    src={card.image}
                    alt={`${card.value} of ${card.suit}`}
                    className="card"
                  />
                ))}
              </div>
            </div>
            
            <div className="hand dealer-hand">
              <h2>Dealer's Hand: {gameStatus === 'finished' ? calculateHandValue(dealerHand) : '?'}</h2>
              <div className="cards">
                {dealerHand.map((card, index) => (
                  <img 
                    key={`dealer-${index}`}
                    src={index === 0 || gameStatus === 'finished' ? card.image : 'https://deckofcardsapi.com/static/img/back.png'}
                    alt={index === 0 || gameStatus === 'finished' ? `${card.value} of ${card.suit}` : 'Card back'}
                    className="card"
                  />
                ))}
              </div>
            </div>
          </div>
          
          {gameStatus === 'finished' && (
            <div className="result">
              {winner === 'player' 
                ? 'You win!' 
                : winner === 'dealer' 
                  ? 'Dealer wins!' 
                  : "It's a tie!"}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CardGame;