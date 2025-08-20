import { useState, useEffect, useRef } from "react";
import Ball from "../Ball/Ball";
import { usePositionContext } from "../../contexts/PositionContext";
import { type Position } from "../../Types/Position";
import { type Color as ColorType } from "../../Types/Color";
import "./Label.css"

interface LabelRequest {
    instructions: string;
    id: Position;
}

interface BallData {
    id: string;
    color: ColorType;
    position: Position;
}

interface LabelResponse {
    label: BallData[];
}

export interface LabelProps {
    id: Position;
}

export default function Label({ id }: LabelProps) {
    const [composition, setComposition] = useState<(BallData | null)[] | null>(null);
    const { ball } = usePositionContext();
    const labelRef = useRef<HTMLDivElement>(null);  


    useEffect(() => {
        if (!ball || !labelRef.current) return;

        const ballSize = window.innerWidth * 0.04; // 4vw in pixel
        const dropZones = labelRef.current.querySelectorAll('.dropZone');

        dropZones.forEach((dropZone, index) => {
            const rect = dropZone.getBoundingClientRect();
            
            const overlapArea = calculateOverlapArea(
                ball.x, ball.y, ballSize,
                rect.left, rect.top, ballSize
            );

            const ballArea = ballSize * ballSize;
            const overlapPercentage = (overlapArea / ballArea) * 100;

            if (overlapPercentage >= 50) {
                if (!composition) return;

                // Confronta ID della pallina mossa con tutti gli ID delle palline già registrate nella composition
                const isAlreadyRegistered = composition.some(registeredBall => 
                    registeredBall && registeredBall.id === ball.id
                );
                
                if (isAlreadyRegistered) {
                    // Rimuove la vecchia posizione della pallina
                    const updatedBalls = composition.filter(registeredBall => 
                        registeredBall && registeredBall.id !== ball.id
                    );
                    
                    const newComposition = [...updatedBalls];
                    newComposition[index] = {
                        id: ball.id,
                        color: ball.color as ColorType,
                        position: id
                    };

                    pushLabel(newComposition);
                    
                } else {
                    const newComposition = [...composition];
                    newComposition[index] = {
                        id: ball.id,
                        color: ball.color as ColorType,
                        position: id
                    };
                    
                    pushLabel(newComposition);
                }
            }
        });
    }, [ball]);

    const calculateOverlapArea = (
        x1: number, y1: number, size1: number,
        x2: number, y2: number, size2: number
    ): number => {
        const left = Math.max(x1, x2);
        const right = Math.min(x1 + size1, x2 + size2);
        const top = Math.max(y1, y2);
        const bottom = Math.min(y1 + size1, y2 + size2);

        if (left < right && top < bottom) {
            return (right - left) * (bottom - top);
        }
        return 0;
    };

    // Funzione per inviare l'array aggiornato al backend
    const pushLabel= async (newComposition: (BallData | null)[]) => {
        try {    
            const processedComposition = newComposition.map(ball => {
                if (ball === null) return null;
                return {
                    ...ball,
                    position: id
                };
            });

            const requestBody = {
                instructions: "setLabel",
                id: id,
                composition: processedComposition
            };

            const response = await fetch('http://localhost:8080/MasterMind/setLabel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setComposition(data.composition);

        } catch (error) {
            console.error(`Errore nell'aggiornamento Label:`, error);
        }
    };


    useEffect(() => {
        const fetchLabel = async (id: Position) => {

            const requestBody: LabelRequest = {
                instructions: "getLabel",
                id: id
            };

            try {
                const response = await fetch('http://localhost:8080/MasterMind/getLabel', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: LabelResponse = await response.json();
                
                const labelData = data.label && data.label.length > 0 
                    ? data.label 
                    : Array.from({ length: 4 }, () => null);
                
                setComposition(labelData);

            } catch (err) {
                setComposition(
                    Array.from({ length: 4 }, () => ({ id: "error", color: "ERROR", position: "ERROR" }))
                )
            }
        };
        fetchLabel(id);
    }, []);


    return (
        <div className="label" ref={labelRef}>
            {Array.from({ length: 4 }, (_, index) => (
                <div className="dropZone" key={index}>
                    {composition && composition[index] && composition[index] !== null ? (
                        <Ball
                            getBallInfo={() => Promise.resolve({
                                id: composition[index]!.id,
                                color: composition[index]!.color as ColorType,
                                position: (composition[index]!.position || id) as Position
                            })}
                        />
                    ) : null}
                </div>
            ))}
        </div>
    )
}