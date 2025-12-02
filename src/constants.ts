import { Tetromino, TetrominoType, Theme } from './types';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const TETROMINOS: Record<string, Tetromino> = {
  0: { shape: [[0]], color: '0', type: 'I' }, // Placeholder
  I: {
    shape: [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
    color: '#06b6d4', // cyan-500
    type: 'I',
  },
  J: {
    shape: [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
    color: '#3b82f6', // blue-500
    type: 'J',
  },
  L: {
    shape: [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    color: '#f97316', // orange-500
    type: 'L',
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#eab308', // yellow-500
    type: 'O',
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: '#22c55e', // green-500
    type: 'S',
  },
  T: {
    shape: [
      [1, 1, 1],
      [0, 1, 0],
      [0, 0, 0],
    ],
    color: '#a855f7', // purple-500
    type: 'T',
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: '#ef4444', // red-500
    type: 'Z',
  },
};

export const DEFAULT_THEME: Theme = {
  name: "Classic Neon",
  background: "linear-gradient(to bottom right, #111827, #0f172a)",
  boardBackground: "rgba(17, 24, 39, 0.9)",
  gridColor: "#374151",
  textColor: "#f3f4f6",
  accentColor: "#8b5cf6",
  pieceColors: {
    I: '#06b6d4',
    J: '#3b82f6',
    L: '#f97316',
    O: '#eab308',
    S: '#22c55e',
    T: '#a855f7',
    Z: '#ef4444',
  }
};

export const randomTetromino = (): Tetromino => {
  const tetrominos: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  const randTetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)];
  return TETROMINOS[randTetromino];
};