package com.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.controller.VariableController.VariableController;
import com.backend.event.VariableChangeEvent;
import com.backend.event.VariableChangeListener;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.List;
import java.util.Map;

@Service
public class VariableNotificationService implements VariableChangeListener {
    
    @Autowired
    private VariableController webSocketHandler;
    
    // Mappa per memorizzare i listener per ogni variabile
    private final Map<String, List<VariableChangeListener>> listeners = new ConcurrentHashMap<>();
    
    // Mappa per memorizzare i valori correnti delle variabili monitorate
    private final Map<String, Object> currentValues = new ConcurrentHashMap<>();
    
    /**
     * Registra un listener per una specifica variabile
     */
    public void addListener(String variableName, VariableChangeListener listener) {
        listeners.computeIfAbsent(variableName, k -> new CopyOnWriteArrayList<>()).add(listener);
    }
    
    /**
     * Rimuove un listener per una specifica variabile
     */
    public void removeListener(String variableName, VariableChangeListener listener) {
        List<VariableChangeListener> variableListeners = listeners.get(variableName);
        if (variableListeners != null) {
            variableListeners.remove(listener);
        }
    }
    
    /**
     * Notifica il cambiamento di una variabile
     */
    public void notifyVariableChange(String variableName, Object newValue) {
        // Aggiorna il valore corrente
        currentValues.put(variableName, newValue);
        
        // Crea l'evento con il nuovo costruttore
        VariableChangeEvent event = new VariableChangeEvent(variableName, newValue);
        
        // Notifica tutti i listener registrati per questa variabile
        List<VariableChangeListener> variableListeners = listeners.get(variableName);
        if (variableListeners != null) {
            for (VariableChangeListener listener : variableListeners) {
                try {
                    listener.onVariableChange(event);
                } catch (Exception e) {
                    System.err.println("Error notifying listener for variable " + variableName + ": " + e.getMessage());
                }
            }
        }
        
        // Invia sempre via WebSocket (questo servizio si auto-registra)
        onVariableChange(event);
    }
    
    /**
     * Implementazione del listener che invia via WebSocket
     */
    @Override
    public void onVariableChange(VariableChangeEvent event) {
        webSocketHandler.sendVariableUpdate(event);
    }
    
    /**
     * Ottiene il valore corrente di una variabile
     */
    public Object getCurrentValue(String variableName) {
        return currentValues.get(variableName);
    }
    
    /**
     * Ottiene una copia di tutti i valori correnti
     */
    public Map<String, Object> getAllCurrentValues() {
        return new ConcurrentHashMap<>(currentValues);
    }
    
    /**
     * Metodo di convenienza per notificare il cambiamento di currentLabel
     */
    public void notifyCurrentLabelChange(Object newCurrentLabel) {
        notifyVariableChange("currentLabel", newCurrentLabel);
    }
}
