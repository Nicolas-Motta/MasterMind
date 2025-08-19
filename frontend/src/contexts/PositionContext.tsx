import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { type Position } from '../Types/Position';

// Tipo per la ball singola
export interface Ball {
  id: string;
  x: number;
  y: number;
  color: string;
  position: Position;
}

// Tipo per il context
interface PositionContextType {
  ball: Ball | null;
  setX: (x: number) => void;
  setY: (y: number) => void;
  setBall: (ball: Ball) => void;
  clearBall: () => void;
}

// Creo il context
const PositionContext = createContext<PositionContextType | undefined>(undefined);

// Props per il provider
interface PositionProviderProps {
  children: ReactNode;
}

// Provider del context
export const PositionProvider: React.FC<PositionProviderProps> = ({ children }) => {
  const [ball, setBallState] = useState<Ball | null>(null);

  // Imposta la coordinata X
  const setX = (x: number) => {
    setBallState(prev => prev ? { ...prev, x } : null);
  };

  // Imposta la coordinata Y
  const setY = (y: number) => {
    setBallState(prev => prev ? { ...prev, y } : null);
  };

  // Imposta l'intera ball
  const setBall = (newBall: Ball) => {
    setBallState(newBall);
  };

  // Rimuove la ball
  const clearBall = () => {
    setBallState(null);
  };

  const contextValue: PositionContextType = {
    ball,
    setX,
    setY,
    setBall,
    clearBall,
  };

  return (
    <PositionContext.Provider value={contextValue}>
      {children}
    </PositionContext.Provider>
  );
};

// Hook personalizzato per usare il context
export const usePositionContext = (): PositionContextType => {
  const context = useContext(PositionContext);
  if (!context) {
    throw new Error('usePositionContext deve essere usato all\'interno di un PositionProvider');
  }
  return context;
};