import { exec } from 'child_process';
import { ipcRenderer } from 'electron';

const startTime = Date.now();
let backendProcess = null;

backendProcess = exec("cd backend && mvn spring-boot:run", (error, stdout, stderr) => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (error) {
        console.error(`Errore avvio backend: ${error.message}`);
        return;
    }
    console.log(`Backend avviato con successo in ${duration} ms`);
});

// Invia il PID del processo al main process
if (backendProcess && backendProcess.pid) {
    ipcRenderer.send('backend-process-pid', backendProcess.pid);
}