'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

const COLORS = {
  backgroundGradientStart: "#3e1c5e",
  backgroundGradientEnd: "#1a0c3e",
  headerText: "#9b59b6", // Primary color (purple)
  textPrimary: "#e0e0e0", // Light text
  listText: "#e0e0e0", // Same as text color
  buttonBackground: "#333", // Dark button background
  buttonHover: "#444", // Hover effect for buttons
  buttonText: "#f5f5f5", // Light text for buttons
  correctText: "#ffc107", // Gold for correct answers
  incorrectText: "#dc3545", // Red for incorrect answers
};

export default function Game() {
  const searchParams = useSearchParams();
  const clipDuration = parseInt(searchParams.get('duration'), 10) || 10; // Default to 10 seconds

  const [currentSong, setCurrentSong] = useState(null);
  const [timer, setTimer] = useState(clipDuration);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbackColor, setFeedbackColor] = useState(COLORS.textPrimary);
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
      setFeedbackColor(COLORS.textPrimary);
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
          setFeedback(`Time's up! The correct answer was "${currentSong.style}".`);
          setFeedbackColor(COLORS.incorrectText);
          setTimeout(fetchRandomSong, 3000);
        }
      }, 100);

      return () => clearInterval(timerInterval);
    }
  }, [currentSong, clipDuration]);

  const handleGuess = () => {
    if (!guess.trim()) return;

    if (guess.toLowerCase() === currentSong.style.toLowerCase()) {
      setFeedback("Correct!");
      setFeedbackColor(COLORS.correctText);
      setScore((prev) => prev + 1);
      setTimeout(fetchRandomSong, 750);
    } else {
      setFeedback(`Wrong! Try again.`);
      setFeedbackColor(COLORS.incorrectText);
    }

    setGuess("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleGuess();
    }
  };

  return (
    <div style={{ ...styles.container, background: `linear-gradient(135deg, ${COLORS.backgroundGradientStart} 0%, ${COLORS.backgroundGradientEnd} 100%)` }}>
      {!isPlaying ? (
        <>
          <h1 style={styles.header}>Are you ready?</h1>
          <button style={styles.startButton} onClick={startGame}>
            Begin
          </button>
        </>
      ) : (
        <>
          <h1 style={styles.header}>Ballroom Music Quiz</h1>
          <p style={styles.score}>Score: {score}</p>

          <div style={styles.progressBarContainer}>
            <div style={{ ...styles.progressBar, width: `${progress}%`, transition: "width 0.1s linear" }} />
          </div>

          <p style={{ ...styles.timer, color: COLORS.textPrimary }}>{`Time Remaining: ${timer}s`}</p>

          {feedback && (
            <p style={{ ...styles.feedback, color: feedbackColor, transition: "color 0.5s ease" }}>
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

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    textAlign: "center",
    padding: "20px",
  },
  header: {
    fontSize: "3rem",
    color: COLORS.headerText,
    marginBottom: "20px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
  },
  score: {
    fontSize: "1.5rem",
    color: COLORS.textPrimary,
    marginBottom: "10px",
  },
  progressBarContainer: {
    width: "80%",
    height: "20px",
    backgroundColor: COLORS.buttonBackground,
    borderRadius: "10px",
    overflow: "hidden",
    margin: "20px 0",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.headerText,
  },
  timer: {
    fontSize: "1.5rem",
    marginBottom: "20px",
    color: COLORS.textPrimary,
  },
  feedback: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "20px",
    color: COLORS.textPrimary,
  },
  input: {
    fontSize: "1.2rem",
    padding: "10px",
    margin: "10px 0",
    border: `2px solid ${COLORS.buttonBackground}`,
    borderRadius: "5px",
    width: "80%",
    textAlign: "center",
    backgroundColor: COLORS.buttonHover,
    color: COLORS.textPrimary,
  },
  button: {
    padding: "10px 20px",
    fontSize: "1.2rem",
    backgroundColor: COLORS.buttonBackground,
    color: COLORS.buttonText,
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background-color 0.3s ease",
  },
  startButton: {
    padding: "15px 30px",
    fontSize: "1.5rem",
    backgroundColor: COLORS.buttonBackground,
    color: COLORS.buttonText,
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};