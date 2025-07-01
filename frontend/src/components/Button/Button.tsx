import React from "react"
import "./Button.css"

type ButtonProps = {
    children: React.ReactNode
    onClick?: () => void
    id?: string
    className?: string
}

export default function Button({ children, onClick, id, className }: ButtonProps) {
    const buttonClasses = `game-button ${className || ''}`.trim()

    if (className === "quitButton") {
        onClick = () => quitApp();
    }

    return (
        <button className={buttonClasses} id={id} onClick={onClick}>
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