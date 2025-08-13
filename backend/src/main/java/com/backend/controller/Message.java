package com.backend.controller;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Message {
    @JsonProperty("instraction")
    private String instraction;

    public String getInstraction() {
        return instraction;
    }
    public void setInstraction(String instraction) {
        this.instraction = instraction;
    }
}
