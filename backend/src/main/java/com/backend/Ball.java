package com.backend;

import com.backend.Enums.*;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Ball {
    @JsonProperty("id")
    private String id;
    @JsonProperty("color")
    private Color color;
    @JsonProperty("position")
    private Position position;

    // Default constructor for Jackson
    public Ball() {
    }

    public Ball(Color color, Position position) {
        this.id =
            "01" +
            switch (color) {
            case RED -> "0";
            case BLUE -> "1";
            case GREEN -> "2";
            case YELLOW -> "3";
            case ORANGE -> "4";
            case PURPLE -> "5";
            case ERROR -> "E";
            } +
            (int)(Math.random() * 100);
        this.color = color;
        this.position = position;
    }

    public Ball(String id, Color color, Position position) {
        this.id = id;
        this.color = color;
        this.position = position;
    }
    
    // Costruttore che ricava il colore dall'ID e richiede la posizione
    public Ball(String id, Position position) {
        this.id = id;
        this.position = position;
        this.color = deriveColorFromId(id);
    }
    
    // Metodo helper per ricavare il colore dall'ID
    private Color deriveColorFromId(String id) {
        if (id == null || id.length() < 3) {
            throw new IllegalArgumentException("ID deve essere almeno di 3 caratteri");
        }
        
        // Estrae il terzo carattere dell'ID per determinare il colore
        char colorCode = id.charAt(2);
        
        return switch (colorCode) {
            case '0' -> Color.RED;
            case '1' -> Color.BLUE;
            case '2' -> Color.GREEN;
            case '3' -> Color.YELLOW;
            case '4' -> Color.ORANGE;
            case '5' -> Color.PURPLE;
            case 'E' -> Color.ERROR;
            default -> throw new IllegalArgumentException("Codice colore non valido nell'ID: " + colorCode);
        };
    }
    
    public Color getColor() {
        return color;
    }

    public Position getPosition() {
        return position;
    }
    
    public String getId() {
        return id;
    }

    public void setPosition(Position position) {
        this.position = position;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setColor(Color color) {
        this.color = color;
    }
}
