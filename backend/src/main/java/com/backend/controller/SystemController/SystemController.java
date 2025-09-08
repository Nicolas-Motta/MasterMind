package com.backend.controller.SystemController;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.backend.Object.Game;
import com.backend.controller.Message;
import com.backend.controller.PlayController.PlayController;
import com.backend.controller.SystemController.Response.CheckResponse;
import com.backend.controller.SystemController.Response.SaveGameResponse;
import com.backend.controller.SystemController.Response.LoadGameResponse;

@RestController
@RequestMapping("/MasterMind")
@CrossOrigin(origins = "http://localhost:3000")
public class SystemController {

    @Autowired
    private Game game;

    @Autowired
    private PlayController playController;

    @PostMapping("/ping")
    public CheckResponse ping(@RequestBody Message message) {
        if ("ping".equals(message.getInstraction())) {
            return new CheckResponse("pong");
        } else {
            return new CheckResponse("");
        }
    }

    @PostMapping("/newGame")
    public CheckResponse createNewGame(@RequestBody Message message) {
        if ("newGame".equals(message.getInstraction())) {
            this.game.newGame(); // Chiama newGame() sull'istanza esistente
            this.playController.resetHomeBallIndex(); // Reset dell'indice delle palline home
            return new CheckResponse(true);
        } else {
            return new CheckResponse(false);
        }
    }

    @PostMapping("/saveGame")
    public SaveGameResponse saveGame(@RequestBody Message message) {
        if ("saveGame".equals(message.getInstraction())) {
            String filePath = "game_save.dat"; // File di salvataggio predefinito
            boolean success = this.game.saveGameState(filePath);
            
            if (success) {
                return new SaveGameResponse(true, "Gioco salvato con successo");
            } else {
                return new SaveGameResponse(false, "Errore durante il salvataggio del gioco");
            }
        } else {
            return new SaveGameResponse(false, "Istruzione non valida");
        }
    }

    @PostMapping("/loadGame")
    public LoadGameResponse loadGame(@RequestBody Message message) {
        if ("loadGame".equals(message.getInstraction())) {
            String filePath = "game_save.dat"; // File di salvataggio predefinito
            boolean success = this.game.loadGameState(filePath);
            
            if (success) {
                return new LoadGameResponse(true, "Gioco caricato con successo");
            } else {
                return new LoadGameResponse(false, "Errore durante il caricamento del gioco o file non trovato");
            }
        } else {
            return new LoadGameResponse(false, "Istruzione non valida");
        }
    }
}
