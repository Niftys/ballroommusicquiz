'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

const COLORS = {
  backgroundGradientStart: "#3e1c5e",
  backgroundGradientEnd: "#1a0c3e",
  textPrimary: "#e0e0e0",
  progressBar: "#28a745",
  correct: "#ffc107",
  incorrect: "#dc3545",
  buttonBackground: "#333",
  buttonHover: "#444",
};

export default function Game() {
  const searchParams = useSearchParams();
  const clipDuration = parseInt(searchParams.get('duration'), 10) || 10; // Default to 10 seconds

  const [currentSong, setCurrentSong] = useState(null);
  const [timer, setTimer] = useState(clipDuration);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [progress, setProgress] = useState(100);
  const [guess, setGuess] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedbackColor, setFeedbackColor] = useState(COLORS.textPrimary);

  const audioRef = useRef(null);

  const fetchRandomSong = useCallback(async () => {
    try {
      const response = await fetch('/api/get-random-song');
      if (!response.ok) throw new Error('Failed to fetch song.');
      const song = await response.json();

      const startTime = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
      setCurrentSong({ ...song, startTime });

      setTimer(clipDuration);
      setProgress(100);
      setFeedback('');
      setFeedbackColor(COLORS.textPrimary);
      setGuess('');

      if (audioRef.current) {
        audioRef.current.src = song.url;
        audioRef.current.currentTime = startTime;
        await audioRef.current.play().catch((error) =>
          console.error('Audio playback error:', error)
        );
      }
    } catch (error) {
      console.error('Error fetching song:', error);
    }
  }, [clipDuration]);

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
          setFeedback('Time\'s up!');
          setFeedbackColor(COLORS.incorrect);
          fetchRandomSong();
        }
      }, 100);

      return () => clearInterval(timerInterval);
    }
  }, [currentSong, clipDuration, fetchRandomSong]);

  const handleGuess = () => {
    if (!guess.trim()) return;

    if (guess.toLowerCase() === currentSong.style.toLowerCase()) {
      setFeedback('Correct!');
      setFeedbackColor(COLORS.correct);
      setScore((prev) => prev + 1);
      fetchRandomSong();
    } else {
      setFeedback('Wrong! Try again.');
      setFeedbackColor(COLORS.incorrect);
    }

    setGuess('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGuess();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        padding: '20px',
        background: `linear-gradient(135deg, ${COLORS.backgroundGradientStart} 0%, ${COLORS.backgroundGradientEnd} 100%)`,
      }}
    >
      {!isPlaying ? (
        <>
          <h1 style={{ fontSize: '3rem', color: COLORS.textPrimary }}>Are you ready?</h1>
          <button
            style={{
              padding: '15px 30px',
              fontSize: '1.5rem',
              backgroundColor: COLORS.buttonBackground,
              color: COLORS.textPrimary,
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
            onClick={startGame}
          >
            Begin
          </button>
        </>
      ) : (
        <>
          <h1 style={{ fontSize: '3rem', color: COLORS.textPrimary }}>Ballroom Music Quiz</h1>
          <p style={{ fontSize: '1.5rem', color: COLORS.textPrimary }}>Score: {score}</p>

          <div style={{
            width: '80%',
            height: '20px',
            backgroundColor: '#ddd',
            borderRadius: '10px',
            overflow: 'hidden',
            margin: '20px 0',
          }}>
            <div
              style={{
                height: '100%',
                backgroundColor: COLORS.progressBar,
                width: `${progress}%`,
                transition: 'width 0.1s linear',
              }}
            />
          </div>

          <p style={{ fontSize: '1.5rem', color: feedbackColor }}>{`Time Remaining: ${timer}s`}</p>

          {feedback && (
            <p style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: feedbackColor,
              transition: 'color 0.5s ease',
            }}>
              {feedback}
            </p>
          )}

          <input
            type="text"
            placeholder="Enter dance style..."
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              fontSize: '1.2rem',
              padding: '10px',
              margin: '10px 0',
              border: '2px solid #ccc',
              borderRadius: '5px',
              width: '80%',
              textAlign: 'center',
              backgroundColor: '#fff',
              color: '#000',
            }}
          />
          <button
            onClick={handleGuess}
            style={{
              padding: '10px 20px',
              fontSize: '1.2rem',
              backgroundColor: COLORS.buttonBackground,
              color: COLORS.textPrimary,
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px',
              transition: 'background-color 0.3s ease',
            }}
          >
            Submit Guess
          </button>

          <audio ref={audioRef} style={{ display: 'none' }} />
        </>
      )}
    </div>
  );
}