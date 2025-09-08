package com.backend.controller.PlayController;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.backend.Enums.Color;
import com.backend.Enums.Position;
import com.backend.Enums.Status;
import com.backend.Object.Ball;
import com.backend.Object.Game;
import com.backend.controller.Message;
import com.backend.controller.PlayController.Request.CheckRequest;
import com.backend.controller.PlayController.Request.LabelRequest;
import com.backend.controller.PlayController.Request.SetLabelRequest;
import com.backend.controller.PlayController.Response.BallResponse;
import com.backend.controller.PlayController.Response.CheckGameResponse;
import com.backend.controller.PlayController.Response.LabelResponse;
import com.backend.controller.PlayController.Response.ResultResponse;
import com.backend.controller.PlayController.Response.SetLabelResponse;

@RestController
@RequestMapping("/MasterMind")
@CrossOrigin(origins = "http://localhost:3000")
public class PlayController {
    
    @Autowired
    private Game game;
    
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



    @PostMapping("/sendResponse")
    public CheckGameResponse sendResponse(@RequestBody CheckRequest request) {
        try {
            if (!"sendResponse".equals(request.getInstruction())) {
                return CheckGameResponse.getError();
            }
            
            // Ottieni la composizione fornita dall'utente
            Ball[] userComposition = request.getComposition();
            
            // Controllo che l'array sia di 4 elementi
            if (userComposition == null || userComposition.length != 4) {
                return CheckGameResponse.getError("Array non completo");
            }
            
            // Ottieni la risposta corretta dal gioco
            Ball[] correctComposition = game.getResult();
            
            int redPins = 0;
            int whitePins = 0;

            // Array per tracciare quali posizioni sono già state controllate
            boolean[] userUsed = new boolean[userComposition.length];
            boolean[] correctUsed = new boolean[correctComposition.length];

            // palline rosse
            for (int i = 0; i < userComposition.length; i++) {
                if (userComposition[i].getColor() == correctComposition[i].getColor()) {
                    redPins++;
                    userUsed[i] = true;
                    correctUsed[i] = true;
                }
            }

            // palline bianche
            for (int i = 0; i < userComposition.length; i++) {
                if (!userUsed[i]) { // Se questa posizione non è già stata usata per un pallino rosso
                    for (int j = 0; j < correctComposition.length; j++) {
                        if (!correctUsed[j] && userComposition[i].getColor() == correctComposition[j].getColor()) {
                            whitePins++;
                            correctUsed[j] = true;
                            break; // Esce dal loop interno per evitare conteggi multipli
                        }
                    }
                }
            }
            
            if (redPins != 4) {
                Position currentLabel = game.getCurrentLabel();
                Position nextLabel = game.getNextLabel(currentLabel);
                if (nextLabel != null) {
                    game.setCurrentLabel(nextLabel);
                } else {
                    game.setStatus(Status.FINISHED);
                }
            } else {
                game.setStatus(Status.FINISHED);
                game.setIsWin(true);
            }

            return new CheckGameResponse(redPins, whitePins);

        } catch (RuntimeException e) {
            return CheckGameResponse.getError();
        } catch (Exception e) {
            return CheckGameResponse.getError();
        }
    }

    @PostMapping("/getResult")
    public ResultResponse getResult(@RequestBody Message message) {
        try {
            if (!"getResult".equals(message.getInstraction())) {
                return new ResultResponse(ResultResponse.getError());
            }
            
            Ball[] result = game.getResult();
            return new ResultResponse(result);
            
        } catch (RuntimeException e) {
            return new ResultResponse(ResultResponse.getError());
        } catch (Exception e) {
            return new ResultResponse(ResultResponse.getError());
        }
    }



    
}