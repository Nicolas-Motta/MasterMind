import { useRef, useState, useEffect } from "react";
import { type Color as ColorType } from "../../Types/Color";
import { type Position } from "../../Types/Position";
import { usePositionContext } from "../../contexts/PositionContext";
import "./Ball.css";

export interface BallProps {
    getBallInfo: () => Promise<{ id: string; color: ColorType; position: Position }>;
}

export default function Ball({ getBallInfo}: BallProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
    const [originalPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [ballInfo, setBallInfo] = useState<{ id: string; color: ColorType; position: Position }>({ id: "error", color: "ERROR", position: "ERROR" });
    const { setX, setY, setBall } = usePositionContext();

    useEffect(() => {
        if (getBallInfo) {
            (async () => {
                try {
                    const info = await getBallInfo();
                    setBallInfo(info);
                } catch (error) {
                    setBallInfo({
                        id: "error",
                        color: "ERROR",
                        position: "ERROR"
                    });
                }
            })();
        }
    }, [getBallInfo]);

    const onPointerDown = (e: React.PointerEvent) => {
        const px = e.clientX;
        const py = e.clientY;
        
        // Calcola l'offset dal punto di click alla posizione attuale della pallina
        const ox = px - coordinates.x;
        const oy = py - coordinates.y;
        
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
            
            setCoordinates({ x: newX, y: newY });
        };

        const handlePointerUp = () => {
            if (ballInfo.id !== "error" && ref.current) {
                // Ottieni le coordinate assolute della pallina dal DOM
                const rect = ref.current.getBoundingClientRect();
                
                setBall({
                    id: ballInfo.id,
                    x: rect.left,  // Coordinate assolute del viewport
                    y: rect.top,   // Coordinate assolute del viewport
                    color: ballInfo.color,
                    position: ballInfo.position // Include the position prop
                });
            }
            setIsDragging(false);
            setCoordinates(originalPosition);
        };

        if (isDragging) {
            document.addEventListener("pointermove", handlePointerMove);
            document.addEventListener("pointerup", handlePointerUp);
        }

        return () => {
            document.removeEventListener("pointermove", handlePointerMove);
            document.removeEventListener("pointerup", handlePointerUp);
        };
    }, [isDragging, dragOffset, setX, setY, coordinates.x, coordinates.y, ballInfo.id]);

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
        transform: `translate(${coordinates.x}px, ${coordinates.y}px)`,
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
