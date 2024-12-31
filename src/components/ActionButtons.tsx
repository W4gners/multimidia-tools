import React from 'react';
import { Copy, RotateCcw, Download } from 'lucide-react';

interface ActionButtonsProps {
  vttContent: string;
  onReset: () => void;
}

export function ActionButtons({ vttContent, onReset }: ActionButtonsProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(vttContent);
    } catch (err) {
      console.error('Falha ao copiar texto:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([vttContent], { type: 'text/vtt' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'legenda.vtt';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="flex justify-center gap-3">
      <button
        onClick={onReset}
        className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Refazer
      </button>
      <button
        onClick={handleCopy}
        className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
      >
        <Copy className="w-4 h-4 mr-2" />
        Copiar
      </button>
      <button
        onClick={handleDownload}
        className="inline-flex items-center px-4 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors"
      >
        <Download className="w-4 h-4 mr-2" />
        Baixar VTT
      </button>
    </div>
  );
}