package com.backend.controller.SystemController;


import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.backend.ObjectGame;
import com.backend.controller.CheckResponse;
import com.backend.controller.Message;

@RestController
@RequestMapping("/MasterMind")
@CrossOrigin(origins = "http://localhost:3000")
public class SystemController {

    @Autowired
    private ObjectGame game;

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
            return new CheckResponse(true);
        } else {
            return new CheckResponse(false);
        }
    }
}
