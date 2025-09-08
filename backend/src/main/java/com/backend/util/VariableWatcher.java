package com.backend.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.backend.service.VariableNotificationService;
import com.backend.event.VariableChangeListener;
import java.util.Map;

/**
 * Utility class per semplificare l'uso del sistema di monitoraggio variabili
 */
@Component
public class VariableWatcher {
    
    @Autowired
    private VariableNotificationService notificationService;
    
    /**
     * Notifica il cambiamento di una variabile
     */
    public void notifyChange(String variableName, Object newValue) {
        notifyChange(variableName, newValue, "Unknown");
    }
    
    /**
     * Notifica il cambiamento di una variabile con sorgente specifica
     */
    public void notifyChange(String variableName, Object newValue, String source) {
        notificationService.notifyVariableChange(variableName, newValue, source);
    }
    
    /**
     * Registra un listener per una variabile specifica
     */
    public void watchVariable(String variableName, VariableChangeListener listener) {
        notificationService.addListener(variableName, listener);
    }
    
    /**
     * Smette di osservare una variabile
     */
    public void unwatchVariable(String variableName, VariableChangeListener listener) {
        notificationService.removeListener(variableName, listener);
    }
    
    /**
     * Ottiene il valore corrente di una variabile
     */
    public Object getValue(String variableName) {
        return notificationService.getCurrentValue(variableName);
    }
    
    /**
     * Ottiene tutti i valori correnti
     */
    public Map<String, Object> getAllValues() {
        return notificationService.getAllCurrentValues();
    }
    
    /**
     * Metodi di convenienza per variabili comuni del gioco
     */
    public void notifyCurrentLabel(Object newValue) {
        notifyChange("currentLabel", newValue, "ObjectGame");
    }
    
    public void notifyIsWin(Object newValue) {
        notifyChange("isWin", newValue, "ObjectGame");
    }
    
    public void notifyPlayerScore(Object newScore) {
        notifyChange("playerScore", newScore, "GameLogic");
    }
    
    public void notifyCurrentRound(Object newRound) {
        notifyChange("currentRound", newRound, "GameLogic");
    }
}
