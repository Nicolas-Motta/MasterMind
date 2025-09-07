package com.backend.controller.PlayController.Response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CheckGameResponse {
    @JsonProperty("redPins")
    private int redPins; // Pallini rossi - posizione e colore corretti
    
    @JsonProperty("whitePins") 
    private int whitePins; // Pallini bianchi - colore giusto, posizione sbagliata
    
    @JsonProperty("errorMessage")
    private String errorMessage; // Messaggio di errore personalizzato

    public CheckGameResponse() {}

    public CheckGameResponse(int redPins, int whitePins) {
        this.redPins = redPins;
        this.whitePins = whitePins;
    }
    
    public CheckGameResponse(String errorMessage) {
        this.redPins = -1;
        this.whitePins = -1;
        this.errorMessage = errorMessage;
    }

    // Metodo statico per creare una risposta di errore
    public static CheckGameResponse getError() {
        return new CheckGameResponse(-1, -1);
    }
    
    // Metodo statico per creare una risposta di errore con messaggio personalizzato
    public static CheckGameResponse getError(String errorMessage) {
        return new CheckGameResponse(errorMessage);
    }

    public int getRedPins() {
        return redPins;
    }

    public void setRedPins(int redPins) {
        this.redPins = redPins;
    }

    public int getWhitePins() {
        return whitePins;
    }

    public void setWhitePins(int whitePins) {
        this.whitePins = whitePins;
    }
    
    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}
