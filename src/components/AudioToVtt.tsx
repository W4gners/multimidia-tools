import React, { useState } from 'react';
import { AudioUpload } from './AudioUpload';
import { ProgressBar } from './ProgressBar';
import { Preview } from './Preview';
import { ActionButtons } from './ActionButtons';

export function AudioToVtt() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState('');

  const formatVttTimestamp = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const milliseconds = Math.floor((secs % 1) * 1000);
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(Math.floor(secs)).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
  };

  const formatVttContent = (text: string): string => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      if ((currentLine + ' ' + word).length <= 36) {
        currentLine = currentLine ? `${currentLine} ${word}` : word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }

    let vttContent = 'WEBVTT\n\n';
    for (let i = 0; i < lines.length; i += 2) {
      const startTime = i * 2; // 2 seconds per line
      const endTime = startTime + 4; // 4 seconds duration for each block
      
      vttContent += `${formatVttTimestamp(startTime)} --> ${formatVttTimestamp(endTime)}\n`;
      vttContent += lines[i] + '\n';
      if (lines[i + 1]) {
        vttContent += lines[i + 1] + '\n';
      }
      vttContent += '\n';
    }
    
    return vttContent;
  };

  const processAudio = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    setResult('');

    try {
      const formData = new FormData();
      formData.append('audio', file);

      const response = await fetch('http://localhost:3001/transcribe', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to process audio');
      }

      const data = await response.json();
      const transcription = data.transcription;
      const vttContent = formatVttContent(transcription);
      setResult(vttContent);
    } catch (error) {
      console.error('Erro ao processar o áudio:', error);
      // TODO: Adicionar tratamento de erro adequado
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };

  const handleReset = () => {
    setResult('');
    setIsProcessing(false);
    setProgress(0);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {!result && (
        <AudioUpload
          onFileSelect={processAudio}
          isProcessing={isProcessing}
        />
      )}
      
      {isProcessing && (
        <div className="mt-6">
          <ProgressBar progress={progress} />
        </div>
      )}

      {result && (
        <>
          <Preview content={result} />
          <ActionButtons
            onReset={handleReset}
            content={result}
            filename="legenda.vtt"
          />
        </>
      )}
    </div>
  );
}
