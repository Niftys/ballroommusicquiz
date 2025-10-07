import React, { useRef, useState } from "react";
// Removed motion imports for simplified animations

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
    <div
      className="fixed bottom-0 left-0 w-full glass-card text-white p-4 shadow-lg"
    >
      <audio ref={audioRef} src={url} onTimeUpdate={handleTimeUpdate} />

      <div className="flex flex-col items-center space-y-3">
        <div className="text-center">
          <h2 className="text-lg font-bold text-white">
            {fileName}
          </h2>
          <p className="text-sm text-white/70">{style}</p>
        </div>
        <div className="flex items-center space-x-4 w-full max-w-md">
          <button
            onClick={handlePlayPause}
            className="btn-primary px-4 py-2 flex items-center gap-2"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, var(--accent-blue) 0%, var(--accent-blue) ${progress}%, rgba(255,255,255,0.2) ${progress}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
