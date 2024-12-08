// 'components/NowPlaying.js'
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

  return (
    <motion.div
      className="fixed bottom-0 left-0 w-full bg-[#333] text-[#f5f5f5] p-3 shadow-lg"
      initial={{ y: "100%" }}
      animate={{ y: song ? "0%" : "100%" }}
    >
      {song && (
        <>
          <audio ref={audioRef} src={song} onTimeUpdate={handleTimeUpdate} />
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Now Playing: {song.split("/").pop()}</h2>
            <div className="flex items-center space-x-3">
              <button onClick={handlePlayPause}>
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
        </>
      )}
    </motion.div>
  );
}
