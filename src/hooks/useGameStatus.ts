
import { useState, useEffect } from 'react';

export const useGameStatus = (rowsCleared: number) => {
  const [score, setScore] = useState(0);
  const [rows, setRows] = useState(0);
  const [level, setLevel] = useState(0);
  const [prevRowsCleared, setPrevRowsCleared] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('tetris_high_score');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('tetris_high_score', score.toString());
    }
  }, [score, highScore]);

  useEffect(() => {
    // If rowsCleared resets to 0 (game restart), reset internal tracker
    if (rowsCleared === 0) {
        setPrevRowsCleared(0);
        return;
    }

    // Calculate how many rows were just cleared
    const diff = rowsCleared - prevRowsCleared;

    if (diff > 0) {
      const linePoints = [40, 100, 300, 1200];
      // Ensure we don't go out of bounds if something weird happens, though diff should be 1-4
      const points = linePoints[diff - 1] || 0; 
      
      setScore((prev) => prev + points * (level + 1));
      setRows((prev) => prev + diff);
      setLevel((prev) => Math.floor((rows + diff) / 10));
      
      setPrevRowsCleared(rowsCleared);
    }
  }, [rowsCleared, prevRowsCleared, level, rows]);

  return { score, setScore, rows, setRows, level, setLevel, highScore };
};
