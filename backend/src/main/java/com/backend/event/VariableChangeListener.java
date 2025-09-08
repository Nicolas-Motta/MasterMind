package com.backend.event;

/**
 * Interfaccia per listener degli eventi di cambiamento variabile
 */
@FunctionalInterface
public interface VariableChangeListener {
    void onVariableChange(VariableChangeEvent event);
}
