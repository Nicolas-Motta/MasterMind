package com.backend.controller.SystemController.Request;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SystemRequest {
    @JsonProperty("instraction")
    private String instraction;

    public String getInstraction() {
        return instraction;
    }
    public void setInstraction(String instraction) {
        this.instraction = instraction;
    }
}
