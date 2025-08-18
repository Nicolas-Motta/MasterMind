package com.backend.controller;

import com.backend.Ball;
import com.backend.Enums.Color;
import com.backend.Enums.Position;
import com.fasterxml.jackson.annotation.JsonProperty;

public class LabelResponse {

    @JsonProperty("Label")
    private Ball[] label;

    public LabelResponse(Ball[] label) {
        this.label = label;
    }

    public Ball[] getLabel() {
        return label;
    }

    public void setLabel(Ball[] label) {
        this.label = label;
    }

    public static Ball[] getError() {
        Ball[] errorLabel = new Ball[4];
        for (int i = 0; i < errorLabel.length; i++) {
            errorLabel[i] = new Ball("error", Color.ERROR, Position.HOME);
        }
        return errorLabel;
    }
}