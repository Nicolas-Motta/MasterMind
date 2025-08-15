import { useRef, useState, useEffect } from "react";
import { type Color as ColorType } from "../../Types/Color";
import "./Ball.css";

export interface BallProps {
    getBallInfo?: () => Promise<{ id: string; color: ColorType }> | { id: string; color: ColorType };
}

export default function Ball({ getBallInfo }: BallProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [originalPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [ballInfo, setBallInfo] = useState<{ id: string; color: ColorType }>({ id: "error", color: "ERROR" });

    // Esegue la funzione solo al primo render
    useEffect(() => {
        if (getBallInfo) {
            (async () => {
                try {
                    const info = await getBallInfo();
                    setBallInfo(info);
                } catch (error) {
                    setBallInfo({
                        id: "error",
                        color: "ERROR"
                    });
                }
            })();
        }
    }, [getBallInfo]);

    const onPointerDown = (e: React.PointerEvent) => {
        const px = e.clientX;
        const py = e.clientY;
        
        // Calcola l'offset dal punto di click alla posizione attuale della pallina
        const ox = px - position.x;
        const oy = py - position.y;
        
        setDragOffset({ x: ox, y: oy });
        setIsDragging(true);
        
        // Previene la selezione del testo durante il drag
        e.preventDefault();
    };

    useEffect(() => {
        const handlePointerMove = (e: PointerEvent) => {
            if (!isDragging) return;
            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;
            
            setPosition({ x: newX, y: newY });
        };

        const handlePointerUp = () => {
            setIsDragging(false);
            // Torna alla posizione originale quando rilasciata
            setPosition(originalPosition);
        };

        if (isDragging) {
            document.addEventListener("pointermove", handlePointerMove);
            document.addEventListener("pointerup", handlePointerUp);
        }

        return () => {
            document.removeEventListener("pointermove", handlePointerMove);
            document.removeEventListener("pointerup", handlePointerUp);
        };
    }, [isDragging, dragOffset]);

    // Funzione per convertire l'enum colore in colore CSS
    const getColorStyle = (color: ColorType): string => {
        const colorMap: Record<ColorType, string> = {
            "RED": "#FF0000",
            "BLUE": "#0000FF", 
            "GREEN": "#00FF00",
            "YELLOW": "#FFFF00",
            "ORANGE": "#FFA500",
            "PURPLE": "#800080",
            "ERROR": "#808080" // Colore di errore
        };
        return colorMap[color] || "#808080";
    };

    const ballStyle = {
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'grab',
        backgroundColor: getColorStyle(ballInfo.color)
    };

    return (
        <div 
            className="Ball"
            id={ballInfo?.id}
            ref={ref} 
            style={ballStyle} 
            onPointerDown={onPointerDown}
        >
        </div>
    );
}
