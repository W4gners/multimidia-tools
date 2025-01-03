import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

interface AudioUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export function AudioUpload({ onFileSelect, isProcessing }: AudioUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFile = (file: File) => {
    if (!file.type.includes('audio')) {
      alert('Por favor, selecione um arquivo de áudio válido (MP3, WAV, M4A, etc).');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      alert('O arquivo deve ser menor que 25MB.');
      return;
    }
    onFileSelect(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    validateAndProcessFile(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;
    validateAndProcessFile(file);
  };

  const handleClick = () => {
    if (!isProcessing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full h-40 border border-dashed rounded-xl cursor-pointer transition-colors ${
          isProcessing
            ? 'pointer-events-none opacity-50 border-neutral-700 bg-neutral-900/50'
            : isDragging
            ? 'border-[#fc7320] bg-black/70'
            : 'border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800/50'
        }`}
      >
        <div className="flex flex-col items-center justify-center">
          <div className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center ${
            isDragging ? 'bg-[#fc7320]/20' : 'bg-neutral-800'
          }`}>
            <Upload className={`w-6 h-6 ${isDragging ? 'text-[#fc7320]' : 'text-neutral-400'}`} />
          </div>
          <p className="text-sm text-center">
            <span className={isDragging ? 'text-[#fc7320]' : 'text-orange-500'}>
              Clique para enviar
            </span>{' '}
            ou arraste seu arquivo
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Arquivos de áudio até 25MB
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isProcessing}
        />
      </div>
    </div>
  );
}
