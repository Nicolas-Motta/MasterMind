import { useRef, useState, useEffect } from "react";
import { type Color as ColorType } from "../../Types/Color";
import { type Position } from "../../Types/Position";
import { usePositionContext } from "../../contexts/PositionContext";
import "./Ball.css";

export interface BallProps {
    id: string;
    color: ColorType;
    position: Position;
    isDraggable?: boolean;
}

export default function Ball({ id, color, position, isDraggable = true }: BallProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
    const [originalPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [ballInfo, setBallInfo] = useState<{ id: string; color: ColorType; position: Position }>({ id, color, position });
    const { setX, setY, setBall } = usePositionContext();

    const onPointerDown = (e: React.PointerEvent) => {
        if (!isDraggable) return; // Prevent dragging if disabled
        
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
                const rect = ref.current.getBoundingClientRect();
                setBall({
                    id: ballInfo.id,
                    x: rect.left,  
                    y: rect.top,   
                    color: ballInfo.color,
                    position: ballInfo.position 
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
            "RED": "#FF4444",    
            "BLUE": "#4488FF",     
            "GREEN": "#44FF44",    
            "YELLOW": "#FFD700",   
            "ORANGE": "#FF6600",   
            "PURPLE": "#BB44FF",   
            "ERROR": "#888888"     
        };
        return colorMap[color] || "#888888";
    };

    const ballStyle = {
        transform: `translate(${coordinates.x}px, ${coordinates.y}px)`,
        cursor: !isDraggable ? 'default' : (isDragging ? 'grabbing' : 'grab'),
        '--ball-color': getColorStyle(ballInfo.color)
    } as React.CSSProperties & { '--ball-color': string };

    return (
        <div 
            className={`Ball ${isDragging ? 'dragging' : ''}`}
            id={ballInfo?.id}
            ref={ref} 
            style={ballStyle} 
            onPointerDown={onPointerDown}
        >
        </div>
    );
}
