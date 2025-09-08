package com.backend.Object;

import java.io.Serializable;
import com.backend.Enums.Position;
import com.backend.Enums.Color;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Ball implements Serializable {
    private static final long serialVersionUID = 1L;
    
    @JsonProperty("id")
    private String id;
    @JsonProperty("color")
    private Color color;
    @JsonProperty("position")
    private Position position;

    // -------------------------------- CONSTRUCTORS --------------------------------//

    /**
     * Costruttore di default per Jackson.
     */
    public Ball() {
    }

    /**
     * Costruttore che crea una Ball con colore e posizione.
     * L'ID viene generato automaticamente basato sul colore.
     * 
     * @param color il colore della pallina
     * @param position la posizione della pallina
     */
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

    /**
     * Costruttore che crea una Ball con ID, colore e posizione specifici.
     * 
     * @param id l'identificativo della pallina
     * @param color il colore della pallina
     * @param position la posizione della pallina
     */
    public Ball(String id, Color color, Position position) {
        this.id = id;
        this.color = color;
        this.position = position;
    }

    // ----------------------------------- GETTERS --------------------------------//

    /**
     * Restituisce il colore della pallina.
     * 
     * @return il colore della pallina
     */
    public Color getColor() {
        return color;
    }

    /**
     * Restituisce la posizione della pallina.
     * 
     * @return la posizione della pallina
     */
    public Position getPosition() {
        return position;
    }
    
    /**
     * Restituisce l'ID della pallina.
     * 
     * @return l'ID della pallina
     */
    public String getId() {
        return id;
    }

    // ----------------------------------- SETTERS ---------------------------------//

    /**
     * Imposta la posizione della pallina.
     * 
     * @param position la nuova posizione della pallina
     */
    public void setPosition(Position position) {
        this.position = position;
    }
}
