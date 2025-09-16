package com.backend.Object;

import java.io.Serializable;
import java.io.FileOutputStream;
import java.io.FileInputStream;
import java.io.ObjectOutputStream;
import java.io.ObjectInputStream;
import java.io.IOException;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Random;

import com.backend.Enums.*;
import com.backend.util.VariableWatcher;

@Component
public class Game implements Serializable {
    private Status status;
    private Ball[] based;
    private Ball[][] labels;
    private Position currentLabel;
    private Ball[] result;
    private boolean isWin;

    @Autowired
    private VariableWatcher variableWatcher;

    /**
     * Costruttore della classe Game.
     * Inizializza il gioco con status LOBBY.
     */
    public Game() {
        setStatus(Status.LOBBY);
    }

    // ----------------------------------- GETTERS
    // --------------------------------//

    /**
     * Restituisce lo status corrente del gioco.
     * 
     * @return lo status del gioco (LOBBY, GENERATING, PLAYING, FINISHED)
     */
    public Status getStatus() {
        return status;
    }

    /**
     * Restituisce l'array delle palline di base disponibili per il gioco.
     * 
     * @return array di Ball contenente le palline di base
     */
    public Ball[] getBased() {
        return based;
    }

    /**
     * Restituisce una specifica etichetta del gioco.
     * 
     * @param n l'indice dell'etichetta (0-5)
     * @return array di Ball contenente l'etichetta richiesta
     * @throws RuntimeException se l'indice non è valido
     */
    public Ball[] getLabel(int n) {
        if (n >= 0 && n < labels.length) {
            return labels[n];
        }
        throw new RuntimeException("Label non trovato");
    }

    /**
     * Restituisce tutte le etichette del gioco.
     * 
     * @return matrice di Ball contenente tutte le etichette
     */
    public Ball[][] getLabels() {
        return labels;
    }

    /**
     * Restituisce la posizione dell'etichetta corrente.
     * 
     * @return la posizione dell'etichetta corrente
     */
    public Position getCurrentLabel() {
        return currentLabel;
    }

    /**
     * Restituisce la composizione segreta del gioco.
     * 
     * @return array di Ball contenente la soluzione
     */
    public Ball[] getResult() {
        return result;
    }

    /**
     * Verifica se il gioco è stato vinto.
     * 
     * @return true se il gioco è stato vinto, false altrimenti
     */
    public boolean getIsWin() {
        return isWin;
    }

    // ----------------------------------- SETTERS
    // ---------------------------------//

    /**
     * Imposta lo status del gioco.
     * 
     * @param status il nuovo status del gioco
     */
    public void setStatus(Status status) {
        this.status = status;
    }

    /**
     * Imposta tutte le etichette del gioco.
     * 
     * @param labels la nuova matrice di etichette
     */
    public void setLabels(Ball[][] labels) {
        this.labels = labels;
    }

    /**
     * Imposta una specifica etichetta del gioco.
     * Cambia automaticamente lo status da GENERATING a PLAYING.
     * 
     * @param n     l'indice dell'etichetta da impostare
     * @param label l'array di Ball da assegnare all'etichetta
     */
    public void setLabel(int n, Ball[] label) {
        if (status == Status.GENERATING) {
            status = Status.PLAYING;
        }
        this.labels[n] = label;
    }

    /**
     * Imposta la posizione dell'etichetta corrente.
     * Notifica il cambiamento tramite VariableWatcher se disponibile.
     * 
     * @param currentLabel la nuova posizione dell'etichetta corrente
     */
    public void setCurrentLabel(Position currentLabel) {
        Position oldCurrentLabel = this.currentLabel;
        this.currentLabel = currentLabel;

        // Notifica il cambiamento solo se la nuova posizione è diversa dalla precedente
        if (variableWatcher != null && !currentLabel.equals(oldCurrentLabel)) {
            variableWatcher.notifyCurrentLabel(currentLabel);
        }
    }

    /**
     * Imposta se il gioco è stato vinto.
     * Notifica il cambiamento tramite VariableWatcher se disponibile.
     * 
     * @param isWin true se il gioco è stato vinto, false altrimenti
     */
    public void setIsWin(boolean isWin) {
        boolean oldIsWin = this.isWin;
        this.isWin = isWin;

        // Notifica il cambiamento solo se il nuovo valore è diverso dal precedente
        if (variableWatcher != null && isWin != oldIsWin) {
            variableWatcher.notifyIsWin(isWin);
        }
    }

    // -------------------------------- SERIALIZABLE
    // ---------------------------------//

    /**
     * Serializza l'istanza corrente del gioco in un file
     * 
     * @param filePath Il percorso del file dove salvare l'istanza
     * @return true se il salvataggio è riuscito, false altrimenti
     */
    public boolean saveGameState(String filePath) {
        try (FileOutputStream fileOut = new FileOutputStream(filePath);
                ObjectOutputStream out = new ObjectOutputStream(fileOut)) {

            // Salviamo solo i dati del gioco, non il VariableWatcher che non è
            // serializzabile
            GameData gameData = new GameData(
                    this.based, this.labels, this.result,
                    this.status, this.currentLabel, this.isWin);

            out.writeObject(gameData);
            return true;
        } catch (IOException e) {
            System.err.println("Errore durante il salvataggio del gioco: " + e.getMessage());
            return false;
        }
    }

    /**
     * Carica un'istanza del gioco da un file
     * 
     * @param filePath Il percorso del file da cui caricare l'istanza
     * @return true se il caricamento è riuscito, false altrimenti
     */
    public boolean loadGameState(String filePath) {
        try (FileInputStream fileIn = new FileInputStream(filePath);
                ObjectInputStream in = new ObjectInputStream(fileIn)) {

            GameData gameData = (GameData) in.readObject();

            this.based = gameData.getBased();
            this.labels = gameData.getLabels();
            this.result = gameData.getResult();
            setStatus(gameData.getStatus());
            setCurrentLabel(gameData.getCurrentLabel());
            setIsWin(gameData.getIsWin());

            return true;
        } catch (IOException | ClassNotFoundException e) {
            System.err.println("Errore durante il caricamento del gioco: " + e.getMessage());
            return false;
        }
    }

    /**
     * Classe interna per contenere i dati serializzabili del gioco
     */
    private static class GameData implements Serializable {
        private static final long serialVersionUID = 1L;

        private final Ball[] based;
        private final Ball[][] labels;
        private final Ball[] result;
        private final Status status;
        private final Position currentLabel;
        private final boolean isWin;

        public GameData(Ball[] based, Ball[][] labels, Ball[] result,
                Status status, Position currentLabel, boolean isWin) {
            this.based = based;
            this.labels = labels;
            this.result = result;
            this.status = status;
            this.currentLabel = currentLabel;
            this.isWin = isWin;
        }

        // Getters
        public Ball[] getBased() {
            return based;
        }

        public Ball[][] getLabels() {
            return labels;
        }

        public Ball[] getResult() {
            return result;
        }

        public Status getStatus() {
            return status;
        }

        public Position getCurrentLabel() {
            return currentLabel;
        }

        public boolean getIsWin() {
            return isWin;
        }
    }

    // ----------------------------------- CUSTOMS
    // --------------------------------//

    /**
     * Inizializza una nuova partita.
     * Crea le palline di base, le etichette vuote e la composizione segreta.
     * Imposta lo status del gioco e salva automaticamente lo stato.
     */
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
        result = generateResult();
        for (Ball ball : result)
            System.out.println(ball.getColor());
        setStatus(Status.PLAYING);
        setCurrentLabel(Position.LABEL0);
        saveGameState("game.dat");

    }

    /**
     * Genera un colore casuale escludendo Color.ERROR.
     * 
     * @return un colore casuale valido per il gioco
     */
    @Deprecated
    public Color getRandomColor() {
        Random random = new Random();
        Color[] colors = Color.values();
        return colors[random.nextInt(colors.length - 1)]; // Esclude Color.ERROR
    }

    /**
     * Genera una sequenza di 4 palline con colori tutti diversi.
     * 
     * @return array di 4 Ball con colori diversi
     */
    public Ball[] generateResult() {
        Color[] colors = Color.values();
        // Escludi Color.ERROR se presente
        int validColors = colors.length - 1;
        if (validColors < 4)
            throw new RuntimeException("Non ci sono abbastanza colori diversi!");
        java.util.List<Integer> indices = new java.util.ArrayList<>();
        for (int i = 0; i < validColors; i++)
            indices.add(i);
        java.util.Collections.shuffle(indices);
        Ball[] balls = new Ball[4];
        for (int i = 0; i < 4; i++) {
            balls[i] = new Ball(colors[indices.get(i)], Position.RESULT);
        }
        return balls;
    }

    /**
     * Calcola la prossima posizione dell'etichetta basata su quella corrente.
     * 
     * @param currentLabel la posizione dell'etichetta corrente
     * @return la posizione della prossima etichetta, null se il gioco è finito
     */
    public Position getNextLabel(Position currentLabel) {
        switch (currentLabel) {
            case LABEL0:
                return Position.LABEL1;
            case LABEL1:
                return Position.LABEL2;
            case LABEL2:
                return Position.LABEL3;
            case LABEL3:
                return Position.LABEL4;
            case LABEL4:
                return Position.LABEL5;
            case LABEL5:
                return Position.RESULT; // Gioco finito
            default:
                return Position.LABEL0;
        }
    }
}