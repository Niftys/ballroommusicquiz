'use client';
import React, { useState, useEffect } from "react";

const COLORS = {
    backgroundGradientStart: "#3e1c5e",
    backgroundGradientEnd: "#1a0c3e",
    headerText: "#9b59b6", // Primary color (purple)
    textPrimary: "#e0e0e0", // Light text
    listText: "#e0e0e0", // Same as text color
    buttonBackground: "#333", // Dark button background
    buttonHover: "#222", // Hover effect for buttons
    buttonText: "#f5f5f5", // Light text for buttons
  };

  const getDifficultyLevel = (duration) => {
    switch (duration) {
      case 20:
        return "Easy";
      case 10:
        return "Normal";
      case 5:
        return "Hard";
      default:
        return "Unknown";
    }
  };

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [filteredScores, setFilteredScores] = useState([]);
  const [selectedLives, setSelectedLives] = useState("all"); // Default filter for lives
  const [selectedDuration, setSelectedDuration] = useState("all"); // Default filter for duration

  useEffect(() => {
    // Fetch leaderboard data from the backend
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/get-leaderboard");
        const data = await response.json();
        setScores(data);
        setFilteredScores(data); // Initially show all scores
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  useEffect(() => {
    // Filter scores based on selected lives and duration
    let filtered = scores;

    if (selectedLives !== "all") {
      filtered = filtered.filter(
        (score) =>
          (selectedLives === "unlimited" && score.lives === -1) ||
          (selectedLives !== "unlimited" && score.lives === parseInt(selectedLives, 10))
      );
    }

    if (selectedDuration !== "all") {
      filtered = filtered.filter(
        (score) => score.duration === parseInt(selectedDuration, 10)
      );
    }

    setFilteredScores(filtered);
  }, [selectedLives, selectedDuration, scores]);

  return (
    <div
      style={{
        ...styles.container,
        background: `linear-gradient(135deg, ${COLORS.backgroundGradientStart} 0%, ${COLORS.backgroundGradientEnd} 100%)`,
      }}
    >
      <h1 style={styles.header}>Leaderboard</h1>

      <div style={styles.filters}>
        <div>
          <label style={styles.label}>Filter by Lives: </label>
          <select
            style={styles.select}
            value={selectedLives}
            onChange={(e) => setSelectedLives(e.target.value)}
          >
            <option value="all">All</option>
            <option value="unlimited">Endless</option>
            <option value="3">3 Lives</option>
            <option value="1">1 Life</option>
          </select>
        </div>

        <div>
          <label style={styles.label}>Filter by Difficulty: </label>
          <select
            style={styles.select}
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value)}
          >
            <option value="all">All</option>
            <option value="20">Easy</option>
            <option value="10">Normal</option>
            <option value="5">Hard</option>
          </select>
        </div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Rank</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Score</th>
              <th style={styles.th}>Lives</th>
              <th style={styles.th}>Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {filteredScores.length > 0 ? (
              filteredScores.map((score, index) => (
                <tr key={index}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{score.name}</td>
                  <td style={styles.td}>{score.score}</td>
                  <td style={styles.td}>{score.lives === -1 ? "Endless" : score.lives}</td>
                  <td style={styles.td}>{getDifficultyLevel(score.duration)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={styles.noData}>
                  No scores match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center", // Center-align content
      width: "100%", // Make container full-width
      minHeight: "100vh",
      padding: "20px",
      textAlign: "center",
    },
    header: {
      fontSize: "3.5rem",
      fontWeight: "bold",
      marginBottom: "20px",
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
      color: COLORS.headerText,
    },
    filters: {
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      marginBottom: "20px",
    },
    label: {
      marginRight: "10px",
      fontSize: "1rem",
      color: COLORS.textPrimary,
    },
    select: {
      padding: "5px",
      fontSize: "1rem",
      backgroundColor: COLORS.buttonBackground,
      color: COLORS.textPrimary,
      border: "1px solid #ccc",
      borderRadius: "5px",
    },
    tableContainer: {
      marginTop: "20px",
      width: "100%",
      display: "flex",
      justifyContent: "center",
    },
    table: {
      margin: "auto",
      borderCollapse: "collapse",
      width: "80%",
      backgroundColor: COLORS.tableBackground,
    },
    th: {
      backgroundColor: COLORS.buttonBackground,
      color: COLORS.textPrimary,
      padding: "10px",
    },
    td: {
      padding: "10px",
      textAlign: "center",
    },
    noData: {
      padding: "10px",
      textAlign: "center",
      color: COLORS.textPrimary,
    },
  };