package com.backend.controller.PlayController;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.backend.ObjectGame;
import com.backend.Ball;
import com.backend.Enums.Color;
import com.backend.Enums.Position;
import com.backend.controller.BallResponse;
import com.backend.controller.Message;
import com.backend.controller.LabelRequest;
import com.backend.controller.LabelResponse;

@RestController
@RequestMapping("/MasterMind")
@CrossOrigin(origins = "http://localhost:3000")
public class PlayController {
    
    @Autowired
    private ObjectGame game;
    
    private int currentHomeBallIndex = 0;

    public void resetHomeBallIndex() {
        this.currentHomeBallIndex = 0;
    }

    @PostMapping("/newHomeBall")
    public BallResponse newHomeBall(@RequestBody Message message) {
        if (!"newHomeBall".equals(message.getInstraction())) {
            return new BallResponse(new Ball("error", Color.ERROR, Position.ERROR));
        }
        
        // Assicuriamoci che il gioco sia inizializzato
        if (game.getBased() == null) {
            game.newGame();
            currentHomeBallIndex = 0;
        }
        
        Ball[] availableBalls = game.getBased();
        Ball selectedBall = availableBalls[currentHomeBallIndex];
        
        currentHomeBallIndex = (currentHomeBallIndex + 1) % availableBalls.length;
        return new BallResponse(new Ball(selectedBall.getId(), selectedBall.getColor(), selectedBall.getPosition()));
    }

    @PostMapping("/getLabel")
    public LabelResponse getLabel(@RequestBody LabelRequest request) {
        try {
            if (!"getLabel".equals(request.getInstructions())) {
                return new LabelResponse(LabelResponse.getError());
            }
            Ball[] label = game.getLabel(request.getId());
            return new LabelResponse(label);
            
        } catch (RuntimeException e) {
            return new LabelResponse(LabelResponse.getError());
        } catch (Exception e) {
            return new LabelResponse(LabelResponse.getError());
        }
    }
}
