'use client';
import React, { useState, useEffect } from "react";
// Removed motion imports for simplified animations
import { logPageView } from "../../lib/analytics";

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
  const [selectedLives, setSelectedLives] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("all");

  useEffect(() => {
    logPageView('leaderboard');
    
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/get-leaderboard");
        const data = await response.json();
        setScores(data);
        setFilteredScores(data);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  useEffect(() => {
    let filtered = scores;

    if (selectedLives !== "all") {
      filtered = filtered.filter(
        (score) =>
          (selectedLives === "unlimited" && score.lives === -1) ||
          (selectedLives !== "unlimited" &&
            score.lives === parseInt(selectedLives, 10))
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
    <div className="flex flex-col items-center min-h-screen w-screen p-5" style={{ background: 'var(--primary-bg)' }}>
        <div
          className="flex flex-col items-center w-full max-w-6xl text-center"
        >
          <h1 
            className="text-5xl font-bold mb-8"
            style={{ color: 'var(--accent-gold)' }}
          >
            Leaderboard
          </h1>

          {/* Filters */}
          <div className="glass-card p-6 mb-8 w-full max-w-2xl">
            <div className="flex gap-6 flex-wrap justify-center">
              <div className="flex flex-col gap-2">
                <label className="font-semibold" style={{ color: 'var(--text-secondary)' }}>Lives Mode</label>
                <select
                  className="input-modern px-4 py-2"
                  value={selectedLives}
                  onChange={(e) => setSelectedLives(e.target.value)}
                >
                  <option value="all">All Modes</option>
                  <option value="unlimited">Endless</option>
                  <option value="3">3 Lives</option>
                  <option value="1">1 Life</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold" style={{ color: 'var(--text-secondary)' }}>Difficulty</label>
                <select
                  className="input-modern px-4 py-2"
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                >
                  <option value="all">All Levels</option>
                  <option value="20">Easy (20s)</option>
                  <option value="10">Normal (10s)</option>
                  <option value="5">Hard (5s)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="w-full">
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr style={{ background: 'var(--accent-gold)' }}>
                      <th className="p-4 font-bold text-center uppercase text-black">Rank</th>
                      <th className="p-4 font-bold text-center uppercase text-black">Player</th>
                      <th className="p-4 font-bold text-center uppercase text-black">Score</th>
                      <th className="p-4 font-bold text-center uppercase text-black">Mode</th>
                      <th className="p-4 font-bold text-center uppercase text-black">Difficulty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredScores.length > 0 ? (
                      filteredScores.map((score, index) => (
                        <tr
                          key={index}
                          className={`${
                            index % 2 === 0 ? "bg-white/5" : "bg-white/10"
                          } hover:bg-white/20 transition-colors`}
                        >
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-bold text-lg">#{index + 1}</span>
                            </div>
                          </td>
                          <td className="p-4 text-center font-semibold">{score.name}</td>
                          <td className="p-4 text-center">
                            <span className="font-bold text-xl" style={{ color: 'var(--accent-gold)' }}>
                              {score.score}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              score.lives === -1 
                                ? "bg-green-500/20 text-green-400" 
                                : "bg-blue-500/20 text-blue-400"
                            }`}>
                              {score.lives === -1 ? "Endless" : `${score.lives} Lives`}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              score.duration === 20 
                                ? "bg-green-500/20 text-green-400"
                                : score.duration === 10
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                            }`}>
                              {getDifficultyLevel(score.duration)}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-12 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl" style={{ background: 'var(--accent-gold)' }}>
                              📊
                            </div>
                            <p className="text-white/70 text-lg">No scores match your filters</p>
                            <p className="text-white/50">Try adjusting your filter settings</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
