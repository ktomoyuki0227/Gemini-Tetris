import { useState, useEffect, useCallback, useRef } from 'react';
import { BOARD_HEIGHT, BOARD_WIDTH, randomTetromino, TETROMINOS } from '../constants';
import { Grid, PlayerState, Tetromino } from '../types';
import { audioService } from '../services/audioService';

const createStage = (): Grid =>
  Array.from(Array(BOARD_HEIGHT), () =>
    new Array(BOARD_WIDTH).fill({ type: '0', color: '0', isLocked: false })
  );

export const checkCollision = (
  player: PlayerState,
  stage: Grid,
  { x: moveX, y: moveY }: { x: number; y: number }
) => {
  for (let y = 0; y < player.tetromino.shape.length; y += 1) {
    for (let x = 0; x < player.tetromino.shape[y].length; x += 1) {
      if (player.tetromino.shape[y][x] !== 0) {
        if (
          !stage[y + player.pos.y + moveY] ||
          !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
          stage[y + player.pos.y + moveY][x + player.pos.x + moveX].isLocked
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>(() => {});

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (savedCallback.current) savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export const useTetris = () => {
  const [grid, setGrid] = useState<Grid>(createStage());
  const [rowsCleared, setRowsCleared] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [clearingRows, setClearingRows] = useState<number[]>([]);
  const [isCommitting, setIsCommitting] = useState(false); 
  const [holdPiece, setHoldPiece] = useState<Tetromino | null>(null);
  const [isHeld, setIsHeld] = useState(false);

  const [player, setPlayer] = useState<PlayerState>({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS[0], 
    collided: false,
  });

  const [nextPiece, setNextPiece] = useState(randomTetromino());

  const movePlayer = useCallback((dir: number) => {
    if (clearingRows.length > 0) return;
    if (!checkCollision(player, grid, { x: dir, y: 0 })) {
      setPlayer((prev) => ({
        ...prev,
        pos: { x: prev.pos.x + dir, y: prev.pos.y },
      }));
      audioService.playSound('move');
    }
  }, [player, grid, clearingRows]);

  const rotate = (matrix: number[][], dir: number) => {
    const rotatedGrid = matrix.map((_, index) =>
      matrix.map((col) => col[index])
    );
    if (dir > 0) return rotatedGrid.map((row) => row.reverse());
    return rotatedGrid.reverse();
  };

  const playerRotate = useCallback(() => {
    if (clearingRows.length > 0) return;
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino.shape = rotate(clonedPlayer.tetromino.shape, 1);

    const pos = clonedPlayer.pos.x;
    let offset = 1;
    while (checkCollision(clonedPlayer, grid, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.tetromino.shape[0].length) {
        rotate(clonedPlayer.tetromino.shape, -1);
        clonedPlayer.pos.x = pos;
        return;
      }
    }
    setPlayer(clonedPlayer);
    audioService.playSound('rotate');
  }, [player, grid, clearingRows]);

  const resetGame = useCallback(() => {
    setGrid(createStage());
    setGameOver(false);
    setIsPaused(false);
    setRowsCleared(0);
    setClearingRows([]);
    setIsCommitting(false);
    setHoldPiece(null);
    setIsHeld(false);
    setPlayer({
      pos: { x: BOARD_WIDTH / 2 - 2, y: 0 },
      tetromino: randomTetromino(),
      collided: false,
    });
    setNextPiece(randomTetromino());
    setDropTime(1000);
    audioService.startMusic();
  }, []);

  const resetPlayer = (stage: Grid) => {
      setPlayer({
        pos: { x: BOARD_WIDTH / 2 - 2, y: 0 },
        tetromino: nextPiece,
        collided: false,
      });
      setNextPiece(randomTetromino());
      setIsHeld(false);
      
      const dummyPlayer = {
          pos: { x: BOARD_WIDTH / 2 - 2, y: 0 },
          tetromino: nextPiece,
          collided: false
      };
      
      if (checkCollision(dummyPlayer, stage, { x: 0, y: 0 })) {
        setGameOver(true);
        setDropTime(null);
        audioService.playSound('gameover');
        audioService.stopMusic();
      }
  };

  const hold = useCallback(() => {
      if (gameOver || isPaused || isHeld || clearingRows.length > 0) return;

      audioService.playSound('hold');
      
      if (!holdPiece) {
          setHoldPiece(player.tetromino);
          setPlayer({
              pos: { x: BOARD_WIDTH / 2 - 2, y: 0 },
              tetromino: nextPiece,
              collided: false
          });
          setNextPiece(randomTetromino());
      } else {
          const temp = holdPiece;
          setHoldPiece(player.tetromino);
          setPlayer({
              pos: { x: BOARD_WIDTH / 2 - 2, y: 0 },
              tetromino: temp,
              collided: false
          });
      }
      setIsHeld(true);
  }, [player, holdPiece, nextPiece, gameOver, isPaused, isHeld, clearingRows]);

  const updateStage = useCallback(() => {
    const newStage = grid.map(row =>
      row.map(cell => (cell.isLocked ? cell : { type: '0', color: '0', isLocked: false }))
    ) as Grid;

    player.tetromino.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const gridY = y + player.pos.y;
          const gridX = x + player.pos.x;
          if (gridY >= 0 && gridY < BOARD_HEIGHT && gridX >= 0 && gridX < BOARD_WIDTH) {
             newStage[gridY][gridX] = {
                type: player.tetromino.type,
                color: player.tetromino.color,
                isLocked: false,
             };
          }
        }
      });
    });

    if (player.collided) {
        const lockedStage = newStage.map(row => 
            row.map(cell => {
                if (cell.type === player.tetromino.type && !cell.isLocked) {
                    return { ...cell, isLocked: true };
                }
                return cell;
            })
        );

        const rowsToClear: number[] = [];
        lockedStage.forEach((row, index) => {
             if (row.every(cell => cell.type !== '0')) {
                 rowsToClear.push(index);
             }
        });

        if (rowsToClear.length > 0) {
            setClearingRows(rowsToClear);
            audioService.playSound('clear');
            return lockedStage;
        }

        audioService.playSound('drop');
        setIsCommitting(true);
        setTimeout(() => setIsCommitting(false), 200);
        
        resetPlayer(lockedStage);
        return lockedStage;
    }

    return newStage;
  }, [player, grid]);

  useEffect(() => {
      if (clearingRows.length > 0) {
          const timer = setTimeout(() => {
              setGrid(prevGrid => {
                  const newGrid = prevGrid.reduce((ack, row, idx) => {
                      if (!clearingRows.includes(idx)) {
                          ack.push(row);
                      }
                      return ack;
                  }, [] as Grid);

                  while (newGrid.length < BOARD_HEIGHT) {
                      newGrid.unshift(new Array(BOARD_WIDTH).fill({ type: '0', color: '0', isLocked: false }));
                  }

                  resetPlayer(newGrid);
                  
                  return newGrid;
              });
              
              setRowsCleared(prev => prev + clearingRows.length);
              setClearingRows([]);
          }, 300);

          return () => clearTimeout(timer);
      }
  }, [clearingRows]);

  const drop = () => {
    if (clearingRows.length > 0) return;

    if (!checkCollision(player, grid, { x: 0, y: 1 })) {
      setPlayer({
          ...player,
          pos: { x: player.pos.x, y: player.pos.y + 1 },
          collided: false
      });
    } else {
      if (player.pos.y < 1) {
        setGameOver(true);
        setDropTime(null);
        audioService.playSound('gameover');
        audioService.stopMusic();
      }
      setPlayer({ ...player, collided: true });
    }
  };

  const dropPlayer = () => {
    if (clearingRows.length > 0) return;
    setDropTime(null);
    drop();
    if (!gameOver && !isPaused) {
        const newSpeed = 1000 / ((Math.floor(rowsCleared / 10) + 1) + 0.2);
        setDropTime(newSpeed);
    }
  };

  useEffect(() => {
    if (!gameOver && !isPaused && (player.tetromino.type !== 'I' || player.tetromino.color !== '0')) {
         setGrid(prev => updateStage());
    }
  }, [player.pos, player.tetromino, player.collided]);

  useInterval(() => {
    drop();
  }, (clearingRows.length > 0) ? null : dropTime);

  return {
    grid,
    gameOver,
    isPaused,
    setIsPaused,
    rowsCleared,
    dropPlayer,
    movePlayer,
    playerRotate,
    resetGame,
    nextPiece,
    clearingRows, 
    isCommitting,
    holdPiece,
    hold 
  };
};