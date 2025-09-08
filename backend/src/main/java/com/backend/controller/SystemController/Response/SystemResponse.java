package com.backend.controller.SystemController.Response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL) // Include solo i campi non null nel JSON
public class SystemResponse<T> {
    
    @JsonProperty("success")
    private Boolean success;
    
    @JsonProperty("message")
    private String message;
    
    @JsonProperty("data")
    private T data;
    
    @JsonProperty("checkResponse")
    private Object checkResponse;

    // Costruttori per diversi tipi di risposta
    
    // Per CheckResponse con boolean
    public SystemResponse(boolean checkResponse) {
        this.checkResponse = checkResponse;
    }
    
    // Per CheckResponse con String
    public SystemResponse(String checkResponse) {
        this.checkResponse = checkResponse;
    }
    
    // Per SaveGame/LoadGame response
    public SystemResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    // Per response con dati aggiuntivi
    public SystemResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
    
    // Costruttore vuoto
    public SystemResponse() {}

    // Metodi statici di factory per creare response comuni
    public static SystemResponse<Void> success() {
        return new SystemResponse<>(true, "Operazione completata con successo");
    }
    
    public static SystemResponse<Void> success(String message) {
        return new SystemResponse<>(true, message);
    }
    
    public static <T> SystemResponse<T> success(String message, T data) {
        return new SystemResponse<>(true, message, data);
    }
    
    public static SystemResponse<Void> error(String message) {
        return new SystemResponse<>(false, message);
    }
    
    public static SystemResponse<String> ping() {
        return new SystemResponse<>("pong");
    }
    
    public static SystemResponse<String> pingEmpty() {
        return new SystemResponse<>("");
    }
    
    public static SystemResponse<Boolean> gameOperation(boolean success) {
        return new SystemResponse<>(success);
    }

    // Getters e Setters
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

    public Object getCheckResponse() {
        return checkResponse;
    }

    public void setCheckResponse(Object checkResponse) {
        this.checkResponse = checkResponse;
    }
    
    // Metodi di utilità
    public boolean isSuccess() {
        return success != null && success;
    }
    
    public boolean hasMessage() {
        return message != null && !message.isEmpty();
    }
    
    public boolean hasData() {
        return data != null;
    }
    
    @Override
    public String toString() {
        return "ApiResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", data=" + data +
                ", checkResponse=" + checkResponse +
                '}';
    }
}
