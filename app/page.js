'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
// Removed motion imports for simplified animations
import { logPageView } from "../lib/analytics";

export default function Home() {
  const [clipDuration, setClipDuration] = useState(10);
  const [lives, setLives] = useState(-1);

  useEffect(() => {
    logPageView('home');
  }, []);

  return (
    <div className="min-h-screen w-screen flex flex-col px-5 py-10 overflow-y-auto" style={{ background: 'var(--primary-bg)' }}>
        <div className="grid grid-cols-1 gap-8 w-full max-w-[1400px] mx-auto md:grid-cols-2 md:gap-16">
          {/* Header */}
          <header className="text-center md:col-span-2">
            <h1 
              className="font-bold text-[3rem] md:text-[5rem]"
              style={{ color: 'var(--accent-gold)' }}
            >
              Ballroom Music Quiz
            </h1>
            <p 
              className="text-lg mt-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              Test your knowledge of ballroom dance music
            </p>
          </header>

          {/* Instructions */}
          <section 
            className="glass-card flex flex-col justify-center items-center p-8 gap-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--accent-gold)' }}>
                How to Play
              </h2>
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-gold)' }}></div>
                  <p style={{ color: 'var(--text-secondary)' }}>Listen to a clip of ballroom music</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-gold)' }}></div>
                  <p style={{ color: 'var(--text-secondary)' }}>Guess the correct dance style</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-gold)' }}></div>
                  <p style={{ color: 'var(--text-secondary)' }}>Score points for correct answers</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-gold)' }}></div>
                  <p style={{ color: 'var(--text-secondary)' }}>Beat the time limit to win</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
              <Link href="/browse">
                <button 
                  className="btn-secondary px-6 py-3 font-semibold"
                >
                  Browse Music
                </button>
              </Link>
              <Link href="/leaderboard">
                <button 
                  className="btn-secondary px-6 py-3 font-semibold"
                >
                  Leaderboard
                </button>
              </Link>
            </div>
          </section>

          {/* Settings */}
          <section 
            className="glass-card flex flex-col justify-center items-center p-8 gap-6"
          >
            <h2 className="text-2xl font-bold text-center" style={{ color: 'var(--accent-gold)' }}>
              Game Settings
            </h2>
            
            {/* Difficulty Settings */}
            <div className="w-full">
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>Difficulty Level</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 20, label: 'Easy', desc: '20s' },
                  { value: 10, label: 'Normal', desc: '10s' },
                  { value: 5, label: 'Hard', desc: '5s' }
                ].map(({ value, label, desc }) => (
                  <button
                    key={value}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                      clipDuration === value
                        ? 'glass-button'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                    onClick={() => setClipDuration(value)}
                  >
                    <div className="text-sm">{label}</div>
                    <div className="text-xs opacity-80">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Lives Settings */}
            <div className="w-full">
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>Lives Mode</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: -1, label: 'Endless', desc: '∞' },
                  { value: 3, label: '3 Lives', desc: '3' },
                  { value: 1, label: '1 Life', desc: '1' }
                ].map(({ value, label, desc }) => (
                  <button
                    key={value}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                      lives === value
                        ? 'glass-button'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                    onClick={() => setLives(value)}
                  >
                    <div className="text-sm">{label}</div>
                    <div className="text-xs opacity-80">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Start Game Button */}
            <div className="w-full mt-6">
              <Link href={`/game?duration=${clipDuration}&lives=${lives}`}>
                <button 
                  className="btn-primary w-full py-4 text-lg font-bold"
                >
                  Start Game
                </button>
              </Link>
            </div>
          </section>
        </div>
    </div>
  );
}
