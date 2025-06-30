// Funzioni di utilità per Electron

declare global {
    interface Window {
        require: (module: string) => any;
    }
}

export function quitApp(): void {
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
