'use client';
import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const [clipDuration, setClipDuration] = useState(10);
  const [lives, setLives] = useState(-1);

  return (
    <div className="min-h-screen w-screen flex flex-col justify-start items-center bg-gradient-to-br from-[#3e1c5e] to-[#1a0c3e] px-5 py-10 overflow-y-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key="ready"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ ease: "easeOut", duration: 0.4 }}
          className="grid grid-cols-1 gap-5 w-full max-w-[1200px] p-5 md:grid-cols-2 md:gap-[100px]"
        >
          {/* Header */}
          <header className="text-center md:col-span-2">
            <h1 className="font-bold font-megrim text-[3rem] text-[#ffc107] drop-shadow-lg md:text-[5rem]">
              Ballroom Music Quiz
            </h1>
          </header>

          {/* Instructions */}
          <section className="flex flex-col justify-center items-center text-[#e0e0e0] border border-[#ffc107] rounded-lg bg-black/10 p-5 shadow-2xl gap-5">
            <p className="font-bold text-[1.2rem] text-center mb-2 md:text-[1.5rem]">
              Don&apos;t know how to play?
            </p>
            <ul className="space-y-3 text-center text-sm md:text-base">
              <li>♫ You&apos;ll hear a clip of a song from any ballroom style ♫</li>
              <li>💭 Guess the correct dance style associated with the song 💭</li>
              <li>✰ Score points for every correct answer within the time limit ✰</li>
              <li>✖ Lose lives when you don&apos;t guess the style in time ✖</li>
            </ul>
            <div className="flex justify-center mt-3">
              <Link href="/leaderboard">
                <button className="px-6 py-3 rounded-lg bg-[#333] text-[#f5f5f5] hover:bg-[#222] transition-all shadow-2xl">
                  View Leaderboard
                </button>
              </Link>
            </div>
          </section>

          {/* Settings */}
          <section className="flex flex-col justify-center items-center text-[#e0e0e0] border border-[#ffc107] rounded-lg bg-black/10 p-5 shadow-lg gap-4">
            <p className="font-bold text-[1.2rem] text-center mb-4 md:text-[1.5rem]">
              Choose Settings:
            </p>
            <div className="flex justify-center gap-3">
              <button
                className={`px-5 py-3 rounded-md ${
                  clipDuration === 20
                    ? "bg-[#333] text-[#f5f5f5]"
                    : "bg-[#222] text-[#e0e0e0]"
                }`}
                onClick={() => setClipDuration(20)}
              >
                Easy
              </button>
              <button
                className={`px-5 py-3 rounded-md ${
                  clipDuration === 10
                    ? "bg-[#333] text-[#f5f5f5]"
                    : "bg-[#222] text-[#e0e0e0]"
                }`}
                onClick={() => setClipDuration(10)}
              >
                Normal
              </button>
              <button
                className={`px-5 py-3 rounded-md ${
                  clipDuration === 5
                    ? "bg-[#333] text-[#f5f5f5]"
                    : "bg-[#222] text-[#e0e0e0]"
                }`}
                onClick={() => setClipDuration(5)}
              >
                Hard
              </button>
            </div>
            <div className="flex justify-center gap-3">
              <button
                className={`px-5 py-3 rounded-md ${
                  lives === -1
                    ? "bg-[#333] text-[#f5f5f5]"
                    : "bg-[#222] text-[#e0e0e0]"
                }`}
                onClick={() => setLives(-1)}
              >
                Endless
              </button>
              <button
                className={`px-5 py-3 rounded-md ${
                  lives === 3
                    ? "bg-[#333] text-[#f5f5f5]"
                    : "bg-[#222] text-[#e0e0e0]"
                }`}
                onClick={() => setLives(3)}
              >
                3 Lives
              </button>
              <button
                className={`px-5 py-3 rounded-md ${
                  lives === 1
                    ? "bg-[#333] text-[#f5f5f5]"
                    : "bg-[#222] text-[#e0e0e0]"
                }`}
                onClick={() => setLives(1)}
              >
                1 Life
              </button>
            </div>
            <div className="flex justify-center mt-5">
              <Link href={`/game?duration=${clipDuration}&lives=${lives}`}>
                <button className="px-6 py-3 rounded-lg bg-[#9b59b6] text-[#f5f5f5] hover:bg-[#222] transition-all shadow-md">
                  Start Game
                </button>
              </Link>
            </div>
          </section>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
