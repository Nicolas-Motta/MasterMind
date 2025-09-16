import { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage } from 'electron';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        icon: path.join(__dirname, 'frontend', 'src', 'assets', 'Images', 'logo.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    win.loadURL('http://localhost:3000');
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
// Funzione per salvare il gioco e terminare tutti i processi
async function saveAndQuit() {
    try {
        // Tenta di salvare il gioco prima di chiudere
        const response = await fetch('http://localhost:8080/MasterMind/saveGame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ instraction: 'saveGame' })
        });

        // Aspetta la risposta del salvataggio
        await response.json();
        console.log('Gioco salvato con successo prima della chiusura');
    } catch (error) {
        console.log('Errore nel salvataggio durante la chiusura:', error.message);
    }

    // Windows: termina tutti i processi Java
    exec('taskkill /F /IM java.exe', (error) => {
        if (error) console.log('Nessun processo Java da terminare');
    });

    // Termina processi Spring Boot sulla porta 8080
    exec('netstat -ano | findstr :8080', (error, stdout) => {
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