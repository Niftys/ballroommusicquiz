'use client';
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Browse() {
  const [musicFiles, setMusicFiles] = useState({});
  const [selectedGenre, setSelectedGenre] = useState(null); // Track selected genre
  const [selectedSong, setSelectedSong] = useState(null); // Currently playing song
  const [currentSongInfo, setCurrentSongInfo] = useState({ genre: "", file: "" }); // Info for "Now Playing"
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar toggle for mobile
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false); // Minimize toggle for Now Playing

  useEffect(() => {
    fetch("/api/get-music-files")
      .then((res) => res.json())
      .then((data) => setMusicFiles(data))
      .catch((error) => console.error("Failed to fetch music files:", error));
  }, []);

  const handleSelectGenre = (genre) => {
    setSelectedGenre(genre); // Set the selected genre
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false); // Close sidebar on mobile after selecting a genre
    }
  };

  const handlePlaySong = (genre, songUrl) => {
    setSelectedSong(songUrl); // Use the song URL directly
    const fileName = decodeURIComponent(songUrl.split("/").pop()).replace(/\.[^/.]+$/, ""); // Extract filename
    setCurrentSongInfo({ genre, file: fileName }); // Update "Now Playing" info
  };

  const capitalizeWords = (str) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#355262] to-[#1a0c3e] text-[#e0e0e0]">
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden px-4 py-2 bg-[#1F5E80] text-[#f5f5f5] rounded hover:bg-[#97770a] transition m-3"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        {isSidebarOpen ? "Hide Genres" : "Show Genres"}
      </button>

      {/* Sidebar: Genres */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ease: "easeOut" }}
          className="w-full md:w-1/3 p-5 border-r border-[#ffc107] overflow-y-auto scrollbar-thin"
        >
          <h2 className="font-bold text-xl text-[#ffc107] mb-5">Genres</h2>
          <ul className="space-y-3">
            {Object.keys(musicFiles).map((genre, index) => {
                const displayName = capitalizeWords(genre.split(",")[0].trim()); // First genre only
                return (
                <motion.li
                    key={genre}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`cursor-pointer p-3 rounded-md ${
                    selectedGenre === genre
                        ? "bg-blue-500/50 text-white"
                        : "bg-black/10 hover:bg-black/20"
                    }`}
                    onClick={() => handleSelectGenre(genre)}
                >
                    {displayName}
                </motion.li>
                );
            })}
            </ul>
        </motion.div>
      )}

      {/* Main Content: Songs */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 p-5 overflow-y-auto"
        transition={{ ease: "easeOut" }}
      >
        <h2 className="font-bold text-xl text-[#ffc107] mb-5">
        {selectedGenre
            ? `${capitalizeWords(selectedGenre.split(",")[0].trim())} Songs` // First genre only
            : "Select a Genre"}
        </h2>
        {selectedGenre ? (
          <ul className="space-y-3">
            {musicFiles[selectedGenre]?.map((songUrl, index) => {
              const fileName = decodeURIComponent(songUrl.split("/").pop()).replace(/\.[^/.]+$/, "");
              return (
                <motion.li
                  key={songUrl}
                  className="flex justify-between items-center p-3 rounded-md bg-black/10 hover:bg-black/20"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }} // Staggered animation
                >
                  <span>{fileName}</span>
                  <button
                    className="px-3 py-1 bg-[#1F5E80] text-[#f5f5f5] rounded hover:bg-[#97770a] transition"
                    onClick={() => handlePlaySong(selectedGenre, songUrl)}
                  >
                    Play
                  </button>
                </motion.li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-400">No genre selected. Choose a genre from the left.</p>
        )}
      </motion.div>

      {/* Now Playing */}
      <AnimatePresence>
        {selectedSong && (
            <motion.div
            className={`fixed bottom-0 md:bottom-5 inset-x-0 md:w-3/4 m-auto bg-[#333] bg-opacity-50 text-[#f5f5f5] shadow-lg ${
                isPlayerMinimized ? "h-[40px]" : "h-[120px]"
            }`}
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: "0%" }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.5, type: "spring", stiffness: 50 }}
            >
            <button
                className="absolute top-0 right-0 px-2 py-1 text-sm bg-[#000] bg-opacity-20 text-white rounded hover:bg-[#97770a]"
                onClick={() => setIsPlayerMinimized((prev) => !prev)}
            >
                {isPlayerMinimized ? "▲" : "▼"}
            </button>

            {!isPlayerMinimized && (
                <div className="p-3 flex flex-col md:items-center md:justify-between text-center">
                <div>
                    <span className="block text-sm text-gray-400">Now Playing: </span>
                    <span className="block font-bold md:text-lg">{currentSongInfo.file}</span>
                    <span className="block text-sm text-gray-400">
                    {capitalizeWords(currentSongInfo.genre.split(",")[0].trim())} {/* First genre only */}
                    </span>
                </div>
                </div>
            )}

            <audio
                controls
                src={selectedSong}
                autoPlay
                className="w-full h-[40px] px-3"
            >
                Your browser does not support the audio element.
            </audio>
            </motion.div>
        )}
        </AnimatePresence>
    </div>
  );
}
