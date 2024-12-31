import React from 'react';
import { FileText, Hash } from 'lucide-react';

interface ConversionTypeProps {
  type: 'srtToVtt' | 'addNumbering';
  onChange: (type: 'srtToVtt' | 'addNumbering') => void;
}

export function ConversionType({ type, onChange }: ConversionTypeProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm text-neutral-400">
        Tipo de Conversão
      </label>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onChange('srtToVtt')}
          className={`flex items-center p-3 rounded-xl transition-colors ${
            type === 'srtToVtt'
              ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30'
              : 'bg-neutral-700/50 text-neutral-400 hover:bg-neutral-700 border border-transparent'
          }`}
        >
          <FileText className="w-4 h-4 mr-2" />
          <span className="text-sm">SRT para VTT</span>
        </button>
        <button
          onClick={() => onChange('addNumbering')}
          className={`flex items-center p-3 rounded-xl transition-colors ${
            type === 'addNumbering'
              ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30'
              : 'bg-neutral-700/50 text-neutral-400 hover:bg-neutral-700 border border-transparent'
          }`}
        >
          <Hash className="w-4 h-4 mr-2" />
          <span className="text-sm">Adicionar Numeração</span>
        </button>
      </div>
    </div>
  );
}