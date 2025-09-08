package com.backend.controller.PlayController.Request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.backend.Enums.Position;
import com.backend.Object.Ball;

/**
 * Classe unificata per tutte le richieste del controller PlayController.
 * Combina i campi di tutti i request precedenti in una singola classe flessibile.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PlayRequest {
    
    @JsonProperty("instruction")
    private String instruction;
    
    @JsonProperty("instructions")
    private String instructions;
    
    @JsonProperty("instraction")
    private String instraction;
    
    @JsonProperty("id")
    private Position id;
    
    @JsonProperty("composition")
    private Ball[] composition;

    /**
     * Costruttore vuoto per la deserializzazione JSON.
     */
    public PlayRequest() {}

    /**
     * Costruttore completo.
     */
    public PlayRequest(String instruction, String instructions, String instraction, Position id, Ball[] composition) {
        this.instruction = instruction;
        this.instructions = instructions;
        this.instraction = instraction;
        this.id = id;
        this.composition = composition;
    }

    // Factory methods per creare request specifiche

    /**
     * Crea una request per il controllo del gioco (equivalente a CheckRequest).
     */
    public static PlayRequest forCheck(String instruction, Ball[] composition) {
        return new PlayRequest(instruction, null, null, null, composition);
    }

    /**
     * Crea una request per ottenere una label (equivalente a LabelRequest).
     */
    public static PlayRequest forLabel(String instructions, Position id) {
        return new PlayRequest(null, instructions, null, id, null);
    }

    /**
     * Crea una request per impostare una label (equivalente a SetLabelRequest).
     */
    public static PlayRequest forSetLabel(String instructions, Position id, Ball[] composition) {
        return new PlayRequest(null, instructions, null, id, composition);
    }

    /**
     * Crea una request per i messaggi generici (equivalente a Message).
     */
    public static PlayRequest forMessage(String instraction) {
        return new PlayRequest(null, null, instraction, null, null);
    }

    // Getters e Setters

    /**
     * Ottiene l'istruzione (usata per CheckRequest).
     */
    public String getInstruction() {
        return instruction;
    }

    /**
     * Imposta l'istruzione (usata per CheckRequest).
     */
    public void setInstruction(String instruction) {
        this.instruction = instruction;
    }

    /**
     * Ottiene le istruzioni (usate per LabelRequest e SetLabelRequest).
     */
    public String getInstructions() {
        return instructions;
    }

    /**
     * Imposta le istruzioni (usate per LabelRequest e SetLabelRequest).
     */
    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    /**
     * Ottiene l'instraction (usata per Message).
     */
    public String getInstraction() {
        return instraction;
    }

    /**
     * Imposta l'instraction (usata per Message).
     */
    public void setInstraction(String instraction) {
        this.instraction = instraction;
    }

    /**
     * Ottiene l'ID della posizione.
     */
    public Position getId() {
        return id;
    }

    /**
     * Imposta l'ID della posizione.
     */
    public void setId(Position id) {
        this.id = id;
    }

    /**
     * Ottiene la composizione di palline.
     */
    public Ball[] getComposition() {
        return composition;
    }

    /**
     * Imposta la composizione di palline.
     */
    public void setComposition(Ball[] composition) {
        this.composition = composition;
    }

    // Metodi di utilità per determinare il tipo di request

    /**
     * Verifica se questa è una request di tipo Check.
     */
    public boolean isCheckRequest() {
        return instruction != null && composition != null;
    }

    /**
     * Verifica se questa è una request di tipo Label.
     */
    public boolean isLabelRequest() {
        return instructions != null && id != null && composition == null;
    }

    /**
     * Verifica se questa è una request di tipo SetLabel.
     */
    public boolean isSetLabelRequest() {
        return instructions != null && id != null && composition != null;
    }

    /**
     * Verifica se questa è una request di tipo Message.
     */
    public boolean isMessageRequest() {
        return instraction != null;
    }

    /**
     * Ottiene l'istruzione appropriata basata sul tipo di request.
     */
    public String getAnyInstruction() {
        if (instruction != null) return instruction;
        if (instructions != null) return instructions;
        if (instraction != null) return instraction;
        return null;
    }
}
