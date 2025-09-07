package com.backend.controller.PlayController.Request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.backend.Ball;
import com.backend.Enums.Position;

public class SetLabelRequest {
    @JsonProperty("instructions")
    private String instructions;
    
    @JsonProperty("id")
    private Position id;
    
    @JsonProperty("composition")
    private Ball[] composition;

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public Position getId() {
        return id;
    }

    public void setId(Position id) {
        this.id = id;
    }

    public Ball[] getComposition() {
        return composition;
    }

    public void setComposition(Ball[] composition) {
        this.composition = composition;
    }
}
