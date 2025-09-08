package com.backend.event;

/**
 * Interfaccia generica per eventi di cambiamento variabile
 */
public class VariableChangeEvent {
    private final String variableName;
    private final Object newValue;

    public VariableChangeEvent(String variableName, Object newValue) {
        this.variableName = variableName;
        this.newValue = newValue;
    }

    public String getVariableName() {
        return variableName;
    }

    public Object getNewValue() {
        return newValue;
    }

    @Override
    public String toString() {
        return String.format("VariableChangeEvent{name='%s', newValue=%s}",
                variableName, newValue);
    }
}
