'use client';
import React, { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from "framer-motion";

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
      handleGuess();
    }
  };

  const updateFeedback = (message) => {
    setFeedback(message);
  };

  const fetchRandomSong = async () => {
    if (isGameOver) return;

    try {
      const response = await fetch('/api/get-random-song');
      if (!response.ok) throw new Error('Failed to fetch song.');

      const song = await response.json();
      const startTime = Math.floor(Math.random() * (60 - 20 + 1)) + 20;

      resetAudio();
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
          updateFeedback("Error playing song. Skipping to the next song.");
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
      showCorrectAnswerAndNextSong();
    }
  };

  const handleGameOver = () => {
    setIsGameOver(true);
    updateFeedback("Game Over! Your score is saved.");
    setShowNameInput(true);
    resetAudio();
  };

  const showCorrectAnswerAndNextSong = () => {
    const primaryStyle = currentSong.style.split(",")[0].trim();
    updateFeedback(`Time's up! The correct answer was "${primaryStyle}".`);
    setTimeout(fetchRandomSong, 2500);
  };

  const handleGuess = () => {
    if (!guess.trim() || isGameOver) return;

    const acceptableStyles = currentSong.style.split(",").map((style) => style.trim().toLowerCase());

    if (acceptableStyles.includes(guess.trim().toLowerCase())) {
      updateFeedback("Correct!");
      setScore((prev) => prev + 1);
      resetAudio();
      setTimeout(fetchRandomSong, 750);
    } else {
      updateFeedback("Wrong! Try again.");
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
    <div className="w-screen h-screen flex flex-col justify-center items-center text-center bg-gradient-to-br from-[#3e1c5e] to-[#1a0c3e] p-5 overflow-hidden">
      <AnimatePresence mode="popLayout">
        {!isPlaying && !showNameInput && (
          <motion.div
            key="ready"
            className="flex flex-col justify-center items-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: 500 }}
            transition={{ ease: 'easeOut', duration: 0.3, type: "spring", stiffness: "50" }}
          >
            <h1 className="font-bold w-screen font-megrim text-[5rem] text-[#ffc107] drop-shadow-lg mb-5">
              Are you ready?
            </h1>
            <button className="px-10 py-4 rounded-full text-xl font-bold bg-[#333] text-[#f5f5f5] hover:bg-[#222] shadow-lg" onClick={startGame}>
              Begin
            </button>
          </motion.div>
        )}

        {isPlaying && !showNameInput && (
          <motion.div
            key="game"
            className="flex w-screen flex-col justify-center items-center text-[#e0e0e0]"
            initial={{ opacity: 0, x: -500 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 500 }}
            transition={{ ease: 'easeOut', duration: 0.3, type: "spring", stiffness: "50" }}
          >
            <h1 className="font-bold font-megrim text-[5rem] text-[#ffc107] drop-shadow-lg mb-5">Ballroom Music Quiz</h1>
            <button className="px-10 py-4 rounded-lg bg-[#8b0000] text-[#f5f5f5] shadow-lg mb-5" onClick={quitGame}>
              Quit Game
            </button>
            <p className="text-2xl font-bold">Score: {score}</p>
            {lives !== -1 && <p className="text-2xl font-bold mb-5">Lives: {lives}</p>}
            <div className="w-3/4 h-5 bg-[#333] rounded-md shadow-md overflow-hidden my-5">
              <div
                className="h-full bg-[#9b59b6] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xl font-bold mb-5">Time: {timer}s</p>
            {feedback && <p className="text-lg font-bold mb-5 text-[#ffc107]" >{feedback}</p>}
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter style..."
              className="text-lg border-2 border-[#333] rounded-md p-2 w-80 max-w-[400px] text-center bg-[#222] text-[#f5f5f5] outline-none"
            />
            <button className="mt-5 px-10 py-4 rounded-lg bg-[#333] text-[#f5f5f5] hover:bg-[#222] shadow-lg" onClick={handleGuess}>
              Submit
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {showNameInput && (
          <motion.div
            key="name"
            className="flex flex-col justify-center items-center bg-[#333] text-[#f5f5f5] p-10 rounded-lg shadow-lg"
            initial={{ opacity: 0, x: -500 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ease: 'easeOut', duration: 0.3, type: "spring", stiffness: "50" }}
          >
            <h2 className="text-2xl font-bold mb-5">Enter Your Name</h2>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={handlePopupKeyPress}
              placeholder="Your Name"
              className="text-lg border-2 border-[#333] rounded-md p-2 w-80 max-w-[400px] text-center bg-[#222] text-[#f5f5f5] outline-none"
            />
            <button
              onClick={submitScore}
              className="mt-5 px-10 py-4 rounded-lg bg-[#ffc107] text-[#333] hover:bg-[#e0b307] shadow-lg"
            >
              Submit
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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