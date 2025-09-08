package com.backend.event;

/**
 * Interfaccia generica per eventi di cambiamento variabile
 */
public class VariableChangeEvent {
    private final String variableName;
    private final Object oldValue;
    private final Object newValue;
    private final long timestamp;
    private final String source;

    public VariableChangeEvent(String variableName, Object oldValue, Object newValue, String source) {
        this.variableName = variableName;
        this.oldValue = oldValue;
        this.newValue = newValue;
        this.timestamp = System.currentTimeMillis();
        this.source = source;
    }

    public String getVariableName() {
        return variableName;
    }

    public Object getOldValue() {
        return oldValue;
    }

    public Object getNewValue() {
        return newValue;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public String getSource() {
        return source;
    }

    @Override
    public String toString() {
        return String.format("VariableChangeEvent{name='%s', oldValue=%s, newValue=%s, source='%s', timestamp=%d}",
                variableName, oldValue, newValue, source, timestamp);
    }
}
