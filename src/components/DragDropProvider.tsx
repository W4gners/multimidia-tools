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

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

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
        className="min-h-screen"
      >
        {isDragging && (
          <div className="fixed inset-0 bg-black/50 z-50">
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