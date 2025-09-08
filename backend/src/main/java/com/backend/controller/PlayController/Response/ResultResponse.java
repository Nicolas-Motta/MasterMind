package com.backend.controller.PlayController.Response;

import com.backend.Enums.Color;
import com.backend.Enums.Position;
import com.backend.Object.Ball;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ResultResponse {

    @JsonProperty("Result")
    private Ball[] result;

    public ResultResponse(Ball[] result) {
        this.result = result;
    }

    public Ball[] getResult() {
        return result;
    }

    public void setResult(Ball[] result) {
        this.result = result;
    }

    public static Ball[] getError() {
        Ball[] errorResult = new Ball[4];
        for (int i = 0; i < errorResult.length; i++) {
            errorResult[i] = new Ball("error", Color.ERROR, Position.ERROR);
        }
        return errorResult;
    }
}
