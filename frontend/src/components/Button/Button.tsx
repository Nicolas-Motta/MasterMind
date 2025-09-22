import React, { useState } from "react"
import "./Button.css"
import { useNavigate } from "react-router-dom";

type ButtonProps = {
    children: React.ReactNode
    onClick?: () => void
    id?: string
    className?: string
    disabled?: boolean
}

export default function Button({ children, onClick, id, className, disabled = false }: ButtonProps) {
    const [isDisabled, setIsDisabled] = useState(disabled);
    const navigate = useNavigate();

    if (className === "quitButton") {
        onClick = () => quitApp();
    }

    if (className === "mainMenuButton") {
        onClick = async () => {
            setIsDisabled(true);
            await mainMenu(navigate);
            setIsDisabled(false);
        };
    }

    if (className === "newGameButton") {
        onClick = async () => {
            setIsDisabled(true);
            await newGame(navigate);
            setIsDisabled(false);
        };
    }

    if (className === "continueGameButton") {
        onClick = async () => {
            setIsDisabled(true);
            await continueGame(navigate);
            setIsDisabled(false);
        };
    }

    return (
        <button className={className} id={id} onClick={!isDisabled ? onClick : undefined}>
            {children}
        </button>
    )
}

async function quitApp() {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.send('quit-app');
        } else {
            window.close();
        }
}

async function mainMenu(navigate: ReturnType<typeof useNavigate>) {
    try {
        const saveResponse = await fetch('/MasterMind/saveGame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ instraction: 'saveGame' })
        });

        // Aspetta la risposta del salvataggio
        await saveResponse.json();

        // Naviga al lobby dopo il salvataggio
        navigate("/lobby");
    } catch (error) {
        // In caso di errore nel salvataggio, naviga comunque al lobby
        navigate("/lobby");
    }
}

async function newGame(navigate: ReturnType<typeof useNavigate>) {
    try {
        const response = await fetch("/MasterMind/newGame", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ instraction: "newGame" })
        });

        if (!response.ok) throw new Error("No response");

        const data = await response.json();

        if (data.checkResponse === true) {
            navigate("/game", { state: { timestamp: Date.now() } });
        } else {
            alert("Errore: Impossibile creare una nuova partita");
        }
    } catch (error) {
        alert("Errore di connessione. Riprova più tardi.");
    }
}

async function continueGame(navigate: ReturnType<typeof useNavigate>) {
    try {
        const response = await fetch('/MasterMind/loadGame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ instraction: 'loadGame' })
        });

        if (!response.ok) throw new Error("Errore nella richiesta di caricamento");

        const data = await response.json();

        if (data.success === true) {
            // Gioco caricato con successo, naviga alla schermata di gioco
            navigate("/game", { state: { timestamp: Date.now(), loaded: true } });
        } else {
            // Fallback: se non c'è un salvataggio, crea una nuova partita
            await newGame(navigate);
        }
    } catch (error) {
        // In caso di errore di connessione, crea una nuova partita
        alert("Errore di connessione. Verrà creata una nuova partita.");
        await newGame(navigate);
    }
}