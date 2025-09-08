package com.backend;

import java.io.Serializable;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Random;

import com.backend.Enums.*;
import com.backend.util.VariableWatcher;

@Component
public class ObjectGame implements Serializable {
    private Ball[] based;
    private Ball[][] labels;
    private Ball[] result;
    private Status status;
    private Position currentLabel;
    private boolean isWin;

    public boolean getIsWin() {
        return isWin;
    }

    public void setIsWin(boolean isWin) {
        boolean oldIsWin = this.isWin;
        this.isWin = isWin;
        
        // Notifica il cambiamento solo se il nuovo valore è diverso dal precedente
        if (variableWatcher != null && isWin != oldIsWin) {
            variableWatcher.notifyIsWin(isWin);
        }
    }
    
    @Autowired
    private VariableWatcher variableWatcher;

    public ObjectGame() {
        this.status = Status.LOBBY;
    }

    public void newGame() {
        setStatus(Status.GENERATING);
        setIsWin(false);
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
        setStatus(Status.PLAYING);
        setCurrentLabel(Position.LABEL0);
    }

    public Color getRandomColor() {
        Random random = new Random();
        Color[] colors = Color.values();
        return colors[random.nextInt(colors.length-1)]; // Esclude Color.ERROR
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

    public Position getNextLabel(Position currentLabel) {
        switch (currentLabel) {
            case LABEL0: return Position.LABEL1;
            case LABEL1: return Position.LABEL2;
            case LABEL2: return Position.LABEL3;
            case LABEL3: return Position.LABEL4;
            case LABEL4: return Position.LABEL5;
            case LABEL5: return null; // Gioco finito
            default: return Position.LABEL0;
        }
    }

    public void setLabel(int n, Ball[] label) {
        if (status == Status.GENERATING) {
            status = Status.PLAYING;
        }
        this.labels[n] = label;
    }

    public Ball[] getResult() {
        return result;
    }

    public Position getCurrentLabel() {
        return currentLabel;
    }

    public void setCurrentLabel(Position currentLabel) {
        Position oldCurrentLabel = this.currentLabel;
        this.currentLabel = currentLabel;
        
        // Notifica il cambiamento solo se la nuova posizione è diversa dalla precedente
        if (variableWatcher != null && !currentLabel.equals(oldCurrentLabel)) {
            variableWatcher.notifyCurrentLabel(currentLabel);
        }
    }
}
