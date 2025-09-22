import { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage } from 'electron';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let backendPid = null;

// Ricevi il PID del processo backend dal preload
ipcMain.on('backend-process-pid', (event, pid) => {
    backendPid = pid;
    console.log(`Backend PID ricevuto: ${pid}`);
});

function createWindow() {
    const win = new BrowserWindow({
        width: 850,
        height: 600,
        minWidth: 850,
        minHeight: 600,
        icon: path.join(__dirname, 'frontend', 'src', 'assets', 'Images', 'logo.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
}

app.whenReady().then(() => {
    createWindow();

    Menu.setApplicationMenu(null);
    const tray = new Tray(nativeImage.createFromPath('frontend/src/assets/Images/logo.png'));
        const trayMenu = Menu.buildFromTemplate([
            {
                label: 'Exit',
                click: () => {
                    saveAndQuit();
                }
            }
        ]);
        tray.setContextMenu(trayMenu);
});

// Handler per chiudere l'app dal frontend
ipcMain.on('quit-app', () => {
    saveAndQuit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();

        Menu.setApplicationMenu(null);
        const tray = new Tray(nativeImage.createFromPath('frontend/src/assets/Images/logo.png'));
        const trayMenu = Menu.buildFromTemplate([
            {
                label: 'Exit',
                click: () => {
                    saveAndQuit();
                }
            }
        ]);
        tray.setContextMenu(trayMenu);
    }
});

// Funzione per salvare e chiudere l'app
async function saveAndQuit() {
    try {
        const response = await fetch('http://localhost:8080/MasterMind/saveGame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ instraction: 'saveGame' })
        });

        await response.json();
    } catch (error) {
        console.log('Errore nel salvataggio durante la chiusura:', error.message);
    }

    // Termina il processo backend direttamente se disponibile
    if (backendPid) {
        exec(`taskkill /F /PID ${backendPid}`, (error) => {
            if (error) {
                console.log('Errore terminando processo backend diretto, usando fallback');
            }
        });
        
        // Termina anche eventuali processi figlio
        exec(`taskkill /F /T /PID ${backendPid}`, (error) => {
            if (error) console.log('Nessun processo figlio da terminare');
        });
    } else {
        console.log('PID backend non disponibile, usando metodi fallback');
    }

    // Fallback: termina tutti i processi Java (metodo precedente)
    exec('taskkill /F /IM java.exe', (error) => {
        if (error) console.log('Nessun processo Java da terminare');
    });

    // Termina processi Node.js sulla porta 3000
    exec('netstat -ano | findstr :3000', (error, stdout) => {
        if (!error && stdout) {
            const lines = stdout.split('\n');
            lines.forEach(line => {
                const parts = line.trim().split(/\s+/);
                const pid = parts[parts.length - 1];
                if (pid && pid !== '0') {
                    exec(`taskkill /F /PID ${pid}`, () => { });
                }
            });
        }
    });

    // Aspetta un momento e poi termina Electron
    setTimeout(() => {
        process.exit(0);
    }, 1000);
}

app.on('window-all-closed', () => {
    saveAndQuit();
});