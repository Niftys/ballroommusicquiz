'use client';
import React, { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
// Removed motion imports for simplified animations
import { logGameStart, logGameEnd, logScoreSubmit, logCorrectAnswer, logWrongAnswer, logTimeUp } from '../../lib/analytics';

function GameContent() {
  const searchParams = useSearchParams();
  const clipDuration = parseInt(searchParams.get('duration'), 10) || 10; // Default to 10 seconds
  const initialLives = parseInt(searchParams.get('lives'), 10) || -1;

  const [currentSong, setCurrentSong] = useState(null);
  const [timer, setTimer] = useState(clipDuration);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [progress, setProgress] = useState(100);
  const [guess, setGuess] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [lives, setLives] = useState(initialLives);
  const [gameStartTime, setGameStartTime] = useState(null);

  const audioRef = useRef(null);
  const router = useRouter();

  const resetAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleGuess();
    }
  };

  const updateFeedback = (message) => {
    setFeedback(message);
  };

  const fetchRandomSong = async () => {
    if (isGameOver) return;
  
    try {
      const response = await fetch('/api/get-music-files');
      if (!response.ok) throw new Error('Failed to fetch songs.');
  
      const musicFiles = await response.json(); // This returns the entire JSON structure from S3.
  
      // Flatten the JSON structure into an array of songs with styles
      const songs = Object.entries(musicFiles).flatMap(([style, urls]) =>
        urls.map((url) => ({ style, url }))
      );
  
      // Randomly select one song
      const randomSong = songs[Math.floor(Math.random() * songs.length)];
      const startTime = Math.floor(Math.random() * (60 - 20 + 1)) + 20; // Random start time
  
      resetAudio();
      setCurrentSong({ ...randomSong, startTime });
      setTimer(clipDuration);
      setProgress(100);
      setFeedback("");
      setGuess("");
  
      if (audioRef.current) {
        audioRef.current.src = randomSong.url;
        audioRef.current.currentTime = startTime;
        await audioRef.current.play().catch((error) => {
          console.error("Audio playback error:", error);
          updateFeedback("Error playing song. Skipping to the next song.");
          setTimeout(fetchRandomSong, 2500);
        });
      }
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };  

  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setLives(initialLives);
    setGameStartTime(Date.now());
    
    // Log game start
    logGameStart(clipDuration, initialLives);
    
    fetchRandomSong();
  };

  useEffect(() => {
    if (currentSong && !isGameOver) {
      const timerInterval = setInterval(() => {
        const timeLeft = Math.max(0, clipDuration - (audioRef.current?.currentTime - currentSong.startTime || 0));
        setTimer(Math.ceil(timeLeft));
        setProgress((timeLeft / clipDuration) * 100);

        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          handleLifeLoss();
        }
      }, 100);

      return () => clearInterval(timerInterval);
    }
  }, [currentSong, isGameOver, clipDuration]);

  const handleLifeLoss = () => {
    resetAudio();

    if (lives !== -1) {
      setLives((prevLives) => {
        const updatedLives = prevLives - 1;

        if (updatedLives <= 0) {
          handleGameOver();
        } else {
          showCorrectAnswerAndNextSong();
        }

        return updatedLives;
      });
    } else {
      showCorrectAnswerAndNextSong();
    }
  };

  const handleGameOver = () => {
    setIsGameOver(true);
    updateFeedback("Game Over! Your score is saved.");
    setShowNameInput(true);
    resetAudio();
    
    // Log game end
    logGameEnd(score, clipDuration, initialLives, Date.now() - gameStartTime);
  };

  const showCorrectAnswerAndNextSong = () => {
    const primaryStyle = currentSong.style.split(",")[0].trim();
    updateFeedback(`Time's up! The correct answer was "${primaryStyle}".`);
    
    // Log time up event
    logTimeUp(primaryStyle, clipDuration);
    
    setTimeout(fetchRandomSong, 2500);
  };

  const handleGuess = () => {
    if (!guess.trim() || isGameOver) return;

    const acceptableStyles = currentSong.style.split(",").map((style) => style.trim().toLowerCase());

    if (acceptableStyles.includes(guess.trim().toLowerCase())) {
      updateFeedback("Correct!");
      setScore((prev) => prev + 1);
      
      // Log correct answer
      logCorrectAnswer(currentSong.style.split(",")[0].trim(), timer, clipDuration);
      
      resetAudio();
      setTimeout(fetchRandomSong, 750);
    } else {
      updateFeedback("Wrong! Try again.");
      
      // Log wrong answer
      logWrongAnswer(guess.trim(), currentSong.style.split(",")[0].trim(), timer, clipDuration);
    }

    setGuess("");
  };

  const submitScore = async () => {
    if (!playerName.trim()) return;

    try {
      const response = await fetch("/api/add-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: playerName.trim(),
          score,
          lives: initialLives,
          duration: clipDuration,
        }),
      });

      if (response.ok) {
        // Log score submission
        logScoreSubmit(score, playerName.trim(), clipDuration, initialLives);
        
        setShowNameInput(false);
        alert("Your score has been saved!");
        router.push("/"); 
      } else {
        console.error("Failed to save score.");
      }
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const handlePopupKeyPress = (e) => {
    if (e.key === "Enter" && playerName.trim()) {
      submitScore();
    }
  };

  const quitGame = () => {
    handleGameOver();
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center text-center p-5 overflow-hidden" style={{ background: 'var(--primary-bg)' }}>
        {!isPlaying && !showNameInput && (
          <div
            key="ready"
            className="flex flex-col justify-center items-center glass-card p-12 max-w-md mx-auto"
          >
            <h1 
              className="font-bold text-4xl mb-8"
              style={{ color: 'var(--accent-gold)' }}
            >
              Ready to Dance?
            </h1>
            <p className="mb-8 text-lg" style={{ color: 'var(--text-secondary)' }}>Test your ballroom music knowledge</p>
            <button 
              className="btn-primary px-12 py-4 text-xl font-bold"
              onClick={startGame}
            >
              Start Quiz
            </button>
          </div>
        )}

        {isPlaying && !showNameInput && (
          <div
            key="game"
            className="flex w-full max-w-4xl flex-col justify-center items-center text-white"
          >
            {/* Header */}
            <div className="glass-card p-6 mb-8 w-full">
              <h1 
                className="font-bold text-3xl mb-4"
                style={{ color: 'var(--accent-gold)' }}
              >
                Ballroom Music Quiz
              </h1>
              <div className="flex justify-between items-center">
                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Score</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{score}</p>
                  </div>
                  {lives !== -1 && (
                    <div className="text-center">
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Lives</p>
                      <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{lives}</p>
                    </div>
                  )}
                </div>
                <button 
                  className="btn-secondary px-6 py-2"
                  onClick={quitGame}
                >
                  Quit Game
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md mb-6">
              <div className="progress-modern h-3 mb-2">
                <div
                  className="progress-fill transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-lg font-semibold" style={{ color: 'var(--text-secondary)' }}>Time: {timer}s</p>
            </div>

            {/* Feedback */}
            {feedback && (
              <div
                className="glass-card p-4 mb-6 max-w-md"
                style={{ 
                  background: feedback.includes('Correct') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  borderColor: feedback.includes('Correct') ? '#10b981' : '#ef4444'
                }}
              >
                <p className="text-lg font-bold" style={{ color: feedback.includes('Correct') ? '#10b981' : '#ef4444' }}>
                  {feedback}
                </p>
              </div>
            )}

            {/* Input Section */}
            <div className="glass-card p-8 w-full max-w-md">
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter dance style..."
                className="input-modern w-full text-center text-lg mb-4"
              />
              <button 
                className="btn-primary w-full py-3 text-lg font-semibold"
                onClick={handleGuess}
              >
                Submit Answer
              </button>
            </div>
          </div>
        )}

        {showNameInput && (
          <div
            key="name"
            className="glass-card flex flex-col justify-center items-center p-12 max-w-md mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Game Over!</h2>
            <p className="mb-6 text-lg" style={{ color: 'var(--text-secondary)' }}>Final Score: <span className="font-bold" style={{ color: 'var(--accent-gold)' }}>{score}</span></p>
            <div className="w-full mb-6">
              <label className="block mb-2 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Enter your name to save your score:</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={handlePopupKeyPress}
                placeholder="Your Name"
                className="input-modern w-full text-center"
              />
            </div>
            <button
              onClick={submitScore}
              className="btn-primary w-full py-3 text-lg font-semibold"
            >
              Save Score
            </button>
          </div>
        )}

      <audio ref={audioRef} className="hidden" />
    </div>
  );
}

export default function Game() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameContent />
    </Suspense>
  );
}