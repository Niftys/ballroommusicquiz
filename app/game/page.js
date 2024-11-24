'use client';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const COLORS = {
  backgroundGradientStart: "#6a11cb",
  backgroundGradientEnd: "#2575fc",
  textPrimary: "#ffffff",
  buttonBackground: "#28a745",
  buttonHover: "#218838",
  progressBar: "#28a745",
  correct: "#ffc107",
  incorrect: "#dc3545",
};

function GameComponent() {
  const searchParams = useSearchParams();
  const clipDuration = parseInt(searchParams.get('duration'), 10) || 10; // Default to 10 seconds

  const [currentSong, setCurrentSong] = useState(null);
  const [timer, setTimer] = useState(clipDuration);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [progress, setProgress] = useState(100);
  const [guess, setGuess] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);

  const fetchRandomSong = async () => {
    try {
      const response = await fetch('/api/get-random-song');
      if (!response.ok) throw new Error('Failed to fetch song.');
      const song = await response.json();

      const startTime = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
      setCurrentSong({ ...song, startTime });

      setTimer(clipDuration);
      setProgress(100);
      setFeedback("");
      setGuess("");

      if (audioRef.current) {
        audioRef.current.src = song.url;
        audioRef.current.currentTime = startTime;
        await audioRef.current.play().catch((error) =>
          console.error("Audio playback error:", error)
        );
      }
    } catch (error) {
      console.error("Error fetching song:", error);
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    fetchRandomSong();
  };

  useEffect(() => {
    if (currentSong && audioRef.current) {
      const timerInterval = setInterval(() => {
        const timeLeft = Math.max(0, clipDuration - (audioRef.current.currentTime - currentSong.startTime));
        setTimer(Math.ceil(timeLeft));
        setProgress((timeLeft / clipDuration) * 100);

        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          audioRef.current.pause();
          setFeedback(`Time's up! The correct answer was: ${currentSong.style}`);
          fetchRandomSong();
        }
      }, 100);

      return () => clearInterval(timerInterval);
    }
  }, [currentSong, clipDuration]);

  const handleGuess = () => {
    if (!guess.trim()) return;

    if (guess.toLowerCase() === currentSong.style.toLowerCase()) {
      setFeedback("Correct!");
      setScore((prev) => prev + 1);
      fetchRandomSong();
    } else {
      setFeedback("Wrong! Try again.");
    }

    setGuess("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleGuess();
    }
  };

  return (
    <div
      style={{
        ...styles.container,
        background: `linear-gradient(135deg, ${COLORS.backgroundGradientStart} 0%, ${COLORS.backgroundGradientEnd} 100%)`,
      }}
    >
      {!isPlaying ? (
        <>
          <h1 style={styles.header}>🎵 Ballroom Music Quiz 🎵</h1>
          <button style={styles.startButton} onClick={startGame}>
            Begin
          </button>
        </>
      ) : (
        <>
          <h1 style={styles.header}>🎵 Ballroom Music Quiz 🎵</h1>
          <p style={styles.score}>Score: {score}</p>

          <div style={styles.progressBarContainer}>
            <div style={{ ...styles.progressBar, width: `${progress}%`, transition: "width 0.1s linear" }} />
          </div>

          <p style={styles.timer}>{`Time Remaining: ${timer}s`}</p>

          {feedback && (
            <p style={styles.feedback}>
              {feedback}
            </p>
          )}

          <input
            type="text"
            placeholder="Enter dance style..."
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyPress={handleKeyPress}
            style={styles.input}
          />
          <button onClick={handleGuess} style={styles.button}>
            Submit Guess
          </button>

          <audio ref={audioRef} style={{ display: 'none' }} />
        </>
      )}
    </div>
  );
}

export default function Game() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameComponent />
    </Suspense>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "20px",
    textAlign: "center",
  },
  header: {
    fontSize: "3.5rem",
    fontWeight: "bold",
    marginBottom: "20px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
    color: COLORS.textPrimary,
  },
  score: {
    fontSize: "1.5rem",
    color: COLORS.textPrimary,
    marginBottom: "20px",
  },
  progressBarContainer: {
    width: "80%",
    height: "20px",
    backgroundColor: "#ddd",
    borderRadius: "10px",
    overflow: "hidden",
    margin: "20px 0",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.progressBar,
  },
  timer: {
    fontSize: "1.5rem",
    marginBottom: "20px",
    color: COLORS.textPrimary,
  },
  feedback: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: "20px",
  },
  input: {
    fontSize: "1.2rem",
    padding: "10px",
    margin: "10px 0",
    border: "2px solid #ccc",
    borderRadius: "5px",
    width: "80%",
    textAlign: "center",
    backgroundColor: "#fff",
    color: "#000",
  },
  button: {
    fontSize: "1.5rem",
    padding: "15px 30px",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    marginTop: "30px",
    backgroundColor: COLORS.buttonBackground,
    color: COLORS.textPrimary,
    transition: "background-color 0.3s ease",
  },
  startButton: {
    fontSize: "1.5rem",
    padding: "15px 30px",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    backgroundColor: COLORS.buttonBackground,
    color: COLORS.textPrimary,
    transition: "background-color 0.3s ease",
  },
};
