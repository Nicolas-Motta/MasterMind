import { useState, useEffect } from "react";
import Ball from "../Ball/Ball";
import { type Position } from "../../Types/Position";
import { type Color as ColorType } from "../../Types/Color";
import { useWebSocket } from "../../contexts/TransfertContext";
import "./Result.css"

interface BallData {
    id: string;
    color: ColorType;
    position: Position;
}

interface ResultResponse {
    Result: BallData[];
}

interface ResultRequest {
    instraction: string;
}

export default function Result() {
    const errorBall: BallData = {
        id: "error",
        color: "error" as ColorType,
        position: "RESULT" as Position
    };
    const [composition, setComposition] = useState<(BallData)[]>(
        Array(4).fill(errorBall)
    );
    const { isWin, isLoss } = useWebSocket();

    useEffect(() => {
        console.log("isWin or isLoss changed:", { isWin, isLoss });
        if (!isWin && !isLoss) {
            return;
        }

        const fetchResult = async () => {
            const requestBody: ResultRequest = {
                instraction: "getResult"
            };

            try {
                const response = await fetch('http://localhost:8080/MasterMind/getResult', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: ResultResponse = await response.json();
                setComposition(data.Result);
            } catch (error) {
                console.error('Error fetching result:', error);
                setComposition(Array(4).fill(errorBall));
            }
        };

        fetchResult();
    }, [isWin, isLoss]);



    return (
        <div className={`result ${isWin ? 'win' : isLoss ? 'loss' : ''}`}>
            {Array.from({ length: 4 }, (_, index) => (
                <div className="dropZone" key={index}>
                    {composition && composition[index] && composition[index] !== null ? (
                        <Ball
                            id={composition[index]!.id}
                            color={composition[index]!.color as ColorType}
                            position={(composition[index]!.position) as Position}
                            isDraggable={false}
                        />
                    ) : null}
                </div>
            ))}
            <div className="gap"></div>
            <p className={`victory-message ${isWin ? 'win' : isLoss ? 'loss' : ''}`}>
                {isWin === true ? "WIN!" : isLoss === true ? "LOSS!" : "RESULT"}
            </p>
        </div>
    );
}