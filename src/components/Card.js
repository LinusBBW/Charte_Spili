import React from 'react';
import './Card.css';

// Card Component for use in CardGame.js
// This is an optional component to further modularize the code
const Card = ({ 
  card, 
  index, 
  isPlayerCard = false, 
  showFace = true, 
  flipEnabled = false, 
  style = {} 
}) => {
  
  if (isPlayerCard || !flipEnabled) {
    // Simple card for player or when flip animation is not needed
    return (
      <div 
        className={`card ${isPlayerCard ? 'player-card' : ''}`}
        style={{ 
          backgroundImage: showFace ? `url(${card.image})` : 'url(https://deckofcardsapi.com/static/img/back.png)',
          transform: `rotate(${Math.random() * 10 - 5}deg)`,
          left: `${index * 30}px`,
          animationDelay: `${index * 0.1}s`,
          ...style
        }}
        title={`${card.value} of ${card.suit}`}
      />
    );
  } else {
    // Flippable card for computer
    return (
      <div 
        className={`card ${!showFace ? 'flip' : ''}`}
        style={{ 
          left: `${index * 30}px`,
          animationDelay: `${index * 0.1}s`,
          transform: `rotate(${Math.random() * 10 - 5}deg)`,
          ...style
        }}
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
    );
  }
};

export default Card;