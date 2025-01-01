import React from 'react';
import { Upload } from 'lucide-react';

interface AudioUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export function AudioUpload({ onFileSelect, isProcessing }: AudioUploadProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    onFileSelect(file);
  };

  return (
    <div className="w-full">
      <label
        htmlFor="audio-upload"
        className={`flex flex-col items-center justify-center w-full h-40 border border-neutral-700 border-dashed rounded-xl cursor-pointer bg-neutral-900/50 hover:bg-neutral-800/50 transition-colors ${
          isProcessing ? 'pointer-events-none opacity-50' : ''
        }`}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 mb-4 rounded-full bg-neutral-800 flex items-center justify-center">
            <Upload className="w-6 h-6 text-neutral-400" />
          </div>
          <p className="text-sm text-neutral-400 text-center">
            <span className="text-orange-500">Clique para enviar</span> ou arraste seu arquivo
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Apenas arquivos .mp3
          </p>
        </div>
        <input
          id="audio-upload"
          type="file"
          accept=".mp3"
          className="hidden"
          onChange={handleFileChange}
          disabled={isProcessing}
        />
      </label>
    </div>
  );
}
