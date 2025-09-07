package com.backend.controller.SystemController.Response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CheckResponse {
    @JsonProperty("checkResponse")
    private Object checkResponse;

    public CheckResponse(boolean checkResponse) {
        this.checkResponse = checkResponse;
    }
    public CheckResponse(String checkResponse) {
        this.checkResponse = checkResponse;
    }
    public Object getCheckResponse() {
        return checkResponse;
    }
    public void setCheckResponse(Object checkResponse) {
        this.checkResponse = checkResponse;
    }
}
