package com.backend;

import java.io.Serializable;
import org.springframework.stereotype.Component;
import java.util.Random;

import com.backend.Enums.*;

@Component
public class ObjectGame implements Serializable {
    private Ball[] based;
    private Ball[][] labels;
    private Ball[] result;
    private Status status;

    public ObjectGame() {
        this.status = Status.LOBBY;
    }

    public void newGame() {
        based = new Ball[] {
                new Ball(Color.RED, Position.HOME),
                new Ball(Color.BLUE, Position.HOME),
                new Ball(Color.GREEN, Position.HOME),
                new Ball(Color.YELLOW, Position.HOME),
                new Ball(Color.ORANGE, Position.HOME),
                new Ball(Color.PURPLE, Position.HOME)
        };
        labels = new Ball[6][4];
        for (int i = 0; i < labels.length; i++) {
            labels[i] = new Ball[4];
        }
        result = new Ball[] {
                new Ball(getRandomColor(), Position.RESULT),
                new Ball(getRandomColor(), Position.RESULT),
                new Ball(getRandomColor(), Position.RESULT),
                new Ball(getRandomColor(), Position.RESULT),
        };
        status = Status.GENERATING;

    }

    public Color getRandomColor() {
        Random random = new Random();
        Color[] colors = Color.values();
        return colors[random.nextInt(colors.length)];
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Ball[] getBased() {
        return based;
    }

    public Ball[] getLabel(int n) {
        if (n >= 0 && n < labels.length) {
            return labels[n];
        }
        throw new RuntimeException("Label non trovato");
    }

    public void setLabel(int n, Ball[] label) {
        this.labels[n] = label;
    }

    public Ball[] getResult() {
        return result;
    }
}
