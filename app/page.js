'use client';
import Link from "next/link";
import React, { useState } from "react";

const COLORS = {
  backgroundGradientStart: "#3e1c5e",
  backgroundGradientEnd: "#1a0c3e",
  headerText: "#9b59b6", // Primary color (purple)
  textPrimary: "#e0e0e0", // Light text
  listText: "#e0e0e0", // Same as text color
  buttonBackground: "#333", // Dark button background
  buttonHover: "#444", // Hover effect for buttons
  buttonText: "#f5f5f5", // Light text for buttons
};

export default function Home() {
  const [clipDuration, setClipDuration] = useState(10); // Default to 10 seconds

  return (
    <div
      style={{
        ...styles.container,
        background: `linear-gradient(135deg, ${COLORS.backgroundGradientStart} 0%, ${COLORS.backgroundGradientEnd} 100%)`,
      }}
    >
      <h1 style={{ ...styles.header, color: COLORS.headerText }}>
        Ballroom Music Quiz
      </h1>
      <p style={styles.instructions}>
        Welcome to the Ballroom Music Quiz! Here&#39;s how to play:
      </p>
      <ul style={styles.list}>
        <li>You&#39;ll hear a 10-second or 5-second clip of a ballroom dance song.</li>
        <li>Guess the correct dance style associated with the song.</li>
        <li>Score points for every correct answer within the time limit.</li>
      </ul>
      <p style={styles.instructions}>
        Choose the clip duration before starting the game:
      </p>
      <div style={styles.toggleContainer}>
        <button
          style={{
            ...styles.toggleButton,
            backgroundColor: clipDuration === 5 ? COLORS.buttonBackground : "#555",
          }}
          onClick={() => setClipDuration(5)}
        >
          5 Seconds
        </button>
        <button
          style={{
            ...styles.toggleButton,
            backgroundColor: clipDuration === 10 ? COLORS.buttonBackground : "#555",
          }}
          onClick={() => setClipDuration(10)}
        >
          10 Seconds
        </button>
      </div>
      <Link href={`/game?duration=${clipDuration}`}>
        <button
          style={{
            ...styles.button,
            backgroundColor: COLORS.buttonBackground,
            color: COLORS.buttonText,
            boxShadow: `0 0 20px ${COLORS.buttonBackground}`,
          }}
        >
          Start Game
        </button>
      </Link>
    </div>
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
    textShadow: "2px 2px 4px rgba(255, 255, 255, 0.2)",
  },
  instructions: {
    fontSize: "1.2rem",
    marginBottom: "20px",
    lineHeight: "1.8",
    color: COLORS.textPrimary,
  },
  list: {
    textAlign: "left",
    listStyleType: "disc",
    margin: "10px 0",
    padding: "0 30px",
    fontSize: "1.2rem",
    color: COLORS.listText,
  },
  toggleContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  toggleButton: {
    padding: "10px 20px",
    fontSize: "1rem",
    color: COLORS.buttonText,
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  button: {
    fontSize: "1.5rem",
    padding: "15px 30px",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    marginTop: "30px",
    transition: "all 0.3s ease",
  },
};