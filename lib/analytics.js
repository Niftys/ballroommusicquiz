import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

// User interaction logging utility
export const logUserInteraction = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined' && analytics) {
    try {
      logEvent(analytics, eventName, {
        timestamp: new Date().toISOString(),
        ...parameters
      });
      console.log(`Analytics event logged: ${eventName}`, parameters);
    } catch (error) {
      console.error('Analytics logging error:', error);
    }
  }
};

// Specific event logging functions
export const logGameStart = (difficulty, lives) => {
  logUserInteraction('game_start', {
    difficulty: difficulty,
    lives: lives,
    game_mode: lives === -1 ? 'endless' : 'limited'
  });
};

export const logGameEnd = (score, difficulty, lives, duration) => {
  logUserInteraction('game_end', {
    final_score: score,
    difficulty: difficulty,
    lives: lives,
    duration: duration,
    game_mode: lives === -1 ? 'endless' : 'limited'
  });
};

export const logScoreSubmit = (score, playerName, difficulty, lives) => {
  logUserInteraction('score_submit', {
    score: score,
    player_name_length: playerName.length,
    difficulty: difficulty,
    lives: lives,
    game_mode: lives === -1 ? 'endless' : 'limited'
  });
};

export const logPageView = (pageName) => {
  logUserInteraction('page_view', {
    page: pageName,
    timestamp: new Date().toISOString()
  });
};

export const logMusicPlay = (genre, songName) => {
  logUserInteraction('music_play', {
    genre: genre,
    song_name: songName,
    timestamp: new Date().toISOString()
  });
};

export const logCorrectAnswer = (genre, timeRemaining, difficulty) => {
  logUserInteraction('correct_answer', {
    genre: genre,
    time_remaining: timeRemaining,
    difficulty: difficulty,
    timestamp: new Date().toISOString()
  });
};

export const logWrongAnswer = (userGuess, correctGenre, timeRemaining, difficulty) => {
  logUserInteraction('wrong_answer', {
    user_guess: userGuess,
    correct_genre: correctGenre,
    time_remaining: timeRemaining,
    difficulty: difficulty,
    timestamp: new Date().toISOString()
  });
};

export const logTimeUp = (correctGenre, difficulty) => {
  logUserInteraction('time_up', {
    correct_genre: correctGenre,
    difficulty: difficulty,
    timestamp: new Date().toISOString()
  });
};
