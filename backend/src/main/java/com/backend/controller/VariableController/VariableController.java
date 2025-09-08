package com.backend.controller.VariableController;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.concurrent.CopyOnWriteArraySet;
import com.backend.event.VariableChangeEvent;

@Component
public class VariableController extends TextWebSocketHandler {
    
    private final CopyOnWriteArraySet<WebSocketSession> sessions = new CopyOnWriteArraySet<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
    }

    /**
     * Invia un aggiornamento generico di una variabile a tutti i client connessi
     */
    public void sendVariableUpdate(VariableChangeEvent event) {
        if (sessions.isEmpty()) {
            return;
        }

        try {
            WebSocketVariableUpdate update = new WebSocketVariableUpdate(
                event.getVariableName(), 
                event.getNewValue()
            );
            
            String jsonMessage = objectMapper.writeValueAsString(update);
            TextMessage message = new TextMessage(jsonMessage);

            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    try {
                        session.sendMessage(message);
                    } catch (Exception e) {
                        System.err.println("Error sending message to session " + session.getId() + ": " + e.getMessage());
                        sessions.remove(session);
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error creating or sending WebSocket message: " + e.getMessage());
        }
    }

    /**
     * Classe per rappresentare l'aggiornamento di una variabile via WebSocket
     */
    public static class WebSocketVariableUpdate {
        private String variableName;
        private Object currentValue;

        public WebSocketVariableUpdate(String variableName, Object currentValue) {
            this.variableName = variableName;
            this.currentValue = currentValue;
        }

        // Getters e setters
        public String getVariableName() {
            return variableName;
        }

        public void setVariableName(String variableName) {
            this.variableName = variableName;
        }

        public Object getCurrentValue() {
            return currentValue;
        }

        public void setCurrentValue(Object currentValue) {
            this.currentValue = currentValue;
        }
    }

}
