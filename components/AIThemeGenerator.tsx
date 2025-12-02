import React, { useState } from 'react';
import { Sparkles, Loader2, Paintbrush } from 'lucide-react';
import { generateTheme } from '../services/geminiService';
import { Theme } from '../types';

interface AIThemeGeneratorProps {
  onThemeApply: (theme: Theme) => void;
}

const AIThemeGenerator: React.FC<AIThemeGeneratorProps> = ({ onThemeApply }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const newTheme = await generateTheme(prompt);
      onThemeApply(newTheme);
      setIsOpen(false);
      setPrompt('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 w-full max-w-sm">
        {!isOpen ? (
             <button
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:from-purple-500 hover:to-indigo-500 transition-all active:scale-95 border border-white/10"
             >
                 <Sparkles className="w-5 h-5" />
                 <span>Generate AI Theme</span>
             </button>
        ) : (
            <div className="bg-gray-800/80 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-2xl animate-fade-in">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        <Paintbrush className="w-4 h-4 text-purple-400" />
                        Describe your theme
                    </h3>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white text-xs">Cancel</button>
                </div>
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g. Cyberpunk Neon, Pastel Dreams..."
                        className="flex-1 bg-gray-900/50 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder-gray-500"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !prompt.trim()}
                        className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 flex items-center justify-center transition-colors"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    </button>
                </form>
                <p className="text-[10px] text-gray-500 mt-2">
                    Powered by Gemini 2.5 Flash. Generates colors for pieces, board, and background.
                </p>
            </div>
        )}
    </div>
  );
};

export default AIThemeGenerator;