import React from 'react';

interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="w-full bg-neutral-800 rounded-full h-4 mb-2">
        <div
          className="bg-[#fc7320] h-4 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-neutral-400 text-center">
        Processando áudio... {Math.round(progress)}%
      </p>
    </div>
  );
}
