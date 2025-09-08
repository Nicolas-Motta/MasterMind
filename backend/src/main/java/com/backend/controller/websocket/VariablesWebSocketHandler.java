package com.backend.controller.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.concurrent.CopyOnWriteArraySet;
import com.backend.event.VariableChangeEvent;

@Component
public class VariablesWebSocketHandler extends TextWebSocketHandler {
    
    private final CopyOnWriteArraySet<WebSocketSession> sessions = new CopyOnWriteArraySet<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        System.out.println("Nuova connessione WebSocket stabilita: " + session.getId());
        System.out.println("Sessioni attive: " + sessions.size());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
        System.out.println("Connessione WebSocket chiusa: " + session.getId() + " - Status: " + status);
        System.out.println("Sessioni rimanenti: " + sessions.size());
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
     * Metodo deprecato per compatibilità - usa sendVariableUpdate invece
     */
    @Deprecated
    public void sendCurrentLabelUpdate(Object currentLabel) {
        VariableChangeEvent event = new VariableChangeEvent("currentLabel", null, currentLabel, "Legacy");
        sendVariableUpdate(event);
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

    /**
     * Classe deprecata per compatibilità
     */
    @Deprecated
    public static class VariableUpdate {
        private String variableName;
        private String value;
        private long timestamp;

        public VariableUpdate(String variableName, String value) {
            this.variableName = variableName;
            this.value = value;
            this.timestamp = System.currentTimeMillis();
        }

        // Getters e setters
        public String getVariableName() {
            return variableName;
        }

        public void setVariableName(String variableName) {
            this.variableName = variableName;
        }

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }

        public long getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(long timestamp) {
            this.timestamp = timestamp;
        }
    }
}
