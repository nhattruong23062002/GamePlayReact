import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [points, setPoints] = useState(5);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [randomPoints, setRandomPoints] = useState([]);
  const [nextNumber, setNextNumber] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [allCleared, setAllCleared] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false); 
  useEffect(() => {
    let timer;
    if (gameStarted && !gameOver && !allCleared) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1);
      }, 100);
    }

    if (allCleared || gameOver) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [gameStarted, gameOver, allCleared]);

  useEffect(() => {
    let autoPlayInterval;
    if (autoPlay && gameStarted && !gameOver && !allCleared) {
      autoPlayInterval = setInterval(() => {
        handlePointClick(nextNumber); 
      }, 1000);
    }

    if (allCleared || gameOver) {
      clearInterval(autoPlayInterval);
    }

    return () => clearInterval(autoPlayInterval);
  }, [autoPlay, gameStarted, gameOver, allCleared, nextNumber]);

  const generateRandomPoints = () => {
    const pointsArray = [];
    for (let i = 0; i < points; i++) {
      pointsArray.push({
        id: i + 1,
        x: Math.random() * 380,
        y: Math.random() * 280,
        active: false,
        countdown: 3, 
      });
    }
    setRandomPoints(pointsArray);
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setAllCleared(false);
    setNextNumber(1);
    setTime(0); 
    setAutoPlay(false); 
    generateRandomPoints();
  };

  const handlePointClick = (pointId) => {
    if (pointId === nextNumber) {
      setRandomPoints((prevPoints) =>
        prevPoints.map((point) =>
          point.id === pointId ? { ...point, active: true } : point
        )
      );

      const countdownInterval = setInterval(() => {
        setRandomPoints((prevPoints) =>
          prevPoints.map((point) =>
            point.id === pointId && point.active
              ? { ...point, countdown: point.countdown - 0.1 }
              : point
          )
        );
      }, 100);

      setNextNumber((prevNumber) => prevNumber + 1);

      setTimeout(() => {
        clearInterval(countdownInterval);
        setRandomPoints((prevPoints) =>
          prevPoints.filter((point) => point.id !== pointId)
        );
        
        if (nextNumber + 1 > points) {
          setAllCleared(true);
          setGameStarted(false);
        }
      }, 3000);
    } else {
      setGameOver(true);
      setGameStarted(false);
    }
  };

  const toggleAutoPlay = () => {
    setAutoPlay((prevAutoPlay) => !prevAutoPlay);
  };

  return (
    <div className="container">
      <div className="wrapper-header">
        {gameOver ? <h2 className='error'>Game Over</h2> : allCleared ? <h2 className='success'>ALL CLEARED</h2> : <h2>LET'S PLAY</h2> }
        <div className="input-group">
          <label>Points:</label>
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(parseInt(e.target.value))}
            disabled={gameStarted || gameOver}
          />
        </div>
        <div className="input-group">
          <label>Time:</label>
          <span className="time-display">{time.toFixed(1)}s</span>
        </div>

        <div className="button-group">
          {!gameStarted && !gameOver && !allCleared ? (
            <button onClick={startGame}>Play</button>
          ) : (
            <button onClick={startGame}>Restart</button>
          )}
          {!allCleared && gameStarted && (
          <button onClick={toggleAutoPlay}>
            {autoPlay ? "Auto Play OFF" : "Auto Play ON"}
          </button>
        )}
        </div>
      </div>

      <div className="game-area">
        {randomPoints.map((point) => (
          <div
            key={point.id}
            className={`point ${point.active ? 'active' : ''}`}
            style={{
              top: `${point.y}px`,
              left: `${point.x}px`,
              opacity: point.countdown / 3, 
              transition: 'opacity 0.1s linear', 
            }}
            onClick={() => handlePointClick(point.id)}
          >
            <div className='wrapper-point'>
              <div style={{textAlign:'center'}}>{point.id}</div>
              {point.active && (
                <div className="countdown">{point.countdown.toFixed(1)}s</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
