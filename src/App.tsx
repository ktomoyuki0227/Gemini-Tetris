import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useTetris } from './hooks/useTetris';
import { useGameStatus } from './hooks/useGameStatus';
import Board from './components/Board';
import NextPiece from './components/NextPiece';
import ControlsGuide from './components/ControlsGuide';
import TitleScreen from './components/TitleScreen';
import { DEFAULT_THEME } from './constants';
import { Theme } from './types';
import { audioService } from './services/audioService';
import { 
  Play, 
  RotateCcw, 
  Pause,
  Trophy,
  Zap,
  Volume2,
  VolumeX,
  Home
} from 'lucide-react';

const App: React.FC = () => {
  const {
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
  } = useTetris();

  const { score, rows, level, setScore, setRows, setLevel, highScore } = useGameStatus(rowsCleared);
  const [theme] = useState<Theme>(DEFAULT_THEME);
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Focus ref for keyboard events
  const gameAreaRef = useRef<HTMLDivElement>(null);
  
  // Touch handling refs
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
  const isTapRef = useRef<boolean>(false);
  const touchMoveAccumulator = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleStart = () => {
    setGameStarted(true);
    audioService.startMusic();
    resetGame();
    setScore(0);
    setRows(0);
    setLevel(0);
    setTimeout(() => {
        gameAreaRef.current?.focus();
    }, 50);
  };

  const handleHome = () => {
      audioService.stopMusic();
      setGameStarted(false);
  };

  const handlePause = () => {
      if (!gameOver && gameStarted) {
          setIsPaused(!isPaused);
          if (isPaused) {
              audioService.startMusic();
          } else {
              audioService.stopMusic();
          }
      }
      gameAreaRef.current?.focus();
  }
  
  const toggleMute = (e: React.MouseEvent) => {
      e.stopPropagation();
      const muted = audioService.toggleMute();
      setIsMuted(muted);
      gameAreaRef.current?.focus();
  };

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (!gameStarted || gameOver || isPaused) return;

    if (e.key === 'ArrowLeft') {
      movePlayer(-1);
    } else if (e.key === 'ArrowRight') {
      movePlayer(1);
    } else if (e.key === 'ArrowDown') {
      dropPlayer();
    } else if (e.key === 'ArrowUp') {
      playerRotate();
    } else if (e.key.toLowerCase() === 'c' || e.key === 'Shift') {
      hold();
    } else if (e.key === 'Escape') {
      handlePause();
    }
  }, [gameStarted, gameOver, isPaused, movePlayer, dropPlayer, playerRotate, hold]);

  // Set up global key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        // Prevent default scrolling for game keys if game is started
        if(gameStarted && ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight", " "].indexOf(e.key) > -1) {
            e.preventDefault();
        }
        handleKey(e);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKey, gameStarted]);

  // Touch Event Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
      if (!gameStarted || gameOver || isPaused) return;
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
      touchMoveAccumulator.current = { x: 0, y: 0 };
      isTapRef.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
      if (!gameStarted || gameOver || isPaused || !lastTouchRef.current) return;
      e.preventDefault(); // Prevent scrolling
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - lastTouchRef.current.x;
      const deltaY = touch.clientY - lastTouchRef.current.y;
      
      touchMoveAccumulator.current.x += deltaX;
      touchMoveAccumulator.current.y += deltaY;
      
      const MOVE_THRESHOLD = 20; // Pixels to trigger a horizontal move
      const DROP_THRESHOLD = 30; // Pixels to trigger a drop

      // Horizontal Movement
      if (Math.abs(touchMoveAccumulator.current.x) > MOVE_THRESHOLD) {
          const direction = touchMoveAccumulator.current.x > 0 ? 1 : -1;
          movePlayer(direction);
          touchMoveAccumulator.current.x = 0; // Reset accumulator after move
          isTapRef.current = false;
      }

      // Vertical Drop (Soft Drop)
      if (touchMoveAccumulator.current.y > DROP_THRESHOLD) {
          dropPlayer();
          touchMoveAccumulator.current.y = 0;
          isTapRef.current = false;
      }
      
      // Swipe Up for Hold
      if (touchMoveAccumulator.current.y < -DROP_THRESHOLD * 2) {
          hold();
          touchMoveAccumulator.current.y = 0;
          isTapRef.current = false;
      }

      lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
      if (isTapRef.current && !gameOver && !isPaused && gameStarted) {
          playerRotate();
      }
      touchStartRef.current = null;
      lastTouchRef.current = null;
  };

  // Prevent default touch behaviors like double-tap zoom
  useEffect(() => {
    const preventDefault = (e: TouchEvent) => e.preventDefault();
    document.addEventListener('touchmove', preventDefault, { passive: false });
    return () => document.removeEventListener('touchmove', preventDefault);
  }, []);

  if (!gameStarted) {
      return (
        <TitleScreen 
            onStart={handleStart} 
            onBackgroundGenerated={setCustomBackground} 
            currentBackground={customBackground}
            highScore={highScore}
        />
      );
  }

  // Styles for background handling
  const appStyles: React.CSSProperties = customBackground 
    ? { 
        backgroundImage: `url(${customBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    : { background: theme.background };

  return (
    <div 
      className="fixed inset-0 overflow-hidden flex flex-col md:flex-row font-sans transition-all duration-700 ease-in-out select-none"
      style={appStyles}
      ref={gameAreaRef}
      tabIndex={0}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
        {/* Overlay for readability if custom background is used */}
        {customBackground && (
            <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />
        )}

        {/* --- LEFT PANEL (Desktop) / TOP HEADER (Mobile) --- */}
        <div className="flex-shrink-0 md:w-64 p-3 md:p-6 md:h-full z-20 flex flex-row md:flex-col justify-between items-center md:items-start bg-black/20 md:backdrop-blur-sm border-b md:border-b-0 md:border-r border-white/10">
            {/* Title */}
            <div className="hidden md:block mb-8">
                 <h1 className="text-5xl font-black italic tracking-tighter" style={{ color: theme.accentColor }}>
                     TETRIS
                 </h1>
                 <button onClick={handleHome} className="text-xs font-medium opacity-50 hover:opacity-100 text-white flex items-center gap-1 mt-2">
                    <Home className="w-3 h-3" /> Back to Title
                 </button>
            </div>
            
            {/* Desktop Hold */}
            <div className="hidden md:block w-full mb-8">
                <NextPiece tetromino={holdPiece} theme={theme} label="Hold" />
                <div className="text-[10px] text-gray-400 mt-1 text-center uppercase tracking-wider font-bold">Press 'C' or Swipe Up</div>
            </div>

            {/* Stats */}
            <div className="flex md:flex-col gap-2 md:gap-4 w-full md:w-auto items-center md:items-stretch justify-around md:justify-start">
                 {/* Mobile only mini title */}
                 <div className="md:hidden flex items-center gap-2 mr-2">
                     <button onClick={handleHome} className="p-2 bg-white/10 rounded-full">
                         <Home className="w-4 h-4 text-white" />
                     </button>
                 </div>
                 
                 {/* High Score Panel (Always visible) */}
                 <div className="hidden md:flex flex-col md:bg-black/30 md:p-3 rounded-lg border border-yellow-500/20">
                    <div className="flex items-center gap-1 text-yellow-500 text-[10px] md:text-xs uppercase font-bold tracking-wider">
                         <Trophy className="w-3 h-3" /> Best
                    </div>
                    <div className="text-lg md:text-2xl font-mono font-bold text-yellow-400">{Math.max(score, highScore).toLocaleString()}</div>
                 </div>

                 <div className="flex flex-col md:bg-black/30 md:p-3 rounded-lg">
                    <div className="flex items-center gap-1 text-gray-400 text-[10px] md:text-xs uppercase font-bold tracking-wider">
                         <Trophy className="w-3 h-3" /> Score
                    </div>
                    <div className="text-lg md:text-2xl font-mono font-bold text-white">{score.toLocaleString()}</div>
                 </div>
                 
                 <div className="flex flex-col md:bg-black/30 md:p-3 rounded-lg">
                    <div className="flex items-center gap-1 text-gray-400 text-[10px] md:text-xs uppercase font-bold tracking-wider">
                         <Zap className="w-3 h-3" /> Level
                    </div>
                    <div className="text-lg md:text-2xl font-mono font-bold text-white">{level}</div>
                 </div>

                 {/* Mobile Hold (Mini) */}
                 <div className="md:hidden ml-auto transform scale-75 origin-right flex gap-2">
                     <NextPiece tetromino={holdPiece} theme={theme} label="Hold" />
                     <NextPiece tetromino={nextPiece} theme={theme} label="Next" />
                 </div>
            </div>
        </div>

        {/* --- CENTER PANEL (Game Board) --- */}
        <div className="flex-1 relative flex flex-col items-center justify-center p-2 md:p-6 min-h-0 z-10">
            {/* Board Container - constrained by height to ensure 70-80% screen coverage */}
            <div className="relative h-full w-full flex items-center justify-center">
                 <div className="h-full max-h-[75vh] md:max-h-[90vh] aspect-[10/20] relative shadow-2xl">
                     <Board 
                        grid={grid} 
                        theme={theme} 
                        clearingRows={clearingRows}
                        isCommitting={isCommitting}
                     />

                     {/* Overlays */}
                    {gameOver && (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md rounded-lg p-6 text-center animate-in fade-in zoom-in duration-300">
                            <h2 className="text-4xl font-black text-white mb-2 italic">GAME OVER</h2>
                            <p className="text-xl text-gray-300 mb-2 font-mono">Final Score: {score}</p>
                            {score > highScore && (
                                <p className="text-lg text-yellow-400 mb-6 font-bold animate-pulse">New High Score!</p>
                            )}
                            {!score || score <= highScore ? <div className="mb-6"></div> : null}
                            
                            <div className="flex gap-4">
                                <button 
                                    onClick={handleHome}
                                    className="px-6 py-3 bg-gray-700 text-white font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2"
                                >
                                    <Home className="w-5 h-5" /> Title
                                </button>
                                <button 
                                    onClick={handleStart}
                                    className="px-6 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2"
                                >
                                    <RotateCcw className="w-5 h-5" /> Retry
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {isPaused && !gameOver && (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg">
                            <h2 className="text-3xl font-bold text-white mb-6 tracking-widest">PAUSED</h2>
                            <button onClick={handlePause} className="p-4 bg-white rounded-full hover:scale-110 transition-transform shadow-lg">
                                <Play className="w-8 h-8 text-black fill-current ml-1" />
                            </button>
                        </div>
                    )}
                 </div>
            </div>
        </div>

        {/* --- RIGHT PANEL (Desktop) / BOTTOM CONTROLS (Mobile) --- */}
        <div className="flex-shrink-0 md:w-64 p-4 z-20 flex flex-col justify-end md:justify-start gap-4 md:bg-black/20 md:backdrop-blur-sm md:border-l border-white/10">
             
             {/* Desktop: Next Piece & Controls */}
             <div className="hidden md:flex flex-col gap-6 h-full">
                 <div className="flex-none">
                    <NextPiece tetromino={nextPiece} theme={theme} label="Next" />
                 </div>
                 
                 <div className="flex gap-2">
                     <button onClick={() => resetGame()} className="flex-1 py-2 bg-gray-700/50 hover:bg-gray-600 rounded-lg text-xs font-semibold uppercase tracking-wider">Reset</button>
                     <button onClick={handlePause} className="flex-1 py-2 bg-gray-700/50 hover:bg-gray-600 rounded-lg text-xs font-semibold uppercase tracking-wider">{isPaused ? 'Resume' : 'Pause'}</button>
                 </div>
                 
                 <button 
                    onClick={toggleMute}
                    className="flex items-center justify-center gap-2 py-2 bg-gray-700/50 hover:bg-gray-600 rounded-lg text-xs font-semibold uppercase tracking-wider text-gray-300"
                 >
                     {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                     {isMuted ? 'Unmute' : 'Mute'}
                 </button>

                 <div className="mt-auto">
                    <ControlsGuide />
                 </div>
             </div>

             {/* Mobile: Gesture Guide */}
             <div className="md:hidden flex flex-col gap-3 pb-safe">
                  <div className="flex justify-between items-center px-2">
                       <button onClick={toggleMute} className="p-2 text-gray-400">
                           {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                       </button>
                       <button onClick={handlePause} className="p-2 text-gray-400">
                           {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                       </button>
                  </div>
                  <ControlsGuide isMobile={true} />
             </div>
        </div>
    </div>
  );
};

export default App;