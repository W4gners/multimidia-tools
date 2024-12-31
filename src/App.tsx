import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { Preview } from './components/Preview';
import { ActionButtons } from './components/ActionButtons';
import { DragDropProvider } from './components/DragDropProvider';
import { srtToVtt, addVttNumbering } from './utils/subtitleConverter';
import { LogoMultimidia } from './assets/logo_multimidia';

type ConversionMode = 'srtToVtt' | 'addNumbering' | 'audioToVtt' | 'videoToVtt';

export default function App() {
  const [conteudoEntrada, setConteudoEntrada] = useState('');
  const [conteudoSaida, setConteudoSaida] = useState('');
  const [modo, setModo] = useState<ConversionMode>('srtToVtt');

  const handleSelecionarArquivo = (content: string) => {
    setConteudoEntrada(content);
    if (modo === 'srtToVtt') {
      setConteudoSaida(srtToVtt(content));
    } else if (modo === 'addNumbering') {
      setConteudoSaida(addVttNumbering(content));
    }
  };

  const handleReiniciar = () => {
    setConteudoEntrada('');
    setConteudoSaida('');
  };

  const handleMudarModo = (novoModo: ConversionMode) => {
    setModo(novoModo);
    handleReiniciar();
  };

  return (
    <DragDropProvider onFileDrop={handleSelecionarArquivo}>
      <div className="min-h-screen bg-neutral-900 text-white">
        {/* Header */}
        <header className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            <LogoMultimidia />
          </div>
        </header>

        {/* Navigation */}
        <nav className="mb-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handleMudarModo('srtToVtt')}
                className={`px-6 py-2 text-sm font-medium rounded-full transition-colors ${
                  modo === 'srtToVtt'
                    ? 'bg-orange-500 text-white'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                }`}
              >
                SRT para VTT
              </button>
              <button
                onClick={() => handleMudarModo('addNumbering')}
                className={`px-6 py-2 text-sm font-medium rounded-full transition-colors ${
                  modo === 'addNumbering'
                    ? 'bg-orange-500 text-white'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                }`}
              >
                Numerar VTT
              </button>
              <button
                onClick={() => handleMudarModo('audioToVtt')}
                className={`px-6 py-2 text-sm font-medium rounded-full transition-colors ${
                  modo === 'audioToVtt'
                    ? 'bg-orange-500 text-white'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                }`}
              >
                Áudio para VTT
              </button>
              <button
                onClick={() => handleMudarModo('videoToVtt')}
                className={`px-6 py-2 text-sm font-medium rounded-full transition-colors ${
                  modo === 'videoToVtt'
                    ? 'bg-orange-500 text-white'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                }`}
              >
                Vídeo para VTT
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Upload Area */}
            <div className="bg-neutral-800 rounded-xl p-6">
              <h2 className="text-lg font-bold text-center mb-6">
                {modo === 'srtToVtt' && 'SRT para VTT'}
                {modo === 'addNumbering' && 'Numerar VTT'}
                {modo === 'audioToVtt' && 'Áudio para VTT'}
                {modo === 'videoToVtt' && 'Vídeo para VTT'}
              </h2>
              {(modo === 'srtToVtt' || modo === 'addNumbering') && (
                <FileUpload 
                  onFileSelect={handleSelecionarArquivo}
                  acceptedFormats={modo === 'srtToVtt' ? '.srt' : '.vtt'}
                />
              )}
              {(modo === 'audioToVtt' || modo === 'videoToVtt') && (
                <div className="text-center text-neutral-400">
                  <p>Funcionalidade em desenvolvimento</p>
                </div>
              )}
            </div>

            {/* Results Area */}
            {conteudoSaida && (modo === 'srtToVtt' || modo === 'addNumbering') && (
              <div className="bg-neutral-800 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-6 text-center">Resultado</h3>
                <div className="space-y-6">
                  <Preview 
                    content={conteudoSaida} 
                    type="output" 
                    label="Resultado" 
                  />
                  <ActionButtons vttContent={conteudoSaida} onReset={handleReiniciar} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </DragDropProvider>
  );
}