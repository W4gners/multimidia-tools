import React from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (content: string) => void;
  acceptedFormats: string;
}

export function FileUpload({ onFileSelect, acceptedFormats }: FileUploadProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileSelect(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full">
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center w-full h-40 border border-neutral-700 border-dashed rounded-xl cursor-pointer bg-neutral-900/50 hover:bg-neutral-800/50 transition-colors"
      >
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 mb-4 rounded-full bg-neutral-800 flex items-center justify-center">
            <Upload className="w-6 h-6 text-neutral-400" />
          </div>
          <p className="text-sm text-neutral-400 text-center">
            <span className="text-orange-500">Clique para enviar</span> ou arraste seu arquivo
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            {acceptedFormats === '.srt' ? 'Apenas arquivos .srt' : 'Apenas arquivos .vtt'}
          </p>
        </div>
        <input
          id="file-upload"
          type="file"
          accept={acceptedFormats}
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}