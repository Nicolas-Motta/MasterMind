package com.backend.controller.PlayController;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.backend.Enums.Position;
import com.backend.Enums.Status;
import com.backend.Object.Ball;
import com.backend.Object.Game;
import com.backend.controller.PlayController.Request.PlayRequest;
import com.backend.controller.PlayController.Response.PlayResponse;

/**
 * Controller principale per la gestione del gioco MasterMind.
 * Gestisce tutte le operazioni di gioco attraverso endpoint REST.
 */
@RestController
@RequestMapping("/MasterMind")
@CrossOrigin(origins = "*")
public class PlayController {
    
    @Autowired
    private Game game;
    
    private int currentHomeBallIndex = 0;

    /**
     * Resetta l'indice della pallina corrente.
     */
    public void resetHomeBallIndex() {
        this.currentHomeBallIndex = 0;
    }

    /**
     * Converte una posizione enum in un indice numerico.
     * 
     * @param position La posizione da convertire
     * @return L'indice numerico corrispondente
     * @throws RuntimeException se la posizione non è valida
     */
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

    /**
     * Genera una nuova pallina per la sezione home.
     * 
     * @param request La richiesta contenente l'istruzione
     * @return PlayResponse contenente la nuova pallina o un errore
     */
    @PostMapping("/newHomeBall")
    public PlayResponse<?> newHomeBall(@RequestBody PlayRequest request) {
        if (!"newHomeBall".equals(request.getInstraction())) {
            return PlayResponse.error("Istruzione non valida");
        }
        
        Ball[] availableBalls = game.getBased();
        Ball selectedBall = availableBalls[currentHomeBallIndex];
        
        currentHomeBallIndex = (currentHomeBallIndex + 1) % availableBalls.length;
        PlayResponse<Ball> response = new PlayResponse<>();
        response.setBall(new Ball(selectedBall.getId(), selectedBall.getColor(), selectedBall.getPosition()));
        response.setSuccess(true);
        return response;
    }

    /**
     * Ottiene le palline di una label specifica.
     * 
     * @param request La richiesta contenente l'ID della label
     * @return PlayResponse contenente l'array di palline della label o un errore
     */
    @PostMapping("/getLabel")
    public PlayResponse<?> getLabel(@RequestBody PlayRequest request) {
        try {
            if (!"getLabel".equals(request.getInstructions())) {
                return PlayResponse.error("Istruzione non valida");
            }
            
            int labelIndex = convertPositionToIndex(request.getId());
            Ball[] label = game.getLabel(labelIndex);
            return PlayResponse.forLabel(label);
            
        } catch (RuntimeException e) {
            Ball[] errorArray = PlayResponse.getErrorBallArray();
            return new PlayResponse<>(false, e.getMessage(), errorArray);
        } catch (Exception e) {
            Ball[] errorArray = PlayResponse.getErrorBallArray();
            return new PlayResponse<>(false, e.getMessage(), errorArray);
        }
    }

    /**
     * Imposta una composizione di palline per una label specifica.
     * 
     * @param request La richiesta contenente l'ID della label e la composizione
     * @return PlayResponse contenente la composizione aggiornata o un errore
     */
    @PostMapping("/setLabel")
    public PlayResponse<?> setLabel(@RequestBody PlayRequest request) {
        try {
            if (!"setLabel".equals(request.getInstructions())) {
                return PlayResponse.error("Istruzione non valida");
            }
            
            int labelIndex = convertPositionToIndex(request.getId());
            
            game.setLabel(labelIndex, request.getComposition());
            Ball[] updatedLabel = game.getLabel(labelIndex);
            return PlayResponse.forComposition(updatedLabel);
            
        } catch (RuntimeException e) {
            Ball[] errorArray = PlayResponse.getErrorBallArray();
            return new PlayResponse<>(false, e.getMessage(), errorArray);
        } catch (Exception e) {
            Ball[] errorArray = PlayResponse.getErrorBallArray();
            return new PlayResponse<>(false, e.getMessage(), errorArray);
        }
    }



    /**
     * Controlla una composizione proposta dall'utente e restituisce il numero di pin rossi e bianchi.
     * Gestisce anche l'avanzamento del gioco e il controllo delle condizioni di vittoria.
     * 
     * @param request La richiesta contenente la composizione da controllare
     * @return PlayResponse contenente i pin rossi/bianchi o un errore
     */
    @PostMapping("/sendResponse")
    public PlayResponse<?> sendResponse(@RequestBody PlayRequest request) {
        try {
            if (!"sendResponse".equals(request.getInstruction())) {
                return PlayResponse.error("Istruzione non valida");
            }
            
            Ball[] userComposition = request.getComposition();
            
            if (userComposition == null || userComposition.length != 4) {
                return PlayResponse.error("Array non completo");
            }
            
            Ball[] correctComposition = game.getResult();
            
            int redPins = 0;
            int whitePins = 0;

            boolean[] userUsed = new boolean[userComposition.length];
            boolean[] correctUsed = new boolean[correctComposition.length];

            for (int i = 0; i < userComposition.length; i++) {
                if (userComposition[i].getColor() == correctComposition[i].getColor()) {
                    redPins++;
                    userUsed[i] = true;
                    correctUsed[i] = true;
                }
            }

            for (int i = 0; i < userComposition.length; i++) {
                if (!userUsed[i]) {
                    for (int j = 0; j < correctComposition.length; j++) {
                        if (!correctUsed[j] && userComposition[i].getColor() == correctComposition[j].getColor()) {
                            whitePins++;
                            correctUsed[j] = true;
                            break;
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

            return PlayResponse.forCheckGame(redPins, whitePins);

        } catch (RuntimeException e) {
            return PlayResponse.error(e.getMessage());
        } catch (Exception e) {
            return PlayResponse.error(e.getMessage());
        }
    }

    /**
     * Ottiene il risultato corretto del gioco
     * 
     * @param message Il messaggio contenente l'istruzione
     * @return PlayResponse contenente il risultato del gioco o un errore
     */
    @PostMapping("/getResult")
    public PlayResponse<?> getResult(@RequestBody PlayRequest message) {
        try {
            if (!"getResult".equals(message.getInstraction())) {
                return PlayResponse.error("Istruzione non valida");
            }
            
            Ball[] result = game.getResult();
            return PlayResponse.forResult(result);
            
        } catch (RuntimeException e) {
            Ball[] errorArray = PlayResponse.getErrorBallArray();
            return new PlayResponse<>(false, e.getMessage(), errorArray);
        } catch (Exception e) {
            Ball[] errorArray = PlayResponse.getErrorBallArray();
            return new PlayResponse<>(false, e.getMessage(), errorArray);
        }
    }
}