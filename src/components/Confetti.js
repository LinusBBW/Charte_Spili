import React, { useEffect, useState } from 'react';
import './Confetti.css';

const Confetti = ({ active }) => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    if (active) {
      // Create confetti particles
      const newParticles = [];
      const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];
      
      for (let i = 0; i < 100; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: -20 - Math.random() * 100,
          size: 5 + Math.random() * 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          speed: 1 + Math.random() * 3
        });
      }
      
      setParticles(newParticles);
      
      // Clean up after animation
      const timer = setTimeout(() => {
        setParticles([]);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [active]);
  
  return (
    <div className="confetti-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="confetti-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size * 1.5}px`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            animationDuration: `${5000 / particle.speed}ms`
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;