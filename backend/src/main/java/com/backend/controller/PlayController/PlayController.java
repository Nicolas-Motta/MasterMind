package com.backend.controller.PlayController;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import com.backend.ObjectGame;
import com.backend.Ball;
import com.backend.Enums.Color;
import com.backend.Enums.Position;
import com.backend.controller.BallResponse;
import com.backend.controller.Message;
import com.backend.controller.LabelRequest;
import com.backend.controller.LabelResponse;
import com.backend.controller.SetLabelRequest;
import com.backend.controller.SetLabelResponse;

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
            
            // Converti Position enum in integer per il metodo getLabel
            int labelIndex = convertPositionToIndex(request.getId());
            Ball[] label = game.getLabel(labelIndex);
            return new LabelResponse(label);
            
        } catch (RuntimeException e) {
            return new LabelResponse(LabelResponse.getError());
        } catch (Exception e) {
            return new LabelResponse(LabelResponse.getError());
        }
    }

    @PostMapping("/setLabel")
    public SetLabelResponse setLabel(@RequestBody SetLabelRequest request) {
        try {
            if (!"setLabel".equals(request.getInstructions())) {
                return new SetLabelResponse(SetLabelResponse.getError());
            }
            
            int labelIndex = convertPositionToIndex(request.getId());
            
            game.setLabel(labelIndex, request.getComposition());
            Ball[] updatedLabel = game.getLabel(labelIndex);
            return new SetLabelResponse(updatedLabel);
            
        } catch (RuntimeException e) {
            return new SetLabelResponse(SetLabelResponse.getError());
        } catch (Exception e) {
            return new SetLabelResponse(SetLabelResponse.getError());
        }
    }

    private int convertPositionToIndex(Position position) {
        switch (position) {
            case LABEL0: return 0;
            case LABEL1: return 1;
            case LABEL2: return 2;
            case LABEL3: return 3;
            case LABEL4: return 4;
            case LABEL5: return 5;
            default: throw new RuntimeException("Invalid label position: " + position);
        }
    }
}
