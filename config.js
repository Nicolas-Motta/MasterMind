import { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage } from 'electron';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let child_process = [];
    

try {
    const backend = spawn(process.platform === 'win32' ? 'mvnw.cmd' : './mvnw', ['spring-boot:run'], { cwd: path.join(__dirname, 'backend'), shell: process.platform === 'win32' });
    backend.on('exit', (code, signal) => {
        const idx = child_process.indexOf(backend);
        if (idx !== -1) child_process.splice(idx, 1);
    });
    backend.on('error', (err) => console.error('backend spawn error', err));
    child_process.push(backend);

    const frontend = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'dev'], { cwd: path.join(__dirname, 'frontend'), shell: process.platform === 'win32' });
    frontend.on('exit', (code, signal) => {
        const idx = child_process.indexOf(frontend);
        if (idx !== -1) child_process.splice(idx, 1);
    });
    frontend.on('error', (err) => console.error('frontend spawn error', err));
    child_process.push(frontend);

} catch (err) {
    console.error('start-processes handler error', err);
}

function createWindow() {
    const win = new BrowserWindow({
        width: 850,
        height: 600,
        minWidth: 850,
        minHeight: 600,
        icon: path.join(__dirname, 'frontend', 'src', 'assets', 'Icons', 'png', 'logo.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    win.loadURL('http://localhost:3000');
}

app.whenReady().then(() => {
    createWindow();

    ////Menu.setApplicationMenu(null);
    const tray = new Tray(nativeImage.createFromPath(path.join(__dirname, 'frontend', 'src', 'assets', 'Icons', 'png', 'logo.png')));
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


ipcMain.on('quit-app', () => {
    saveAndQuit();
});


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

    child_process.forEach(cp => {
        exec(`taskkill /F /PID ${cp.pid}`, (error) => {
            if (error) {
                console.log('Errore terminando');
            }
        });

        exec(`taskkill /F /T /PID ${cp.pid}`, (error) => {
            if (error) console.log('Nessun processo figlio da terminare');
        });
    })

    setTimeout(() => {
        process.exit(0);
    }, 10);
}

app.on('window-all-closed', () => {
    saveAndQuit();
});