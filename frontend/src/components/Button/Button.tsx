import React from "react"
import "./Button.css"
import { useNavigate } from "react-router-dom";

type ButtonProps = {
    children: React.ReactNode
    onClick?: () => void
    id?: string
    className?: string
    disabled?: boolean
}

export default function Button({ children, onClick, id, className, disabled }: ButtonProps) {
    const buttonClasses = `game-button ${className || ''}`.trim()

    if (className === "quitButton") {
        onClick = () => quitApp();
    }
    
    if (className === "mainMenuButton") {
        onClick = () => mainMenu();
    }

    return (
        <button className={buttonClasses} id={id} onClick={onClick} disabled={disabled}>
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

function mainMenu() {
    const navigate = useNavigate();
    navigate("/lobby");
}

