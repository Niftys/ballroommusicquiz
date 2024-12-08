'use client';
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Browse() {
  const [musicFiles, setMusicFiles] = useState({});
  const [selectedFolder, setSelectedFolder] = useState(null); // Track selected folder
  const [selectedSong, setSelectedSong] = useState(null); // Currently playing song
  const [currentSongInfo, setCurrentSongInfo] = useState({ folder: "", file: "" }); // Info for "Now Playing"
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar toggle for mobile
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false); // Minimize toggle for Now Playing

  useEffect(() => {
    fetch("/api/get-music-files")
      .then((res) => res.json())
      .then((data) => setMusicFiles(data))
      .catch((error) => console.error("Failed to fetch music files:", error));
  }, []);

  const handleSelectFolder = (folder) => {
    setSelectedFolder(folder); // Set the selected folder
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false); // Close sidebar on mobile after selecting a folder
    }
  };

  const handlePlaySong = (folder, file) => {
    const filePath = `/audio/${folder}/${file}`;
    setSelectedSong(filePath);
    setCurrentSongInfo({ folder, file }); // Update "Now Playing" info
  };

  // Helper function to capitalize the first letter of each word
  const capitalizeWords = (str) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toLocaleUpperCase() + word.slice(1))
      .join(" ");

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#355262] to-[#1a0c3e] text-[#e0e0e0]">
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden px-4 py-2 bg-[#1F5E80] text-[#f5f5f5] rounded hover:bg-[#97770a] transition m-3"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        {isSidebarOpen ? "Hide Folders" : "Show Folders"}
      </button>

      {/* Sidebar: Folders */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ease: "easeOut" }}
          className="w-full md:w-1/3 p-5 border-r border-[#ffc107] overflow-y-auto scrollbar-thin"
        >
          <h2 className="font-bold text-xl text-[#ffc107] mb-5">Folders</h2>
          <ul className="space-y-3">
            {Object.keys(musicFiles).map((folder, index) => {
              const displayName = capitalizeWords(folder.split(",")[0].trim()); // Capitalize the folder name
              return (
                <motion.li
                  key={folder}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }} // Staggered animation using index
                  className={`cursor-pointer p-3 rounded-md ${
                    selectedFolder === folder
                      ? "bg-blue-500/50 text-white"
                      : "bg-black/10 hover:bg-black/20"
                  }`}
                  onClick={() => handleSelectFolder(folder)}
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
          {selectedFolder
            ? `${capitalizeWords(selectedFolder.split(",")[0].trim())} Songs`
            : "Select a Folder"}
        </h2>
        {selectedFolder ? (
          <ul className="space-y-3">
            {musicFiles[selectedFolder].map((file, index) => {
              const fileNameWithoutExtension = file.replace(/\.[^/.]+$/, ""); // Remove file extension
              return (
                <motion.li
                  key={file}
                  className="flex justify-between items-center p-3 rounded-md bg-black/10 hover:bg-black/20"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }} // Staggered animation
                >
                  <span>{fileNameWithoutExtension}</span>
                  <button
                    className="px-3 py-1 bg-[#1F5E80] text-[#f5f5f5] rounded hover:bg-[#97770a] transition"
                    onClick={() => handlePlaySong(selectedFolder, file)}
                  >
                    Play
                  </button>
                </motion.li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-400">No folder selected. Choose a folder from the left.</p>
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
            {/* Minimize/Expand Button */}
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
                  <span className="block font-bold md:text-lg">
                    {capitalizeWords(currentSongInfo.file.replace(/\.[^/.]+$/, " "))}
                  </span>
                  <span className="block text-sm text-gray-400">
                    {capitalizeWords(currentSongInfo.folder.split(",")[0].trim())}
                  </span>
                </div>
              </div>
            )}

            {/* Audio Player */}
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
