import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DragDropContextType {
  isDragging: boolean;
  setIsDragging: (value: boolean) => void;
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

export function useDragDrop() {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop deve ser usado dentro de um DragDropProvider');
  }
  return context;
}

interface DragDropProviderProps {
  children: ReactNode;
  onFileDrop: (file: File) => void;
}

export function DragDropProvider({ children, onFileDrop }: DragDropProviderProps) {
  const [isDragging, setIsDragging] = useState(false);

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
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    onFileDrop(file);
  };

  return (
    <DragDropContext.Provider value={{ isDragging, setIsDragging }}>
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="min-h-screen relative"
      >
        {isDragging && (
          <div className="fixed inset-0 bg-black/70 z-50">
            <div className="absolute inset-6 rounded-3xl border-2 border-[#fc7320] border-dashed flex items-center justify-center">
              <p className="text-[#fc7320] text-xl font-medium">
                Solte o arquivo aqui
              </p>
            </div>
          </div>
        )}
        {children}
      </div>
    </DragDropContext.Provider>
  );
}