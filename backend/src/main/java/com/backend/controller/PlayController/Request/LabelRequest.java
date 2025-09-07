package com.backend.controller.PlayController.Request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.backend.Enums.Position;

public class LabelRequest {
    @JsonProperty("instructions")
    private String instructions;
    
    @JsonProperty("id")
    private Position id;

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
}
