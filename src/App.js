import React from 'react';
import CardGame from './components/CardGame';
import './App.css';

function App() {
  return (
    <div className="container">
      <header>
        <h1>Card Game</h1>
      </header>

      <main>
        <CardGame />
      </main>

      <footer>
        <p>Powered by DeckOfCards API</p>
      </footer>
    </div>
  );
}

export default App;