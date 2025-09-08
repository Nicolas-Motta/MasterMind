# Documentazione della Classe Game

## Panoramica

La classe `Game` rappresenta il cuore logico del gioco MasterMind. È responsabile di gestire lo stato del gioco, le mosse dei giocatori, la generazione della sequenza segreta e la logica di vittoria/sconfitta.

## Informazioni Generali

- **Package**: `com.backend.Object`
- **Tipo**: Classe Component Spring
- **Implementa**: `Serializable`
- **Annotazioni**: `@Component`

## Attributi Principali

### Attributi di Stato
- `Status status`: Lo stato corrente del gioco (LOBBY, GENERATING, PLAYING, FINISHED)
- `boolean isWin`: Indica se il gioco è stato vinto dal giocatore

### Attributi di Gioco
- `Ball[] based`: Array delle 6 palline di base disponibili per il gioco (colori: RED, BLUE, GREEN, YELLOW, ORANGE, PURPLE)
- `Ball[][] labels`: Matrice 6x4 che contiene i tentativi del giocatore (6 righe per massimo 6 tentativi, 4 colonne per la sequenza di 4 palline)
- `Position currentLabel`: Posizione dell'etichetta corrente (indica quale tentativo è in corso)
- `Ball[] result`: Array di 4 palline che rappresenta la sequenza segreta da indovinare

### Dipendenze
- `VariableWatcher variableWatcher`: Servizio per notificare i cambiamenti di stato (iniettato con `@Autowired`)

## Metodi Principali

### Costruttore
```java
public Game()
```
Inizializza il gioco con status LOBBY.

### Getters

#### `Status getStatus()`
Restituisce lo stato corrente del gioco.
- **Ritorna**: Status enum (LOBBY, GENERATING, PLAYING, FINISHED)

#### `Ball[] getBased()`
Restituisce l'array delle palline di base disponibili.
- **Ritorna**: Array di 6 Ball con i colori base del gioco

#### `Ball[] getLabel(int n)`
Restituisce una specifica etichetta (tentativo) del gioco.
- **Parametri**: 
  - `n`: indice dell'etichetta (0-5)
- **Ritorna**: Array di 4 Ball del tentativo specificato
- **Eccezioni**: `RuntimeException` se l'indice non è valido

#### `Ball[][] getLabels()`
Restituisce tutte le etichette del gioco.
- **Ritorna**: Matrice 6x4 di Ball con tutti i tentativi

#### `Position getCurrentLabel()`
Restituisce la posizione dell'etichetta corrente.
- **Ritorna**: Position enum indicante il tentativo corrente

#### `Ball[] getResult()`
Restituisce la composizione segreta del gioco.
- **Ritorna**: Array di 4 Ball con la sequenza da indovinare

#### `boolean getIsWin()`
Verifica se il gioco è stato vinto.
- **Ritorna**: true se vinto, false altrimenti

### Setters

#### `void setStatus(Status status)`
Imposta lo status del gioco.
- **Parametri**: 
  - `status`: nuovo status del gioco

#### `void setLabels(Ball[][] labels)`
Imposta tutte le etichette del gioco.
- **Parametri**: 
  - `labels`: nuova matrice di etichette

#### `void setLabel(int n, Ball[] label)`
Imposta una specifica etichetta del gioco.
Cambia automaticamente lo status da GENERATING a PLAYING.
- **Parametri**: 
  - `n`: indice dell'etichetta da impostare
  - `label`: array di Ball da assegnare

#### `void setCurrentLabel(Position currentLabel)`
Imposta la posizione dell'etichetta corrente.
Notifica il cambiamento tramite VariableWatcher se disponibile.
- **Parametri**: 
  - `currentLabel`: nuova posizione dell'etichetta corrente

#### `void setIsWin(boolean isWin)`
Imposta se il gioco è stato vinto.
Notifica il cambiamento tramite VariableWatcher se disponibile.
- **Parametri**: 
  - `isWin`: true se vinto, false altrimenti

### Metodi di Serializzazione

#### `boolean saveGameState(String filePath)`
Serializza l'istanza corrente del gioco in un file.
- **Parametri**: 
  - `filePath`: percorso del file dove salvare l'istanza
- **Ritorna**: true se il salvataggio è riuscito, false altrimenti
- **Note**: Utilizza la classe interna GameData per salvare solo i dati serializzabili

#### `boolean loadGameState(String filePath)`
Carica un'istanza del gioco da un file.
- **Parametri**: 
  - `filePath`: percorso del file da cui caricare l'istanza
- **Ritorna**: true se il caricamento è riuscito, false altrimenti

### Metodi di Logica di Gioco

#### `void newGame()`
Inizializza una nuova partita.
- **Funzionalità**:
  - Crea le 6 palline di base con colori diversi
  - Inizializza la matrice delle etichette (6x4) vuota
  - Genera una sequenza segreta casuale di 4 palline
  - Imposta lo status a PLAYING
  - Imposta la posizione corrente a LABEL0
  - Salva automaticamente lo stato del gioco

#### `Color getRandomColor()`
Genera un colore casuale escludendo Color.ERROR.
- **Ritorna**: Color enum casuale valido per il gioco
- **Note**: Utilizza Random per selezionare uno dei 6 colori disponibili

#### `Position getNextLabel(Position currentLabel)`
Calcola la prossima posizione dell'etichetta basata su quella corrente.
- **Parametri**: 
  - `currentLabel`: posizione dell'etichetta corrente
- **Ritorna**: Position della prossima etichetta, null se il gioco è finito
- **Logica**: LABEL0 → LABEL1 → LABEL2 → LABEL3 → LABEL4 → LABEL5 → null

## Classe Interna GameData

Classe interna statica utilizzata per la serializzazione.
- **Scopo**: Contenere solo i dati serializzabili del gioco
- **Attributi**: Copia immutabile di tutti gli attributi principali del gioco
- **Implementa**: Serializable con serialVersionUID = 1L

## Stati del Gioco

1. **LOBBY**: Stato iniziale, in attesa di iniziare una partita
2. **GENERATING**: Generazione della sequenza segreta in corso
3. **PLAYING**: Partita in corso, giocatore può fare tentativi
4. **FINISHED**: Partita terminata (vittoria o sconfitta)

## Flusso di Gioco Tipico

1. **Inizializzazione**: Game viene creato con status LOBBY
2. **Nuova Partita**: Chiamata a `newGame()` 
   - Status diventa GENERATING → PLAYING
   - Creazione palline di base
   - Generazione sequenza segreta
   - Inizializzazione tentativi vuoti
3. **Tentativi**: Il giocatore effettua tentativi tramite `setLabel()`
4. **Progressione**: `setCurrentLabel()` aggiorna il tentativo corrente
5. **Vittoria**: `setIsWin(true)` quando la sequenza è indovinata
6. **Salvataggio**: Stato automaticamente salvato

## Pattern e Architettura

- **Component Pattern**: Gestita da Spring come singleton
- **Observer Pattern**: Utilizza VariableWatcher per notificare cambiamenti
- **Serialization Pattern**: Supporto per salvataggio/caricamento stato
- **State Pattern**: Gestione degli stati del gioco tramite enum Status

## Considerazioni Tecniche

- **Thread Safety**: Non thread-safe, deve essere gestita a livello di applicazione
- **Persistenza**: Salvataggio automatico su file binario
- **Dependency Injection**: Integrata con Spring Framework
- **Serializzazione**: Gestione separata per oggetti non serializzabili (VariableWatcher)

## Dipendenze Esterne

- **Spring Framework**: Per dependency injection (@Component, @Autowired)
- **Java Serialization**: Per salvataggio/caricamento stato
- **Custom Enums**: Status, Position, Color
- **Custom Objects**: Ball, VariableWatcher

## Note di Manutenzione

- La classe è ben documentata con JavaDoc
- Gestione degli errori implementata per operazioni I/O
- Separazione chiara tra logica di gioco e persistenza
- Pattern di notifica per aggiornamenti real-time dell'interfaccia
