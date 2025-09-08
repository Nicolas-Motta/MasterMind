package com.backend.controller.SystemController;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.backend.Object.Game;
import com.backend.controller.SystemController.Request.*;
import com.backend.controller.SystemController.Response.*;
import com.backend.controller.PlayController.PlayController;

/**
 * Controller REST per la gestione delle operazioni di sistema del gioco MasterMind.
 ** Fornisce endpoint per ping, creazione nuovo gioco, salvataggio e caricamento dello stato.
 */
@RestController
@RequestMapping("/MasterMind")
@CrossOrigin(origins = "*")
public class SystemController {

    @Autowired
    private Game game;

    @Autowired
    private PlayController playController;

    String filePath = "game.dat";

    /**
     * Valida se l'istruzione ricevuta corrisponde a quella attesa.
     * 
     * @param instruction L'istruzione ricevuta dal client
     * @param expected L'istruzione attesa dal metodo
     * @return true se l'istruzione è valida, false altrimenti
     */
    private boolean isValidInstruction(String instruction, String expected) {
        return expected.equals(instruction);
    }

    /**
     * Endpoint per verificare la connessione con il server.
     * Risponde con "pong" se l'istruzione è "ping", altrimenti stringa vuota.
     * 
     * @param message Il messaggio contenente l'istruzione "ping"
     * @return ApiResponse contenente "pong" se valido, stringa vuota altrimenti
     */
    @PostMapping("/ping")
    public SystemResponse<String> ping(@RequestBody SystemRequest message) {
        return isValidInstruction(message.getInstraction(), "ping") ? 
            new SystemResponse<>("pong") : new SystemResponse<>("");
    }

    /**
     * Endpoint per creare un nuovo gioco.
     * Inizializza una nuova partita e resetta l'indice delle palline home.
     * 
     * @param message Il messaggio contenente l'istruzione "newGame"
     * @return ApiResponse con boolean che indica il successo dell'operazione
     */
    @PostMapping("/newGame")
    public SystemResponse<Boolean> createNewGame(@RequestBody SystemRequest message) {
        if (isValidInstruction(message.getInstraction(), "newGame")) {
            this.game.newGame();
            this.playController.resetHomeBallIndex(); // Reset dell'indice delle palline home
            return SystemResponse.gameOperation(true);
        } else {
            return SystemResponse.gameOperation(false);
        }
    }

    /**
     * Endpoint per salvare lo stato corrente del gioco su file.
     * Salva i dati del gioco nel file specificato da filePath.
     * 
     * @param message Il messaggio contenente l'istruzione "saveGame"
     * @return ApiResponse con messaggio di successo o errore
     */
    @PostMapping("/saveGame")
    public SystemResponse<Void> saveGame(@RequestBody SystemRequest message) {;
        if (!isValidInstruction(message.getInstraction(), "saveGame")) {
            return SystemResponse.error("Istruzione non valida");
        }

        return this.game.saveGameState(filePath) ? 
            SystemResponse.success() : 
            SystemResponse.error("Errore durante il salvataggio del gioco");
    }

    /**
     * Endpoint per caricare uno stato del gioco precedentemente salvato.
     * Carica i dati del gioco dal file specificato da filePath.
     * 
     * @param message Il messaggio contenente l'istruzione "loadGame"
     * @return ApiResponse con messaggio di successo o errore
     */
    @PostMapping("/loadGame")
    public SystemResponse<Void> loadGame(@RequestBody SystemRequest message) {
        if (!isValidInstruction(message.getInstraction(), "loadGame")) {
            return SystemResponse.error("Istruzione non valida");
        }

        return this.game.loadGameState(filePath) ? 
            SystemResponse.success() : 
            SystemResponse.error("Errore durante il caricamento del gioco o file non trovato");
    }
}
