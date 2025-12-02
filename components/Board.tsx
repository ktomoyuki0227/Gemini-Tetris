import React from 'react';
import { Grid, Theme } from '../types';

interface BoardProps {
  grid: Grid;
  theme: Theme;
  clearingRows?: number[];
  isCommitting?: boolean;
}

const Board: React.FC<BoardProps> = ({ grid, theme, clearingRows = [], isCommitting = false }) => {
  return (
    <div 
      className={`grid grid-cols-10 gap-px border-4 rounded-lg overflow-hidden relative shadow-2xl mx-auto ${isCommitting ? 'animate-shake' : ''}`}
      style={{
        height: '100%',
        width: 'auto',
        aspectRatio: '10/20',
        backgroundColor: theme.gridColor,
        borderColor: theme.gridColor
      }}
    >
      {grid.map((row, y) =>
        row.map((cell, x) => {
          const isClearing = clearingRows.includes(y);
          return (
            <div
              key={`${y}-${x}`}
              className={`w-full h-full relative ${isClearing ? 'animate-flash' : ''}`}
              style={{
                backgroundColor: cell.type === '0' ? theme.boardBackground : theme.pieceColors[cell.type] || cell.color,
                transition: isClearing ? 'none' : 'background-color 0.1s ease-in-out',
                zIndex: isClearing ? 10 : 1
              }}
            >
               {cell.type !== '0' && !isClearing && (
                  <div className="absolute inset-0 border-[3px] border-white/20 rounded-sm pointer-events-none"></div>
               )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Board;