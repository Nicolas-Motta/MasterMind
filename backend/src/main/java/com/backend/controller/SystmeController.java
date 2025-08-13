package com.backend.controller;

import org.springframework.web.bind.annotation.*;
import com.backend.controller.Message;

@RestController
@RequestMapping("/MasterMind")
public class SystmeController {
    @PostMapping("/newGame")
    public Message receiveJson(@RequestBody Message message) {
        // Riceve JSON e lo restituisce come risposta
        return message;
    }

    @GetMapping("/newGame")
    public Message sendJson() {
        // Invia un JSON di esempio
        return new Message("Hello from API!");
    }
}
