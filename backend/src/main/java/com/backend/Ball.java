package com.backend;

import com.backend.Enums.*;

public class Ball {
    private String id;
    private Color color;
    private Position position;

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
}
