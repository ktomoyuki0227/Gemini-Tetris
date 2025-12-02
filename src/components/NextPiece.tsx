
import React from 'react';
import { Tetromino, Theme } from '../types';

interface NextPieceProps {
  tetromino: Tetromino | null;
  theme: Theme;
  label?: string;
}

const NextPiece: React.FC<NextPieceProps> = ({ tetromino, theme, label = "Next" }) => {
  return (
    <div 
      className="p-4 rounded-xl shadow-lg border border-white/10 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
    >
      <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-gray-400">{label}</h3>
      <div className="grid grid-cols-4 gap-1 w-20 h-16 mx-auto content-center">
        {tetromino ? (
            tetromino.shape.map((row, y) =>
            row.map((cell, x) => {
                if (cell) {
                    return (
                        <div
                            key={`${y}-${x}`}
                            className="w-4 h-4 rounded-sm"
                            style={{ 
                                backgroundColor: theme.pieceColors[tetromino.type] || tetromino.color,
                                gridColumnStart: x + 1,
                                gridRowStart: y + 1
                            }}
                        />
                    );
                }
                return null;
            })
            )
        ) : (
            <div className="col-span-4 row-span-4 flex items-center justify-center text-xs text-gray-600 italic">
                Empty
            </div>
        )}
      </div>
    </div>
  );
};

export default NextPiece;
