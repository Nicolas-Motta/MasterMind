import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import type { ReactNode } from 'react';
import { type Position } from '../Types/Position';

interface WebSocketContextType {
    currentLabel: Position | null;
    isConnected: boolean;
    sendMessage: (message: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};

interface WebSocketProviderProps {
    children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
    const [currentLabel, setCurrentLabel] = useState<Position | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const connectWebSocket = () => {
            const ws = new WebSocket(`/MasterMind/Variables`);
            wsRef.current = ws;
            
            ws.onopen = () => {
                setIsConnected(true);
            };
            
            ws.onmessage = (event) => {
                try {
                    const update = JSON.parse(event.data);
                    
                    if (update.variableName === 'currentLabel') {
                        setCurrentLabel(update.currentValue as Position);
                    }
                } catch (error) {
                }
            };
            
            ws.onerror = () => {
                setIsConnected(false);
            };

            ws.onclose = () => {
                setIsConnected(false);
                
                // Tentativo di riconnessione dopo 3 secondi
                setTimeout(() => {
                    connectWebSocket();
                }, 3000);
            };
        };

        // Fetch iniziale del currentLabel
        const fetchInitialCurrentLabel = async () => {
            try {
                const response = await fetch('/MasterMind/Variables/currentLabel');
                const data = await response.json();
                console.log('Initial currentLabel:', data);
                setCurrentLabel(data.value as Position);
            } catch (error) {
            }
        };

        connectWebSocket();
        fetchInitialCurrentLabel();
        
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, []);

    const sendMessage = (message: any) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket non connesso, impossibile inviare messaggio');
        }
    };

    return (
        <WebSocketContext.Provider value={{ currentLabel, isConnected, sendMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
};
