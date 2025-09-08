package com.backend.controller.PlayController.Response;

import com.backend.Object.Ball;
import com.fasterxml.jackson.annotation.JsonProperty;

public class BallResponse {
    @JsonProperty("Ball")
    private Ball ball;

    public BallResponse(Ball ball) {
        this.ball = ball;
    }

    public Ball getBall() {
        return ball;
    }

    public void setBall(Ball ball) {
        this.ball = ball;
    }
}
