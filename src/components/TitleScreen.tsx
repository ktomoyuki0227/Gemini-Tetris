import React, { useState } from 'react';
import { Play, Sparkles, Gamepad2, Image as ImageIcon, Loader2, Palette, Trophy } from 'lucide-react';
import { generateBackgroundImage } from '../services/geminiService';

interface TitleScreenProps {
  onStart: () => void;
  onBackgroundGenerated: (url: string) => void;
  currentBackground: string | null;
  highScore: number;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, onBackgroundGenerated, currentBackground, highScore }) => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenUI, setShowGenUI] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const imageUrl = await generateBackgroundImage(prompt, size);
      if (imageUrl) {
        onBackgroundGenerated(imageUrl);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center text-white overflow-hidden bg-gray-900 transition-all duration-1000">
      {currentBackground ? (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
            style={{ backgroundImage: `url(${currentBackground})` }}
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        </>
      ) : (
        <div className="absolute inset-0 overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black" />
        </div>
      )}

      <div className="absolute top-6 right-6 flex items-center gap-2 px-5 py-2.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-yellow-400 font-mono font-bold shadow-lg animate-fade-in">
        <Trophy className="w-4 h-4" />
        <span className="tracking-widest">BEST: {highScore.toLocaleString()}</span>
      </div>

      <div className="relative z-10 flex flex-col items-center p-6 w-full max-w-4xl">
        <div className="mb-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-purple-300 backdrop-blur-md shadow-lg animate-fade-in-up">
          <Sparkles className="w-3 h-3" />
          <span className="tracking-wide">AI POWERED • GEMINI</span>
        </div>

        <h1 className="text-7xl md:text-9xl font-black tracking-tighter italic mb-4 relative group cursor-default">
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500 drop-shadow-2xl">
            TETRIS
          </span>
        </h1>
        
        <p className="text-gray-400 text-sm md:text-lg max-w-lg text-center mb-10 font-light tracking-wide leading-relaxed">
          The classic puzzle game, reimagined with generative themes and immersive visuals.
        </p>

        <button
          onClick={onStart}
          className="group relative px-10 py-5 bg-white text-black font-bold text-xl rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.4)] active:scale-95 flex items-center gap-3 mb-12"
        >
          <Play className="w-6 h-6 fill-current relative z-10" />
          <span className="relative z-10 tracking-widest">START GAME</span>
        </button>

        <div className={`w-full max-w-md transition-all duration-500 ease-in-out ${showGenUI ? 'opacity-100 translate-y-0' : 'opacity-90 translate-y-2'}`}>
            {!showGenUI ? (
                <button 
                    onClick={() => setShowGenUI(true)}
                    className="mx-auto flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors pb-8"
                >
                    <Palette className="w-4 h-4" />
                    Customize Background
                </button>
            ) : (
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-blue-400" />
                            AI Background Studio
                        </h3>
                        <button onClick={() => setShowGenUI(false)} className="text-xs text-gray-500 hover:text-white">Close</button>
                    </div>

                    <form onSubmit={handleGenerate} className="flex flex-col gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g. Cyberpunk city, Nebula space..."
                                className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500 transition-all"
                            />
                            <div className="absolute right-2 top-2 flex bg-black/20 rounded-md p-0.5 border border-white/5">
                                {(['1K', '2K', '4K'] as const).map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setSize(s)}
                                        className={`px-2 py-1 text-[10px] font-bold rounded ${size === s ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isGenerating || !prompt.trim()}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-4 py-2.5 flex items-center justify-center gap-2 transition-all shadow-lg"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Generating...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    <span>Generate Background</span>
                                </>
                            )}
                        </button>
                    </form>
                    <p className="text-[10px] text-gray-500 mt-3 text-center">
                        Powered by Gemini 3.0 Pro Image Preview.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TitleScreen;