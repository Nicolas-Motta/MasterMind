package com.backend.controller;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.backend.Ball;

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
