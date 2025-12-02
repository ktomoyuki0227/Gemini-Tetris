
import React from 'react';
import { Keyboard, Smartphone, MousePointer2 } from 'lucide-react';

interface ControlsGuideProps {
  isMobile?: boolean;
}

const ControlsGuide: React.FC<ControlsGuideProps> = ({ isMobile = false }) => {
  if (isMobile) {
    return (
      <div className="flex flex-row justify-around items-center w-full text-xs text-gray-400 py-2 px-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/5">
        <div className="flex flex-col items-center gap-1">
          <MousePointer2 className="w-4 h-4 text-purple-400" />
          <span>Tap to Rotate</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Smartphone className="w-4 h-4 text-blue-400" />
          <span>Slide to Move</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="font-bold text-lg leading-none text-green-400">↓</span>
          <span>Slide Down Drop</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-white/10 w-full">
      <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-300">
        <Keyboard className="w-4 h-4" />
        <span>Controls</span>
      </div>
      <div className="space-y-2 text-xs text-gray-400">
        <div className="flex justify-between items-center">
          <span>Move</span>
          <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-white">← →</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Rotate</span>
          <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-white">↑</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Soft Drop</span>
          <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-white">↓</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Hold</span>
          <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-white">Shift / C</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Pause</span>
          <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-white">Esc</span>
        </div>
      </div>
    </div>
  );
};

export default ControlsGuide;
