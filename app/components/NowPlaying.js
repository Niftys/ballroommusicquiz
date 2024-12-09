import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function NowPlaying({ song }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleSeek = (e) => {
    if (audioRef.current) {
      const newTime = (parseFloat(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  if (!song) {
    return null; // Don't render anything if no song is provided
  }

  const { url, style } = song; // Destructure song object
  const fileName = url.split("/").pop().replace(/\.[^/.]+$/, ""); // Remove file extension

  return (
    <motion.div
      className="fixed bottom-0 left-0 w-full bg-[#333] text-[#f5f5f5] p-3 shadow-lg"
      initial={{ y: "100%" }}
      animate={{ y: song ? "0%" : "100%" }}
    >
      <audio ref={audioRef} src={url} onTimeUpdate={handleTimeUpdate} />

      <div className="flex flex-col items-center space-y-2">
        <h2 className="text-lg font-bold">
          Now Playing: {fileName}
        </h2>
        <p className="text-sm text-gray-400">{style}</p>
        <div className="flex items-center space-x-3 w-full">
          <button
            onClick={handlePlayPause}
            className="px-4 py-2 bg-[#1F5E80] text-[#f5f5f5] rounded hover:bg-[#97770a] transition"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="w-full"
          />
        </div>
      </div>
    </motion.div>
  );
}
