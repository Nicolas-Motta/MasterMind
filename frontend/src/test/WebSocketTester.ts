import { Client } from '@stomp/stompjs';

interface WebSocketTestResult {
    success: boolean;
    message: string;
    timestamp: string;
}

class WebSocketTester {
    private client: Client | null = null;
    private isConnected: boolean = false;

    /**
     * Testa la connessione WebSocket al server Spring Boot
     */
    async testConnection(useSockJS: boolean = false): Promise<WebSocketTestResult> {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const endpoint = useSockJS ? '/masterMind-sockjs' : '/masterMind';
            const protocol = useSockJS ? 'http' : 'ws';
            const url = `${protocol}://localhost:8080${endpoint}`;

            console.log(`🔄 Tentativo connessione ${useSockJS ? 'SockJS' : 'WebSocket nativo'}: ${url}`);

            // Configura il client STOMP
            this.client = new Client({
                // Usa WebSocket nativo o SockJS
                brokerURL: useSockJS ? undefined : url,
                webSocketFactory: useSockJS ? () => {
                    // Implementazione SockJS manuale semplificata
                    const ws = new WebSocket('ws://localhost:8080/masterMind');
                    return ws;
                } : undefined,

                // Debug in console
                debug: (str) => {
                    console.log('STOMP Debug:', str);
                },

                // Timeout di connessione
                connectionTimeout: 10000,

                // Callback quando si connette
                onConnect: (frame) => {
                    console.log('✅ WebSocket connesso!', frame);
                    this.isConnected = true;

                    resolve({
                        success: true,
                        message: `Connessione riuscita in ${Date.now() - startTime}ms (${useSockJS ? 'SockJS' : 'WebSocket nativo'})`,
                        timestamp: new Date().toISOString()
                    });
                },

                // Callback in caso di errore
                onStompError: (frame) => {
                    console.error('❌ Errore STOMP:', frame);
                    resolve({
                        success: false,
                        message: `Errore STOMP: ${frame.headers.message || 'Unknown error'}`,
                        timestamp: new Date().toISOString()
                    });
                },

                // Callback per errori WebSocket
                onWebSocketError: (error) => {
                    console.error('❌ Errore WebSocket:', error);
                    resolve({
                        success: false,
                        message: `Errore WebSocket: ${error}`,
                        timestamp: new Date().toISOString()
                    });
                },

                // Callback quando si disconnette
                onDisconnect: () => {
                    console.log('🔌 WebSocket disconnesso');
                    this.isConnected = false;
                }
            });

            // Se non è SockJS, usa l'URL direttamente
            if (!useSockJS) {
                this.client.brokerURL = url;
            }

            // Avvia la connessione
            this.client.activate();

            // Timeout di sicurezza
            setTimeout(() => {
                if (!this.isConnected) {
                    resolve({
                        success: false,
                        message: 'Timeout: Connessione non riuscita entro 10 secondi',
                        timestamp: new Date().toISOString()
                    });
                }
            }, 10000);
        });
    }

    /**
     * Testa l'invio e ricezione di messaggi privati al server Spring Boot
     */
    async testMessage(): Promise<WebSocketTestResult> {
        if (!this.client || !this.isConnected) {
            return {
                success: false,
                message: 'Non connesso al WebSocket',
                timestamp: new Date().toISOString()
            };
        }

        return new Promise((resolve) => {
            const testMessage = 'Test Message ' + Date.now();
            let messageReceived = false;

            // Sottoscrivi al canale di risposta privato (user-specific)
            const subscription = this.client!.subscribe('/user/queue/reply', (message) => {
                console.log('✅ Messaggio privato ricevuto:', message.body);
                messageReceived = true;

                // Pulisci la sottoscrizione
                subscription.unsubscribe();

                resolve({
                    success: true,
                    message: `Messaggio privato inviato e ricevuto: "${message.body}"`,
                    timestamp: new Date().toISOString()
                });
            });

            // Invia il messaggio
            console.log('📤 Invio messaggio privato:', testMessage);
            this.client!.publish({
                destination: '/game/',  // Questo va a /game/ (con prefisso)
                body: testMessage
            });

            // Timeout per la ricezione del messaggio
            setTimeout(() => {
                if (!messageReceived) {
                    subscription.unsubscribe();
                    resolve({
                        success: false,
                        message: 'Timeout: Messaggio non ricevuto entro 5 secondi',
                        timestamp: new Date().toISOString()
                    });
                }
            }, 5000);
        });
    }

    /**
     * Disconnette dal WebSocket
     */
    disconnect(): void {
        if (this.client) {
            this.client.deactivate();
            this.client = null;
            this.isConnected = false;
        }
    }

    /**
     * Test completo con fallback automatico
     */
    async runFullTest(): Promise<void> {
        console.log('🧪 === INIZIO TEST WEBSOCKET ===');

        try {
            // Test 1: Prova prima WebSocket nativo
            console.log('\n1️⃣ Test connessione WebSocket nativo...');
            let connectionResult = await this.testConnection(false);
            console.log('Risultato connessione nativa:', connectionResult);

            // Se fallisce, prova SockJS
            if (!connectionResult.success) {
                console.log('\n🔄 Tentativo fallback con SockJS...');
                connectionResult = await this.testConnection(true);
                console.log('Risultato connessione SockJS:', connectionResult);
            }

            if (!connectionResult.success) {
                console.log('❌ Test fallito: impossibile connettersi');
                return;
            }

            // Aspetta un po' per stabilizzare la connessione
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Test 2: Invio/Ricezione messaggi
            console.log('\n2️⃣ Test invio/ricezione messaggi...');
            const messageResult = await this.testMessage();
            console.log('Risultato messaggio:', messageResult);

            // Test 3: Disconnessione
            console.log('\n3️⃣ Test disconnessione...');
            this.disconnect();

            console.log('\n✅ === TEST COMPLETATO ===');

        } catch (error) {
            console.error('❌ Errore durante il test:', error);
        }
    }
}

// Funzione di utilità per eseguire il test come funzione standalone
export async function runWebSocketTest(): Promise<void> {
    const tester = new WebSocketTester();
    await tester.runFullTest();
}

export default WebSocketTester;
