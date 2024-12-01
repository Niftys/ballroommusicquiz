'use client';
import React, { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from "framer-motion";

const COLORS = {
  backgroundGradientStart: "#3e1c5e",
  backgroundGradientEnd: "#1a0c3e",
  headerText: "#9b59b6", // Primary color (purple)
  textPrimary: "#e0e0e0", // Light text
  buttonBackground: "#333", // Dark button background
  buttonHover: "#444", // Hover effect for buttons
  buttonText: "#f5f5f5", // Light text for buttons
  correctText: "#ffc107", // Gold for correct answers
  incorrectText: "#8b0000", // Red for incorrect answers
};

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
      handleGuess(); // Call the existing function to handle the guess
    }
  };  

  const updateFeedback = (message) => {
    setFeedback(message);
  };

  const fetchRandomSong = async () => {
    if (isGameOver) return; // Prevent fetching a song after game over

    try {
      const response = await fetch('/api/get-random-song');
      if (!response.ok) throw new Error('Failed to fetch song.');

      const song = await response.json();
      const startTime = Math.floor(Math.random() * (60 - 20 + 1)) + 20;

      resetAudio(); // Reset audio before loading a new song
      setCurrentSong({ ...song, startTime });
      setTimer(clipDuration);
      setProgress(100);
      setFeedback("");
      setGuess("");

      if (audioRef.current) {
        audioRef.current.src = song.url;
        audioRef.current.currentTime = startTime;
        await audioRef.current.play().catch((error) => {
          console.error("Audio playback error:", error);
          updateFeedback("Error playing song. Skipping to the next song.", COLORS.incorrectText);
          setTimeout(fetchRandomSong, 2500);
        });
      }
    } catch (error) {
      console.error("Error fetching song:", error);
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setLives(initialLives);
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
      showCorrectAnswerAndNextSong(); // Unlimited lives mode
    }
  };

  const handleGameOver = () => {
    setIsGameOver(true);
    updateFeedback("Game Over! Your score is saved.", COLORS.incorrectText);
    setShowNameInput(true);
    resetAudio();
  };

  const showCorrectAnswerAndNextSong = () => {
    const primaryStyle = currentSong.style.split(",")[0].trim();
    updateFeedback(`Time's up! The correct answer was "${primaryStyle}".`, COLORS.incorrectText);
    setTimeout(fetchRandomSong, 2500);
  };

  const handleGuess = () => {
    if (!guess.trim() || isGameOver) return;

    const acceptableStyles = currentSong.style.split(",").map((style) => style.trim().toLowerCase());

    if (acceptableStyles.includes(guess.trim().toLowerCase())) {
      updateFeedback("Correct!", COLORS.correctText);
      setScore((prev) => prev + 1);
      resetAudio(); // Stop audio playback
      setTimeout(fetchRandomSong, 750);
    } else {
      updateFeedback("Wrong! Try again.", COLORS.incorrectText);
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
        setShowNameInput(false);
        alert("Your score has been saved!");
        router.push("/"); // Redirect to the main page
      } else {
        console.error("Failed to save score.");
      }
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const handlePopupKeyPress = (e) => {
    if (e.key === "Enter" && playerName.trim()) {
      submitScore(); // Submit the score when Enter is pressed
    }
  };  

  const quitGame = () => {
    handleGameOver(); // Trigger game-over logic
  };  

  return (
    <div
      style={{
        ...styles.container,
        background: `linear-gradient(135deg, ${COLORS.backgroundGradientStart} 0%, ${COLORS.backgroundGradientEnd} 100%)`,
      }}
    >
      {/* Transition for the "Are you ready" and game */}
      <AnimatePresence mode="popLayout">
        {!isPlaying && !showNameInput && (
          <motion.div
            key="ready"
            style={{...styles.container}}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: 500}}
            transition={{ ease: 'easeOut', duration: 0.3, type: "spring", stiffness: "50" }}
          >
            <h1 style={{ ...styles.header, color: COLORS.correctText }}>
              Are you ready?
            </h1>
            <button style={styles.startButton} onClick={startGame}>
              Begin
            </button>
          </motion.div>
        )}
  
        {isPlaying && !showNameInput && (
          <motion.div
            key="game"
            style={{...styles.container}}
            initial={{ opacity: 0, x: -500 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 500 }}
            transition={{ ease: 'easeOut', duration: 0.3, type: "spring", stiffness: "50" }}
          >
            <h1 style={{...styles.header, color: COLORS.correctText}}>Ballroom Music Quiz</h1>
            <button onClick={quitGame} style={styles.quitButton}>
              Quit Game
            </button>
            <p style={styles.score}>Score: {score}</p>
            {lives !== -1 && <p style={styles.lives}>Lives: {lives}</p>}
            <div style={styles.progressBarContainer}>
              <div
                style={{
                  ...styles.progressBar,
                  width: `${progress}%`,
                  transition: "width 0.1s linear",
                }}
              />
            </div>
            <p style={styles.timer}>Time: {timer}s</p>
            {feedback && <p style={styles.feedback}>{feedback}</p>}
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter style..."
              style={styles.input}
            />
            <button onClick={handleGuess} style={styles.button}>
              Submit
            </button>
          </motion.div>
        )}
      </AnimatePresence>
  
      {/* Separate transition for name input */}
      <AnimatePresence mode="popLayout">
        {showNameInput && (
          <motion.div
            key="name"
            initial={{ opacity: 0, x: -500 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ease: 'easeOut', duration: 0.3, type: "spring", stiffness: "50"}}
            style={styles.popup}
          >
            <h2 style={styles.popupHeader}>Enter Your Name</h2>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={handlePopupKeyPress}
              placeholder="Your Name"
              style={styles.input}
            />
            <button onClick={submitScore} style={{...styles.button, backgroundColor: COLORS.correctText, color: COLORS.buttonBackground}}>
              Submit
            </button>
          </motion.div>
        )}
      </AnimatePresence>
  
      <audio ref={audioRef} style={{ display: "none" }} />
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

const styles = {
  container: {
    width: "100%",
    fontFamily: "Lato, sans-serif",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    textAlign: "center",
    padding: "20px",
    boxSizing: "border-box",
    overflow: "hidden",
  },
  header: {
    fontFamily: "Megrim",
    marginBottom: "10px",
    fontSize: "5rem", // Desktop font size
    color: COLORS.headerText,
    fontWeight: "bold",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
    "@media (max-width: 768px)": {
      fontSize: "3rem", // Reduce font size for mobile
    },
  },
  score: {
    fontSize: "2rem",
    color: COLORS.textPrimary,
    marginBottom: "10px",
    fontWeight: "bold",
    "@media (max-width: 768px)": {
      fontSize: "1.5rem",
    },
  },
  lives: {
    fontSize: "2rem",
    marginBottom: "10px",
    color: COLORS.textPrimary,
    textAlign: "center",
    "@media (max-width: 768px)": {
      fontSize: "1.5rem",
    },
  },
  progressBarContainer: {
    width: "100%",
    height: "20px",
    backgroundColor: COLORS.buttonBackground,
    borderRadius: "10px",
    overflow: "hidden",
    margin: "20px 0",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    "@media (max-width: 768px)": {
      height: "15px", // Adjust height for mobile
      margin: "10px 0",
    },
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.headerText,
    transition: "width 0.1s linear", // Smooth transition
  },
  timer: {
    fontSize: "1.5rem",
    marginBottom: "20px",
    color: COLORS.textPrimary,
    fontWeight: "bold",
    "@media (max-width: 768px)": {
      fontSize: "1.2rem",
    },
  },
  feedback: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "20px",
    color: COLORS.textPrimary,
    textAlign: "center",
    transition: "color 0.3s ease", // Smooth color change
    "@media (max-width: 768px)": {
      fontSize: "1rem",
    },
  },
  input: {
    fontSize: "1.2rem",
    padding: "10px",
    margin: "10px 0",
    border: `2px solid ${COLORS.buttonBackground}`,
    borderRadius: "5px",
    width: "80%",
    maxWidth: "400px",
    textAlign: "center",
    backgroundColor: COLORS.buttonHover,
    color: COLORS.textPrimary,
    outline: "none",
    "@media (max-width: 768px)": {
      fontSize: "1rem",
      width: "100%", // Full width on mobile
    },
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
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    "@media (max-width: 768px)": {
      fontSize: "1rem",
      padding: "8px 15px", // Adjust padding for mobile
    },
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
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    "@media (max-width: 768px)": {
      fontSize: "1.2rem",
      padding: "10px 20px", // Adjust padding for mobile
    },
  },
  popup: {
    backgroundColor: COLORS.buttonBackground,
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
    width: "100%",
    maxWidth: "400px",
    zIndex: 10,
    "@media (max-width: 768px)": {
      padding: "15px",
      fontSize: "0.9rem",
    },
  },
  popupHeader: {
    color: COLORS.headerText,
    marginBottom: "10px",
    fontWeight: "bold",
    fontSize: "1.5em",
    textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  },
  quitButton: {
    padding: "10px 20px",
    fontSize: "1.2rem",
    backgroundColor: COLORS.incorrectText,
    color: COLORS.buttonText,
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
    marginBottom: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    transition: "background-color 0.3s ease",
  },
};
