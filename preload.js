import { exec } from 'child_process';

const startTime = Date.now();

exec("cd backend && mvn spring-boot:run", (error, stdout, stderr) => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (error) {
        console.error(`Errore avvio backend: ${error.message}`);
        return;
    }
    console.log(`Backend avviato con successo in ${duration} ms`);
});