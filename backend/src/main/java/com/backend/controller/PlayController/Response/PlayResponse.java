package com.backend.controller.PlayController.Response;

import com.backend.Object.Ball;
import com.backend.controller.SystemController.Response.SystemResponse;
import com.backend.Enums.Color;
import com.backend.Enums.Position;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Classe unificata per tutte le response del PlayController
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PlayResponse<T> {
    
    @JsonProperty("success")
    private Boolean success;    
    
    @JsonProperty("message")
    private String message;
    
    @JsonProperty("data")
    private T data;
    
    @JsonProperty("Ball")
    private Ball ball;
    
    @JsonProperty("Label")
    private Ball[] label;
    
    @JsonProperty("Result")
    private Ball[] result;
    
    @JsonProperty("composition")
    private Ball[] composition;
    
    @JsonProperty("redPins")
    private Integer redPins;
    
    @JsonProperty("whitePins") 
    private Integer whitePins; 
    
    @JsonProperty("errorMessage")
    private String errorMessage; 

    // -------------------------------- CONSTRUCTORS --------------------------------//
    
    public PlayResponse() {}

    // Costruttori simili a SystemResponse
    public PlayResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    public PlayResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    // -------------------------------- FACTORY METHODS  --------------------------------//

    public static SystemResponse<Void> success() {
        return new SystemResponse<>(true, "Operazione completata con successo");
    }
    
    public static SystemResponse<Void> success(String message) {
        return new SystemResponse<>(true, message);
    }
    
    public static <T> SystemResponse<T> success(String message, T data) {
        return new SystemResponse<>(true, message, data);
    }

    public static PlayResponse<Void> error(String message) {
        return new PlayResponse<>(false, message);
    }

    // ------------------------------------  METHODS  --------------------------------//

    public static PlayResponse<Ball[]> forLabel(Ball[] label) {
        PlayResponse<Ball[]> response = new PlayResponse<>();
        response.label = label;
        response.success = true;
        return response;
    }

    public static PlayResponse<Ball[]> forResult(Ball[] result) {
        PlayResponse<Ball[]> response = new PlayResponse<>();
        response.result = result;
        response.success = true;
        return response;
    }

    public static PlayResponse<Ball[]> forComposition(Ball[] composition) {
        PlayResponse<Ball[]> response = new PlayResponse<>();
        response.composition = composition;
        response.success = true;
        return response;
    }

    public static PlayResponse<Void> forCheckGame(int redPins, int whitePins) {
        PlayResponse<Void> response = new PlayResponse<>();
        response.redPins = redPins;
        response.whitePins = whitePins;
        response.success = true;
        return response;
    }
    
    public static PlayResponse<Void> forCheckGameError(String errorMessage) {
        PlayResponse<Void> response = new PlayResponse<>();
        response.redPins = -1;
        response.whitePins = -1;
        response.errorMessage = errorMessage;
        response.success = false;
        return response;
    }

    public static PlayResponse<Ball[]> forHomeBalls(Ball[] baseBalls) {
        PlayResponse<Ball[]> response = new PlayResponse<>();
        response.label = baseBalls;
        response.success = true;
        return response;
    }

    // -------------------------------- UTILITY METHODS --------------------------------//

    // Utility methods per array di errore (private per semplificare)
    public static Ball[] getErrorBallArray() {
        Ball[] errorBalls = new Ball[4];
        for (int i = 0; i < errorBalls.length; i++) {
            errorBalls[i] = new Ball("error", Color.ERROR, Position.ERROR);
        }
        return errorBalls;
    }

    // -------------------------------- GETTERS AND SETTERS --------------------------------//

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public Ball getBall() {
        return ball;
    }

    public void setBall(Ball ball) {
        this.ball = ball;
    }

    public Ball[] getLabel() {
        return label;
    }

    public void setLabel(Ball[] label) {
        this.label = label;
    }

    public Ball[] getResult() {
        return result;
    }

    public void setResult(Ball[] result) {
        this.result = result;
    }

    public Ball[] getComposition() {
        return composition;
    }

    public void setComposition(Ball[] composition) {
        this.composition = composition;
    }

    public Integer getRedPins() {
        return redPins;
    }

    public void setRedPins(Integer redPins) {
        this.redPins = redPins;
    }

    public Integer getWhitePins() {
        return whitePins;
    }

    public void setWhitePins(Integer whitePins) {
        this.whitePins = whitePins;
    }
    
    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}
