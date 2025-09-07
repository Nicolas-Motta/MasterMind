package com.backend.controller.PlayController.Response;

import com.backend.Ball;
import com.backend.Enums.Color;
import com.backend.Enums.Position;
import com.fasterxml.jackson.annotation.JsonProperty;

public class SetLabelResponse {

    @JsonProperty("composition")
    private Ball[] composition;

    public SetLabelResponse(Ball[] composition) {
        this.composition = composition;
    }

    public Ball[] getComposition() {
        return composition;
    }

    public void setComposition(Ball[] composition) {
        this.composition = composition;
    }

    public static Ball[] getError() {
        Ball[] errorLabel = new Ball[4];
        for (int i = 0; i < errorLabel.length; i++) {
            errorLabel[i] = new Ball("error", Color.ERROR, Position.HOME);
        }
        return errorLabel;
    }
}
