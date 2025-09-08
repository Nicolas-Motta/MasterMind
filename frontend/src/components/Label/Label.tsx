import { useState, useEffect, useRef } from "react";
import Ball from "../Ball/Ball";
import { usePositionContext } from "../../contexts/PositionContext";
import { useWebSocket } from "../../contexts/TransfertContext";
import { type Position } from "../../Types/Position";
import { type Color as ColorType } from "../../Types/Color";
import "./Label.css"
import Button from "../Button/Button";

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
    Label: BallData[];
}

interface CheckResponse {
    redPins: number;
    whitePins: number;
}

export interface LabelProps {
    id: Position;

}

export default function Label({ id }: LabelProps) {
    const [composition, setComposition] = useState<(BallData | null)[] | null>(null);
    const [checkResult, setCheckResult] = useState<CheckResponse | null>(null);
    const { currentLabel } = useWebSocket();
    const { ball } = usePositionContext();
    const labelRef = useRef<HTMLDivElement>(null);

    // Funzione helper per verificare se questo label è attivo
    const isCurrentLabel = () => {
        return currentLabel === id;
    };

    // Funzione helper per convertire la posizione in numero per confronti
    const getPositionNumber = (position: Position): number => {
        switch (position) {
            case "LABEL0": return 0;
            case "LABEL1": return 1;
            case "LABEL2": return 2;
            case "LABEL3": return 3;
            case "LABEL4": return 4;
            case "LABEL5": return 5;
            default: return -1;
        }
    };

    // Funzione helper per verificare se questo label è già stato giocato
    const isLabelPlayed = (): boolean => {
        if (!currentLabel) return false;
        const currentLabelNum = getPositionNumber(currentLabel);
        const thisLabelNum = getPositionNumber(id);
        return thisLabelNum < currentLabelNum;
    };
    
    useEffect(() => {
        if (!ball || !labelRef.current) return;

        if (!isCurrentLabel()) {
            return;
        }

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

                // Controlla se la pallina trascinata è già in una posizione nella composition
                const existingBallIndex = composition.findIndex(registeredBall =>
                    registeredBall && registeredBall.id === ball.id
                );

                // Crea una nuova composizione
                const newComposition = [...composition];

                // Se la pallina è già registrata in un'altra posizione, rimuovila da quella posizione
                if (existingBallIndex !== -1) {
                    newComposition[existingBallIndex] = null;
                }

                // Genera un nuovo ID univoco per permettere multiple palline dello stesso colore
                // Manteniamo il formato originale ma aggiungiamo un timestamp per unicità
                const timestamp = Date.now().toString().slice(-4); // Ultimi 4 cifre del timestamp
                const newBallId = ball.id.replace(/\d+$/, '') + timestamp;

                // Posiziona la pallina nella nuova posizione
                newComposition[index] = {
                    id: newBallId,
                    color: ball.color as ColorType,
                    position: id
                };

                pushLabel(newComposition);
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
    const pushLabel = async (newComposition: (BallData | null)[]) => {
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

            const response = await fetch('/MasterMind/setLabel', {
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

    // Funzione per calcolare i pin senza inviare la risposta
    const calculatePins = async (compositionData: (BallData | null)[]) => {
        try {
            const requestBody = {
                instruction: "calculatePins",
                id: id,
                composition: compositionData
            };

            const response = await fetch('/MasterMind/calculatePins', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: CheckResponse = await response.json();

            setCheckResult(data);

        } catch (error) {
            console.error(`Errore nel calcolo dei pin:`, error);
            setCheckResult(null);
        }
    };

    const sendResponse = async () => {

        if (!isCurrentLabel()) {
            return;
        }

        try {
            const requestBody = {
                instruction: "sendResponse",
                id: id,
                composition: composition
            };

            const response = await fetch('/MasterMind/sendResponse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: CheckResponse = await response.json();

            // Aggiorna lo stato con la risposta del controllo
            setCheckResult(data);

        } catch (error) {
            console.error(`Errore nell'invio della risposta:`, error);
            // In caso di errore, resetta il risultato
            setCheckResult(null);
        }
    };

    useEffect(() => {
        const fetchLabel = async (id: Position) => {

            const requestBody: LabelRequest = {
                instructions: "getLabel",
                id: id
            };

            try {
                const response = await fetch('/MasterMind/getLabel', {
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

                // Assicuriamoci che la risposta sia sempre un array di 4 elementi
                let labelData: (BallData | null)[];

                if (data.Label && Array.isArray(data.Label)) {
                    // Se abbiamo dei dati, creiamo un array di 4 elementi
                    labelData = Array.from({ length: 4 }, (_, index) => 
                        data.Label[index] || null
                    );
                } else {
                    // Se non abbiamo dati, creiamo un array vuoto di 4 elementi
                    labelData = Array.from({ length: 4 }, () => null);
                }
                setComposition(labelData);
                
                // Calcola automaticamente i pin solo per i label già giocati
                if (isLabelPlayed()) {
                    calculatePins(labelData);
                }

            } catch (err) {
                setComposition(
                    Array.from({ length: 4 }, () => ({ id: "error", color: "ERROR", position: "ERROR" }))
                )
            }
        };
        fetchLabel(id);
    }, [id]);


    return (
        <div className="label" ref={labelRef}>
            {Array.from({ length: 4 }, (_, index) => (
                <div className="dropZone" key={index}>
                    {composition !== null && composition[index] !== null ? (
                        <Ball
                            id={composition[index]!.id}
                            color={composition[index]!.color as ColorType}
                            position={(composition[index]!.position || id) as Position}
                            isDraggable={isCurrentLabel()}
                        />
                    ) : null}
                </div>
            ))}
            <div className="responseZone">
                {checkResult && (
                    <>
                        {/* Genera i pin rossi */}
                        {Array.from({ length: checkResult.redPins }, (_, index) => (
                            <div key={`red-${index}`} className="pin red"></div>
                        ))}
                        {/* Genera i pin bianchi */}
                        {Array.from({ length: checkResult.whitePins }, (_, index) => (
                            <div key={`white-${index}`} className="pin white"></div>
                        ))}
                    </>
                )}
            </div>
            <Button onClick={() => sendResponse()}>Send</Button>
        </div>
    )
}