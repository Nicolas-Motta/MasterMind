package com.backend.controller;


import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.backend.ObjectGame;

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
            this.game = new ObjectGame();
            return new CheckResponse(true);
        } else {
            return new CheckResponse(false);
        }
    }
}
