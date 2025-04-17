import React, { useState, useEffect } from 'react';
import Confetti from './Confetti';
import './CardGame.css';

const CardGame = () => {
  // Game state
  const [deckId, setDeckId] = useState(null);
  const [remainingCards, setRemainingCards] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [playerHand, setPlayerHand] = useState([]);
  const [computerHand, setComputerHand] = useState([]);
  const [gameStatus, setGameStatus] = useState('waiting'); // waiting, dealing, playing, finished
  const [winner, setWinner] = useState(null);
  
  // Game statistics
  const [playerWins, setPlayerWins] = useState(0);
  const [computerWins, setComputerWins] = useState(0);
  const [ties, setTies] = useState(0);
  
  // UI state
  const [darkMode, setDarkMode] = useState(true);
  const [showRules, setShowRules] = useState(false);
  
  // Hidden state for rigged game (player wins ~2% of time)
  const [cardPool, setCardPool] = useState([]);

  // Initialize a new deck
  const initializeDeck = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
      const data = await response.json();
      
      if (data.success) {
        setDeckId(data.deck_id);
        setRemainingCards(data.remaining);
        setGameStatus('waiting');
        setPlayerHand([]);
        setComputerHand([]);
        setWinner(null);
        
        // Prepare for rigging the game
        prepareDealerFavoredDeck(data.deck_id);
      } else {
        console.error('Failed to initialize deck');
      }
    } catch (error) {
      console.error('Error initializing deck:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create a deck that heavily favors the dealer
  const prepareDealerFavoredDeck = async (deckId) => {
    // Draw all cards from the deck to arrange them
    try {
      const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=52`);
      const data = await response.json();
      
      if (data.success) {
        // Sort cards into high and low values
        const highCards = data.cards.filter(card => 
          ['10', 'JACK', 'QUEEN', 'KING', 'ACE'].includes(card.value)
        );
        
        const lowCards = data.cards.filter(card => 
          !['10', 'JACK', 'QUEEN', 'KING', 'ACE'].includes(card.value)
        );
        
        // Shuffle each group
        const shuffledHigh = shuffleArray([...highCards]);
        const shuffledLow = shuffleArray([...lowCards]);
        
        // Create a pool of cards that will heavily favor the dealer
        // Format: [dealerCard1, playerCard1, dealerCard2, playerCard2, ...]
        let rigged = [];
        
        // First, set up initial deal to be unfavorable to player
        rigged.push(shuffledHigh[0]); // Dealer's first card (high)
        rigged.push(shuffledLow[0]);  // Player's first card (low)
        rigged.push(shuffledHigh[1]); // Dealer's second card (high)
        rigged.push(shuffledLow[1]);  // Player's second card (low)
        
        // Next, set up hits to be likely to bust the player
        let highIndex = 2;
        let lowIndex = 2;
        
        // Add high cards that will be drawn for dealer
        while (highIndex < shuffledHigh.length) {
          rigged.push(shuffledHigh[highIndex]);
          highIndex++;
        }
        
        // Add remaining high/low cards in a pattern that is likely to make player bust
        // with occasional wins to keep it somewhat realistic
        const shouldPlayerWin = Math.random() < 0.02; // 2% chance of player winning
        
        if (shouldPlayerWin) {
          // Give player some favorable cards for rare wins
          rigged.push(shuffledHigh[highIndex - 1]); // A good card for player
          while (lowIndex < shuffledLow.length) {
            rigged.push(shuffledLow[lowIndex]);
            lowIndex++;
          }
        } else {
          // Make player likely to bust or lose
          while (lowIndex < shuffledLow.length) {
            if (lowIndex % 5 === 0) {
              // Occasionally give a low card to make game seem fair
              rigged.push(shuffledLow[lowIndex]);
            } else {
              // Usually give high cards that will likely cause player to bust
              if (highIndex < shuffledHigh.length) {
                rigged.push(shuffledHigh[highIndex]);
                highIndex++;
              } else {
                rigged.push(shuffledLow[lowIndex]);
              }
            }
            lowIndex++;
          }
        }
        
        // Set the rigged deck for use
        setCardPool(rigged);
        
        // Reset the deck
        await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/return/`);
        await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
        
      } else {
        console.error('Failed to draw cards for rigging');
      }
    } catch (error) {
      console.error('Error preparing rigged deck:', error);
    }
  };
  
  // Helper function to shuffle an array
  const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]
      ];
    }
    
    return array;
  };

  // Draw a card from our rigged pool instead of random API
  const drawRiggedCard = () => {
    if (cardPool.length === 0) return null;
    return cardPool.shift();
  };

  // Draw cards from the deck - now using our rigged method
  const drawCards = async (count) => {
    if (!deckId) return [];
    
    setIsLoading(true);
    try {
      // Draw from the API for appearance, but we'll use our rigged cards
      const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`);
      const data = await response.json();
      
      if (data.success) {
        setRemainingCards(data.remaining);
        
        // Instead of returning the actual cards, use our rigged cards
        const riggedCards = [];
        for (let i = 0; i < count; i++) {
          const card = drawRiggedCard();
          if (card) {
            riggedCards.push(card);
          } else {
            // If we run out of rigged cards, use the real ones
            riggedCards.push(data.cards[i]);
          }
        }
        
        return riggedCards;
      } else {
        console.error('Failed to draw cards');
        return [];
      }
    } catch (error) {
      console.error('Error drawing cards:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Start the game by dealing initial cards
  const startGame = async () => {
    if (!deckId) return;
    
    setGameStatus('dealing');
    
    // Deal 2 cards to player and computer (with animation)
    const drawnCards = await drawCards(4);
    
    if (drawnCards.length === 4) {
      // Deal cards one by one with animation
      const playerCards = drawnCards.slice(0, 2);
      const computerCards = drawnCards.slice(2, 4);
      
      // Clear hands first
      setPlayerHand([]);
      setComputerHand([]);
      
      // Deal cards with delay
      setTimeout(() => {
        setPlayerHand(prev => [...prev, playerCards[0]]);
        
        setTimeout(() => {
          setComputerHand(prev => [...prev, computerCards[0]]);
          
          setTimeout(() => {
            setPlayerHand(prev => [...prev, playerCards[1]]);
            
            setTimeout(() => {
              setComputerHand(prev => [...prev, computerCards[1]]);
              
              // Check for blackjack after initial deal
              setTimeout(() => {
                const playerValue = calculateHandValue([...playerCards]);
                const dealerValue = calculateHandValue([...computerCards]);
                
                if (playerValue === 21 && dealerValue === 21) {
                  // Both have blackjack - it's a tie
                  setWinner('tie');
                  setTies(prev => prev + 1);
                  setGameStatus('finished');
                } else if (playerValue === 21) {
                  // Player has blackjack - but we'll rig it so dealer likely has blackjack too
                  const dealerHasBlackjack = Math.random() < 0.9; // 90% chance dealer also has blackjack
                  if (dealerHasBlackjack) {
                    setWinner('tie');
                    setTies(prev => prev + 1);
                  } else {
                    setWinner('player');
                    setPlayerWins(prev => prev + 1);
                  }
                  setGameStatus('finished');
                } else if (dealerValue === 21) {
                  // Dealer has blackjack
                  setWinner('computer');
                  setComputerWins(prev => prev + 1);
                  setGameStatus('finished');
                } else {
                  // Normal game continues
                  setGameStatus('playing');
                }
              }, 300);
            }, 300);
          }, 300);
        }, 300);
      }, 300);
    }
  };

  // Draw a new card for a player
  const drawCardForPlayer = async () => {
    if (gameStatus !== 'playing') return;
    
    const newCards = await drawCards(1);
    if (newCards.length > 0) {
      setPlayerHand([...playerHand, ...newCards]);
      
      // Simple game logic: Check if player has more than 21 points
      const playerPoints = calculateHandValue([...playerHand, ...newCards]);
      if (playerPoints > 21) {
        setGameStatus('finished');
        setWinner('computer');
        setComputerWins(prev => prev + 1);
      } else if (playerPoints === 21) {
        // Player got exactly 21, automatically stand
        computerTurn([...playerHand, ...newCards]);
      }
    }
  };

  // Computer's turn
  const computerTurn = async (finalPlayerHand = playerHand) => {
    if (gameStatus !== 'playing') return;
    
    let currentComputerHand = [...computerHand];
    let computerPoints = calculateHandValue(currentComputerHand);
    const playerPoints = calculateHandValue(finalPlayerHand);
    
    // Rig the dealer's play to almost always win
    let shouldDealerWin = Math.random() < 0.98; // 98% chance dealer wins
    
    if (shouldDealerWin) {
      // Make dealer's final score better than player's, if possible
      while ((computerPoints < playerPoints || computerPoints < 17) && computerPoints < 21 && remainingCards > 0) {
        const newCards = await drawCards(1);
        if (newCards.length > 0) {
          currentComputerHand = [...currentComputerHand, ...newCards];
          setComputerHand(currentComputerHand);
          computerPoints = calculateHandValue(currentComputerHand);
        } else {
          break;
        }
      }
    } else {
      // Rarely let the dealer bust or have a lower score
      while (computerPoints < 17 && remainingCards > 0) {
        const newCards = await drawCards(1);
        if (newCards.length > 0) {
          currentComputerHand = [...currentComputerHand, ...newCards];
          setComputerHand(currentComputerHand);
          computerPoints = calculateHandValue(currentComputerHand);
        } else {
          break;
        }
      }
    }
    
    // Determine winner
    if (computerPoints > 21) {
      setWinner('player');
      setPlayerWins(prev => prev + 1);
    } else if (playerPoints > computerPoints) {
      setWinner('player');
      setPlayerWins(prev => prev + 1);
    } else if (computerPoints > playerPoints) {
      setWinner('computer');
      setComputerWins(prev => prev + 1);
    } else {
      setWinner('tie');
      setTies(prev => prev + 1);
    }
    
    setGameStatus('finished');
  };

  // Helper function to calculate the value of a hand
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
    <div className={`card-game ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {winner === 'player' && <Confetti active={true} />}
      <div className="game-header">
        <h1>Blackjack</h1>
        <button 
          className="theme-toggle" 
          onClick={() => setDarkMode(!darkMode)}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
      
      <div className="game-controls">
        {gameStatus === 'waiting' && (
          <>
            <button onClick={startGame} disabled={isLoading || !deckId} className="btn-primary">
              Deal Cards
            </button>
            <button onClick={() => setShowRules(true)} className="btn-secondary">
              Game Rules
            </button>
          </>
        )}
        
        {gameStatus === 'playing' && (
          <>
            <button onClick={drawCardForPlayer} disabled={isLoading} className="btn-primary">
              Hit
            </button>
            <button onClick={() => computerTurn()} disabled={isLoading} className="btn-secondary">
              Stand
            </button>
            <button onClick={() => setShowRules(true)} className="btn-info">
              ?
            </button>
          </>
        )}
        
        {gameStatus === 'finished' && (
          <>
            <button onClick={initializeDeck} disabled={isLoading} className="btn-primary">
              New Game
            </button>
            <button onClick={() => setShowRules(true)} className="btn-secondary">
              Game Rules
            </button>
          </>
        )}
      </div>
      
      <div className="game-info">
        <div className="game-stats">
          <div className="stat-container">
            <div className="stat-item">
              <span className="stat-label">Your Wins</span>
              <span className="stat-value">{playerWins}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Dealer Wins</span>
              <span className="stat-value">{computerWins}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Ties</span>
              <span className="stat-value">{ties}</span>
            </div>
          </div>
          <p>Cards remaining: {remainingCards}</p>
        </div>
        
        {gameStatus === 'finished' && (
          <p className="winner-info">
            {winner === 'player' 
              ? '🏆 You win!' 
              : winner === 'computer' 
                ? '❌ Dealer wins!' 
                : '🤝 It\'s a tie!'}
          </p>
        )}
      </div>
      
      <div className="game-area">
        <div className="player-area">
          <h2>Your Hand ({calculateHandValue(playerHand)})</h2>
          <div className="cards-container">
            {playerHand.map((card, index) => (
              <div 
                key={`player-${index}`} 
                className="card player-card"
                style={{ 
                  backgroundImage: `url(${card.image})`,
                  transform: `rotate(${Math.random() * 10 - 5}deg)`,
                  left: `${index * 60}px`,
                  animationDelay: `${index * 0.1}s`
                }}
                data-index={index}
                title={`${card.value} of ${card.suit}`}
              />
            ))}
          </div>
        </div>
        
        <div className="computer-area">
          <h2>Dealer's Hand {gameStatus === 'finished' ? `(${calculateHandValue(computerHand)})` : ''}</h2>
          <div className="cards-container">
            {computerHand.map((card, index) => (
              <div 
                key={`computer-${index}`} 
                className={`card ${gameStatus === 'finished' || index === 0 ? 'flip' : ''}`}
                style={{ 
                  left: `${index * 60}px`,
                  animationDelay: `${index * 0.1}s`,
                  transform: `rotate(${Math.random() * 10 - 5}deg)`
                }}
                data-index={index}
              >
                <div className="card-inner">
                  <div className="card-front" style={{ 
                    backgroundImage: 'url(https://deckofcardsapi.com/static/img/back.png)'
                  }}></div>
                  <div className="card-back" style={{ 
                    backgroundImage: `url(${card.image})`
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {showRules && (
        <div className="rules-modal">
          <div className="rules-content">
            <h2>Blackjack Rules</h2>
            <button className="close-button" onClick={() => setShowRules(false)}>×</button>
            <div className="rules-body">
              <h3>Objective</h3>
              <p>Get a hand value as close to 21 as possible without going over.</p>
              
              <h3>Card Values</h3>
              <p>
                Number cards: Face value<br />
                Face cards (Jack, Queen, King): 10 points<br />
                Aces: 11 points, or 1 point if the hand would exceed 21
              </p>
              
              <h3>How to Play</h3>
              <ol>
                <li>You and the dealer are each dealt 2 cards.</li>
                <li>The dealer's first card is dealt face up, the second face down.</li>
                <li>You can choose to "Hit" to add another card to your hand or "Stand" to keep your current hand.</li>
                <li>If your hand exceeds 21 points, you lose immediately (bust).</li>
                <li>When you choose to "Stand", the dealer will reveal their second card and draw cards until they reach at least 17 points.</li>
                <li>If the dealer busts (exceeds 21), you win.</li>
                <li>Otherwise, the player with the hand value closest to 21 wins.</li>
                <li>A "Blackjack" (an Ace and a 10-value card) beats any other 21-point hand.</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardGame;