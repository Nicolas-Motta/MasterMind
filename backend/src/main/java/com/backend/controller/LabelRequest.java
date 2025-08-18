package com.backend.controller;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LabelRequest {
    @JsonProperty("instructions")
    private String instructions;
    
    @JsonProperty("id")
    private int id;

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}
