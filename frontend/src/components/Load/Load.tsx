

import "./Load.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Load() {
    const navigate = useNavigate();

    useEffect(() => {
        let active = true;
        let timeoutId: NodeJS.Timeout | null = null;
        const ping = async () => {
            if (!active) return;
            console.log("Tentativo di ping al backend...");
            try {
                const response = await fetch("/MasterMind/ping", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ instraction: "ping" })
                });
                if (!response.ok) throw new Error("No response");
                const data = await response.json();
                console.log("Risposta dal backend:", data);
                if (data.checkResponse === "pong") {
                    active = false;
                    navigate("/lobby");
                    return;
                }
            } catch (e) {
                // errore o risposta non valida
            }
            timeoutId = setTimeout(ping, 4000);
        };
        ping();
        return () => {
            active = false;
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [navigate]);

    return (
        <div className="Load">
            <svg width="100" height="100">
                <rect x="10" y="10" width="80" height="80" fill="blue" />
            </svg>
        </div>
    );
}
