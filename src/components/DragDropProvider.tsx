import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

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
  onFileDrop: (content: string) => void;
}

export function DragDropProvider({ children, onFileDrop }: DragDropProviderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev - 1);
    if (dragCounter === 1) {
      setIsDragging(false);
    }
  }, [dragCounter]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setDragCounter(0);

      const file = e.dataTransfer.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileDrop(content);
      };
      reader.readAsText(file);
    },
    [onFileDrop]
  );

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
          <div className="fixed inset-0 bg-black/70 z-50 pointer-events-none">
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