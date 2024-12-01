'use client';
import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const [clipDuration, setClipDuration] = useState(10);
  const [lives, setLives] = useState(-1);

  return (
    <div
      style={{
        ...styles.container,
        background: `linear-gradient(135deg, ${COLORS.backgroundGradientStart} 0%, ${COLORS.backgroundGradientEnd} 100%)`,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="ready"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ ease: "easeOut", duration: 0.4 }}
          style={styles.gridContainer}
        >
          {/* Header */}
          <header style={styles.header}>
            <h1 style={{ ...styles.title, color: COLORS.correctText }}>
              Ballroom Music Quiz
            </h1>
          </header>

          {/* Instructions */}
          <section style={styles.instructions}>
            <p style={styles.settingsTitle}>Don&apos;t know how to play?</p>
            <ul>
              <li>♫ You&apos;ll hear a clip of a song from any ballroom style ♫</li>
              <li>💭 Guess the correct dance style associated with the song 💭</li>
              <li>✰ Score points for every correct answer within the time limit ✰</li>
              <li>✖ Lose lives when you don&apos;t guess the style in time ✖</li>
            </ul>
            <div style={styles.buttonContainer}>
              <Link href="/leaderboard">
                <button
                  style={{
                    ...styles.button,
                    backgroundColor: COLORS.buttonBackground,
                    color: COLORS.buttonText,
                  }}
                >
                  View Leaderboard
                </button>
              </Link>
            </div>
          </section>

          {/* Settings */}
          <section style={styles.settings}>
            <p style={styles.settingsTitle}>Choose Settings:</p>
            <div style={styles.toggleContainer}>
              <button
                style={{
                  ...styles.toggleButton,
                  backgroundColor: clipDuration === 20 ? COLORS.buttonBackground : "#222",
                }}
                onClick={() => setClipDuration(20)}
              >
                Easy
              </button>
              <button
                style={{
                  ...styles.toggleButton,
                  backgroundColor: clipDuration === 10 ? COLORS.buttonBackground : "#222",
                }}
                onClick={() => setClipDuration(10)}
              >
                Normal
              </button>
              <button
                style={{
                  ...styles.toggleButton,
                  backgroundColor: clipDuration === 5 ? COLORS.buttonBackground : "#222",
                }}
                onClick={() => setClipDuration(5)}
              >
                Hard
              </button>
            </div>
            <div style={styles.toggleContainer}>
              <button
                style={{
                  ...styles.toggleButton,
                  backgroundColor: lives === -1 ? COLORS.buttonBackground : "#222",
                }}
                onClick={() => setLives(-1)}
              >
                Endless
              </button>
              <button
                style={{
                  ...styles.toggleButton,
                  backgroundColor: lives === 3 ? COLORS.buttonBackground : "#222",
                }}
                onClick={() => setLives(3)}
              >
                3 Lives
              </button>
              <button
                style={{
                  ...styles.toggleButton,
                  backgroundColor: lives === 1 ? COLORS.buttonBackground : "#222",
                }}
                onClick={() => setLives(1)}
              >
                1 Life
              </button>
            </div>
            <div style={styles.buttonContainer}>
              <Link href={`/game?duration=${clipDuration}&lives=${lives}`}>
                <button
                  style={{
                    ...styles.button,
                    backgroundColor: COLORS.headerText,
                    color: COLORS.buttonText,
                  }}
                >
                  Start Game
                </button>
              </Link>
            </div>
          </section>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const COLORS = {
  backgroundGradientStart: "#3e1c5e",
  backgroundGradientEnd: "#1a0c3e",
  correctText: "#ffc107",
  headerText: "#9b59b6",
  textPrimary: "#e0e0e0",
  buttonBackground: "#333",
  buttonHover: "#222",
  buttonText: "#f5f5f5",
};

const styles = {
  container: {
    fontFamily: "Lato, sans-serif",
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    boxSizing: "border-box",
    position: "relative",
  },
  gridContainer: {
    justifyContent: "center",
    alignItems: "center",
    display: "grid",
    gridTemplateRows: "auto 1fr 1fr auto",
    gridTemplateColumns: "1fr 1fr",
    gap: "100px",
    width: "100%",
    maxWidth: "1200px",
    padding: "20px",
    boxSizing: "border-box",
  },
  header: {
    gridColumn: "1 / -1",
    textAlign: "center",
    marginBottom: "-30px",
    marginTop: "100px",
  },
  title: {
    fontWeight: "bold",
    fontFamily: "Megrim",
    fontSize: "5rem",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
  },
  instructions: {
    gridColumn: "1 / 2",
    fontSize: "1.1rem",
    lineHeight: "1.8",
    color: COLORS.textPrimary,
    padding: "20px",
    border: "1px solid #ffc107",
    borderRadius: "8px",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    height: "100%",
    boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
  },
  settings: {
    gridColumn: "2 / 3",
    padding: "20px",
    border: "1px solid #ffc107",
    borderRadius: "8px",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
    height: "100%",
    boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
  },
  settingsTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.textPrimary,
    marginBottom: "10px", // Space between title and toggles
  },
  toggleContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px", // Ensures even spacing between toggle buttons
    marginBottom: "10px",
  },
  toggleButton: {
    flex: "0 0 auto", // Prevents the button from stretching or shrinking
    whiteSpace: "nowrap", // Ensures text does not wrap
    padding: "15px 20px", // Adjust padding for a better fit
    fontSize: "1rem",
    color: COLORS.textPrimary,
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    textAlign: "center", // Centers text within the button
  },  
  button: {
    padding: "15px 30px",
    borderRadius: "10px",
    fontSize: "1.2rem",
    border: "none",
    cursor: "pointer",
    transition: "transform 0.2s ease", // Subtle hover effect
    boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
    "@media (maxWidth: 768px)": {
      padding: "10px 15px", // Mobile
      fontSize: "1rem",
    },
  },
};