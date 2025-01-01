import React, { useState } from 'react';
import { AudioUpload } from './AudioUpload';
import { ProgressBar } from './ProgressBar';
import { Preview } from './Preview';
import { ActionButtons } from './ActionButtons';
import { API_CONFIG } from '../config/api';

export function AudioToVtt() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

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
      const startTime = i * 2;
      const endTime = startTime + 4;
      
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
    setError('');

    try {
      setProgress(20);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('model', 'whisper-1');
      formData.append('language', 'pt');
      formData.append('response_format', 'text');

      setProgress(40);
      const response = await fetch(API_CONFIG.WHISPER_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.OPENAI_API_KEY}`
        },
        body: formData
      });

      setProgress(60);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Falha ao processar o áudio');
      }

      setProgress(80);
      const transcription = await response.text();
      const vttContent = formatVttContent(transcription);
      
      setProgress(100);
      setResult(vttContent);
    } catch (error: any) {
      console.error('Erro ao processar o áudio:', error);
      setError(error.message || 'Erro ao processar o áudio. Por favor, tente novamente.');
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        if (!error) setProgress(0);
      }, 1000);
    }
  };

  const handleReset = () => {
    setResult('');
    setIsProcessing(false);
    setProgress(0);
    setError('');
  };

  return (
    <div className="w-full space-y-6">
      {!result && !error && (
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

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
          <p className="text-red-500 text-center">{error}</p>
          <button
            onClick={handleReset}
            className="mt-4 px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors mx-auto block"
          >
            Tentar Novamente
          </button>
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
