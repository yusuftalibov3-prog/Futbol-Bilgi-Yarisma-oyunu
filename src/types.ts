export interface Question {
  id: string;
  question: string;
  options: {
    left: string;
    right: string;
  };
  correctOption: 'left' | 'right';
  difficulty: 1 | 2 | 3;
}

export interface Player {
  x: number; // Continuous horizontal track position (-1.5 to 1.5)
  targetX: number; // For smooth interpolation
  z: number; // Continuous forward distance
  speed: number; // Current Z-velocity (units/sec)
  baseSpeed: number; // Normal running speed for current level
  color: string; // Tail-glow color selected in menu
}

export interface GameGate {
  id: string;
  z: number; // Distance along track has to be behind or in front of player
  question: Question;
  leftOption: string;
  rightOption: string;
  correctOption: 'left' | 'right';
  answered: boolean;
  chosenSide: 'left' | 'right' | null;
  isCorrect: boolean | null;
}

export interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  color: string;
  size: number;
  life: number; // 0 to 1
  maxLife: number;
}

export interface RunHistory {
  score: number;
  level: number;
  correctAnswers: number;
  totalQuestions: number;
  maxCombo: number;
  distance: number;
  date: string;
}

export type GameStatus = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAMEOVER' | 'VICTORY';
