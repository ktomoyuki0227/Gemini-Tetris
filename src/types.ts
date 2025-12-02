export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export interface Tetromino {
  shape: number[][];
  color: string; // Tailwind color class or Hex
  type: TetrominoType;
}

export interface PlayerState {
  pos: { x: number; y: number };
  tetromino: Tetromino;
  collided: boolean;
}

export interface Cell {
  type: TetrominoType | '0';
  color: string;
  isLocked: boolean;
}

// 10 columns x 20 rows
export type Grid = Cell[][];

export interface Theme {
  name: string;
  background: string; // CSS background value (gradient or solid)
  boardBackground: string;
  gridColor: string;
  textColor: string;
  accentColor: string;
  pieceColors: {
    I: string;
    J: string;
    L: string;
    O: string;
    S: string;
    T: string;
    Z: string;
  };
}