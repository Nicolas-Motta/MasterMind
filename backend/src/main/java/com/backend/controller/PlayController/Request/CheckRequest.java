package com.backend.controller.PlayController.Request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.backend.Ball;

public class CheckRequest {
    @JsonProperty("instruction")
    private String instruction;
    
    @JsonProperty("composition")
    private Ball[] composition;

    public CheckRequest() {}

    public CheckRequest(String instruction, Ball[] composition) {
        this.instruction = instruction;
        this.composition = composition;
    }

    public String getInstruction() {
        return instruction;
    }

    public void setInstruction(String instruction) {
        this.instruction = instruction;
    }

    public Ball[] getComposition() {
        return composition;
    }

    public void setComposition(Ball[] composition) {
        this.composition = composition;
    }
}
