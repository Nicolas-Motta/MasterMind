import { spawn } from 'child_process';
import { ipcRenderer } from 'electron';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const startTime = Date.now();

// Risolvi __dirname in modulo ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendDir = path.resolve(__dirname, 'backend');
const targetDir = path.join(backendDir, 'target');

function resolveJarPath() {
    try {
        const files = fs.readdirSync(targetDir);
        // prendi il primo .jar utile (escludi .original)
        const jar = files.find(f => f.endsWith('.jar') && !f.endsWith('.jar.original'));
        return jar ? path.join(targetDir, jar) : null;
    } catch {
        return null;
    }
}

function startBackendWithJar(jarPath) {
    const child = spawn('java', ['-jar', jarPath], {
        cwd: backendDir,
        shell: true,
        stdio: ['ignore', 'pipe', 'pipe']
    });

    child.stdout.on('data', (data) => {
        const text = data.toString();
        // inoltra log sulla console di Electron
        process.stdout.write(text);
        // Log friendly quando Spring Boot segnala l'avvio
        if (text.includes('Started') && text.includes('in') && text.includes('seconds')) {
            const duration = Date.now() - startTime;
            console.log(`Backend avviato in ~${duration} ms`);
        }
    });
    child.stderr.on('data', (data) => process.stderr.write(data));

    // Invia il PID del processo al main process
    if (child && child.pid) {
        ipcRenderer.send('backend-process-pid', child.pid);
    }

    child.on('error', (err) => {
        console.error('Errore processo backend:', err.message);
    });
    child.on('close', (code) => {
        console.log(`Backend terminato con codice: ${code}`);
    });

    return child;
}

const jarPath = resolveJarPath();
if (jarPath) {
    startBackendWithJar(jarPath);
} else {
    console.error('JAR backend non trovato in backend/target. Avvio backend saltato.');
}