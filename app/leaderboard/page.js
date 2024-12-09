'use client';
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
    <div className="flex flex-col items-center min-h-screen w-screen bg-gradient-to-br from-[#355262] to-[#1a0c3e] p-5">
      <AnimatePresence mode="wait">
        <motion.div
          className="flex flex-col items-center w-full text-center"
          key="ready"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{
            ease: "easeOut",
            duration: 0.2,
            type: "spring",
            stiffness: "50",
          }}
        >
          <h1 className="font-megrim text-[3.5rem] font-bold text-[#4db6e1] mb-5 drop-shadow-lg">
            Leaderboard
          </h1>

          {/* Filters */}
          <div className="flex gap-5 mb-7 flex-wrap justify-center">
            <div>
              <label className="mr-2 text-[#e0e0e0]">Lives:</label>
              <select
                className="p-2 bg-[#2b3e48] text-[#e0e0e0] border border-[#3b8ca8] rounded"
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
              <label className="mr-2 text-[#e0e0e0]">Difficulty:</label>
              <select
                className="p-2 bg-[#2b3e48] text-[#e0e0e0] border border-[#3b8ca8] rounded"
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

          {/* Table */}
          <div className="w-full flex justify-center">
            <table className="w-4/5 max-w-[1000px] text-[#e0e0e0] bg-opacity-0 border-collapse shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-[#3b8ca8]">
                  <th className="p-3 font-bold text-center uppercase">Rank</th>
                  <th className="p-3 font-bold text-center uppercase">Name</th>
                  <th className="p-3 font-bold text-center uppercase">Score</th>
                  <th className="p-3 font-bold text-center uppercase">Lives</th>
                  <th className="p-3 font-bold text-center uppercase">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {filteredScores.length > 0 ? (
                  filteredScores.map((score, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 20 }} // Start hidden and slightly below
                      animate={{ opacity: 1, y: 0 }} // Fade in and move into place
                      transition={{ duration: 0.3, delay: index * 0.1 }} // Staggered animation
                      className={`${
                        index % 2 === 0 ? "bg-[#28464d]" : "bg-[#1c3139]"
                      }`}
                    >
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{score.name}</td>
                      <td className="p-3">{score.score}</td>
                      <td className="p-3">
                        {score.lives === -1 ? "Endless" : score.lives}
                      </td>
                      <td className="p-3">{getDifficultyLevel(score.duration)}</td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td colSpan="5" className="p-5 text-center text-[#e0e0e0]">
                      No scores match your filters.
                    </td>
                  </motion.tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
