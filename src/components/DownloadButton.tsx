import React from 'react';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  content: string;
  disabled: boolean;
}

export function DownloadButton({ content, disabled }: DownloadButtonProps) {
  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/vtt' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subtitles.vtt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={disabled}
      className={`flex items-center justify-center px-4 py-2 rounded-lg text-white ${
        disabled
          ? 'bg-gray-300 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700'
      } transition-colors`}
    >
      <Download className="w-4 h-4 mr-2" />
      Download VTT
    </button>
  );
}