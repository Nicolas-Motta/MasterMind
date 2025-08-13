import React, {useState} from "react"
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
        onClick = () => mainMenu(navigate);
    }

    if (className === "newGameButton") {
        onClick = async () => {
            setIsDisabled(true);
            await newGame(navigate);
            setIsDisabled(false);
        };
    }

    return (
        <button className={className} id={id} onClick={!isDisabled ? onClick : undefined}>
            {children}
        </button>
    )
}

function quitApp() {
    try {
        // Controlla se siamo in ambiente Electron
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.send('quit-app');
        } else {
            // Fallback per browser web (chiude la tab/finestra)
            window.close();
        }
    } catch (error) {
        console.error('Errore durante la chiusura dell\'app:', error);
        // Fallback finale
        window.close();
    }
}

function mainMenu(navigate: ReturnType<typeof useNavigate>) {
    navigate("/lobby");
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
            navigate("/game");
        } else {
            alert("Errore: Impossibile creare una nuova partita");
        }
    } catch (error) {
        alert("Errore di connessione. Riprova più tardi.");
    }
}