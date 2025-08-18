import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Tipo per le coordinate di una ball
export interface BallPosition {
  id: string;
  x: number;
  y: number;
  color?: string;
}

// Tipo per il context
interface PositionContextType {
  ballPositions: BallPosition[];
  setBallPosition: (ballPosition: BallPosition) => void;
  updateBallPosition: (id: string, x: number, y: number) => void;
  removeBallPosition: (id: string) => void;
  getBallPosition: (id: string) => BallPosition | undefined;
  clearAllPositions: () => void;
}

// Creo il context
const PositionContext = createContext<PositionContextType | undefined>(undefined);

// Props per il provider
interface PositionProviderProps {
  children: ReactNode;
}

// Provider del context
export const PositionProvider: React.FC<PositionProviderProps> = ({ children }) => {
  const [ballPositions, setBallPositions] = useState<BallPosition[]>([]);

  // Aggiunge o aggiorna la posizione di una ball
  const setBallPosition = (ballPosition: BallPosition) => {
    setBallPositions(prev => {
      const existingIndex = prev.findIndex(ball => ball.id === ballPosition.id);
      if (existingIndex !== -1) {
        // Aggiorna ball esistente
        const updated = [...prev];
        updated[existingIndex] = ballPosition;
        return updated;
      } else {
        // Aggiunge nuova ball
        return [...prev, ballPosition];
      }
    });
  };

  // Aggiorna solo le coordinate di una ball specifica (chiamato al rilascio)
  const updateBallPosition = (id: string, x: number, y: number) => {
    setBallPositions(prev => 
      prev.map(ball => 
        ball.id === id 
          ? { ...ball, x, y }
          : ball
      )
    );
  };

  // Rimuove una ball dalle posizioni
  const removeBallPosition = (id: string) => {
    setBallPositions(prev => prev.filter(ball => ball.id !== id));
  };

  // Ottiene la posizione di una ball specifica
  const getBallPosition = (id: string): BallPosition | undefined => {
    return ballPositions.find(ball => ball.id === id);
  };

  // Pulisce tutte le posizioni
  const clearAllPositions = () => {
    setBallPositions([]);
  };

  const contextValue: PositionContextType = {
    ballPositions,
    setBallPosition,
    updateBallPosition,
    removeBallPosition,
    getBallPosition,
    clearAllPositions,
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

// Hook per ottenere le coordinate di una ball specifica
export const useBallPosition = (ballId: string) => {
  const { getBallPosition, updateBallPosition } = usePositionContext();
  
  const position = getBallPosition(ballId);
  
  // Funzione da chiamare solo al rilascio della pallina
  const updatePositionOnRelease = (x: number, y: number) => {
    updateBallPosition(ballId, x, y);
  };

  return {
    x: position?.x || 0,
    y: position?.y || 0,
    color: position?.color,
    updatePositionOnRelease,
  };
};