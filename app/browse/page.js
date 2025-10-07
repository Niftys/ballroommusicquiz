'use client';
import React, { useState, useEffect } from "react";
// Removed motion imports for simplified animations
import { logPageView, logMusicPlay } from "../../lib/analytics";

export default function Browse() {
  const [musicFiles, setMusicFiles] = useState({});
  const [selectedGenre, setSelectedGenre] = useState(null); // Track selected genre
  const [selectedSong, setSelectedSong] = useState(null); // Currently playing song
  const [currentSongInfo, setCurrentSongInfo] = useState({ genre: "", file: "" }); // Info for "Now Playing"
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar toggle for mobile
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false); // Minimize toggle for Now Playing
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    logPageView('browse');
    
    const fetchMusicFiles = async () => {
      try {
        console.log("Fetching music files...");
        setIsLoading(true);
        const response = await fetch("/api/get-music-files");
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setMusicFiles(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch music files:", error);
        // Set empty object to prevent crashes
        setMusicFiles({});
        setIsLoading(false);
      }
    };
    
    fetchMusicFiles();
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
    
    // Log music play event
    logMusicPlay(genre, fileName);
  };

  const capitalizeWords = (str) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <div className="min-h-screen w-screen flex text-white" style={{ background: 'var(--primary-bg)' }}>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden btn-secondary px-4 py-2 m-3 absolute top-0 left-0 z-10"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        {isSidebarOpen ? "Hide Genres" : "Show Genres"}
      </button>

      {/* Sidebar: Genres */}
      {isSidebarOpen && (
        <div className="w-screen md:w-1/3 p-6 overflow-y-auto scrollbar-thin h-screen">
          <div className="glass-card p-6">
            <h2 className="font-bold text-2xl mb-6" style={{ color: 'var(--accent-gold)' }}>Music Genres</h2>
            <ul className="space-y-3">
              {Object.keys(musicFiles).map((genre) => {
                  const displayName = capitalizeWords(genre.split(",")[0].trim());
                  return (
                  <li
                      key={genre}
                      className={`cursor-pointer p-4 rounded-lg transition-all ${
                      selectedGenre === genre
                          ? "glass-button text-white"
                          : "bg-white/10 text-white/80 hover:bg-white/20"
                      }`}
                      onClick={() => handleSelectGenre(genre)}
                  >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-gold)' }}></div>
                        <span className="font-semibold">{displayName}</span>
                      </div>
                  </li>
                  );
              })}
              </ul>
          </div>
        </div>
      )}

      {/* Main Content: Songs */}
      <div className="flex-1 p-6 overflow-y-auto scrollbar-thin h-screen">
        <div className="glass-card p-6">
          <h2 className="font-bold text-2xl mb-6" style={{ color: 'var(--accent-gold)' }}>
          {isLoading 
            ? "Loading Music..." 
            : selectedGenre
              ? `${capitalizeWords(selectedGenre.split(",")[0].trim())} Songs`
              : "Select a Genre"}
          </h2>
          {selectedGenre ? (
            <div className="space-y-4">
              {musicFiles[selectedGenre] && musicFiles[selectedGenre].length > 0 ? (
                musicFiles[selectedGenre].map((songUrl, index) => {
                    const fileName = decodeURIComponent(songUrl.split("/").pop()).replace(/\.[^/.]+$/, "");
                    return (
                    <div
                      key={songUrl}
                      className="bg-white/5 border border-white/10 p-4 rounded-lg flex justify-between items-center hover:bg-white/10 transition-all"
                      style={{ minHeight: '60px' }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-black font-bold" style={{ background: 'var(--accent-gold)' }}>
                          ♫
                        </div>
                        <span className="font-semibold text-white">{fileName}</span>
                      </div>
                      <button
                        className="bg-yellow-500 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-400 transition-colors"
                        onClick={() => handlePlaySong(selectedGenre, songUrl)}
                      >
                        Play
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/70">No songs found for this genre</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 animate-pulse" style={{ background: 'var(--accent-gold)' }}>
                    ♫
                  </div>
                  <p className="text-white/70 text-lg">Loading music files...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4" style={{ background: 'var(--accent-gold)' }}>
                    ♫
                  </div>
                  <p className="text-white/70 text-lg">Choose a genre from the sidebar to browse songs</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Now Playing */}
      {selectedSong && (
            <div
            className={`fixed bottom-7 md:bottom-10 inset-x-0 md:w-3/4 m-auto glass-card text-white shadow-lg ${
                isPlayerMinimized ? "h-[60px]" : "h-[120px]"
            }`}
            >
            <div className="flex items-center justify-between p-4">
                <div className="flex-1">
                    {!isPlayerMinimized && (
                        <div className="mb-3">
                            <span className="block text-sm text-white/70">Now Playing</span>
                            <span className="block font-bold text-lg">{currentSongInfo.file}</span>
                            <span className="block text-sm text-white/70">
                            {capitalizeWords(currentSongInfo.genre.split(",")[0].trim())}
                            </span>
                        </div>
                    )}
                    
                    <audio
                        controls
                        src={selectedSong}
                        autoPlay
                        className="w-full h-[40px] px-3 rounded-lg"
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)'
                        }}
                    >
                        Your browser does not support the audio element.
                    </audio>
                </div>
                
                <button
                    className="ml-4 px-3 py-1 text-sm btn-secondary flex-shrink-0"
                    onClick={() => setIsPlayerMinimized((prev) => !prev)}
                >
                    {isPlayerMinimized ? "▲" : "▼"}
                </button>
            </div>
            </div>
        )}
    </div>
  );
}
