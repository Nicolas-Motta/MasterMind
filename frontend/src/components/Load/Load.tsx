

import "./Load.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../../assets/Images/logo.png";

export default function Load() {
    const navigate = useNavigate();

    useEffect(() => {
        let active = true;
        let timeoutId: NodeJS.Timeout | null = null;
        const ping = async () => {
            if (!active) return;
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
            <img src={logoImage} alt="Loading..." className="loading-logo" />
        </div>
    );
}
