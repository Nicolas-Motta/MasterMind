# Sistema di Monitoraggio Variabili - MasterMind

## Panoramica

Questo sistema fornisce un meccanismo generico per monitorare e notificare i cambiamenti delle variabili attraverso WebSocket. Tutti i client connessi ricevono aggiornamenti in tempo reale quando le variabili cambiano.

## Componenti Principali

### 1. VariableWatcher
Classe di utilità principale per interagire con il sistema:

```java
@Autowired
private VariableWatcher variableWatcher;

// Notifica un cambiamento
variableWatcher.notifyChange("myVariable", newValue, "MyClass");

// Registra un listener
variableWatcher.watchVariable("myVariable", event -> {
    System.out.println("Variable changed: " + event.getVariableName() + " = " + event.getNewValue());
});

// Ottieni il valore corrente
Object currentValue = variableWatcher.getValue("myVariable");
```

### 2. WebSocket Endpoint
**URL**: `ws://localhost:8080/MasterMind/Variables`

I client ricevono messaggi JSON nel formato:
```json
{
  "variableName": "currentLabel",
  "currentValue": "LABEL1",
}
```

### 3. REST API
- `GET /MasterMind/Variables` - Ottiene tutte le variabili monitorate
- `GET /MasterMind/Variables/{variableName}` - Ottiene una variabile specifica

## Esempi di Utilizzo

### Nel Controller
```java
@Autowired
private VariableWatcher variableWatcher;

@PostMapping("/updateGameState")
public ResponseEntity<?> updateGameState(@RequestBody GameState newState) {
    // Aggiorna lo stato del gioco
    game.setState(newState);
    
    // Notifica il cambiamento
    variableWatcher.notifyChange("gameState", newState, "GameController");
    
    return ResponseEntity.ok().build();
}
```

### Nel Frontend (JavaScript)
```javascript
// Connessione WebSocket
const ws = new WebSocket('ws://localhost:8080/MasterMind/Variables');

ws.onmessage = function(event) {
    const update = JSON.parse(event.data);
    console.log(`Variable ${update.variableName} changed to ${update.currentValue}`);
    
    // Aggiorna l'interfaccia utente in base alla variabile
    if (update.variableName === 'currentLabel') {
        updateCurrentLabelDisplay(update.currentValue);
    }
};

// Ottieni tutte le variabili via REST
fetch('/MasterMind/Variables')
    .then(response => response.json())
    .then(variables => {
        console.log(variables);
    });

// Ottieni una variabile specifica
fetch('/MasterMind/Variables/<variable>')
    .then(response => response.json())
    .then(variable => {
        console.log(variable.value);
    });
```

## Variabili Predefinite

Il sistema monitora automaticamente:

- `currentLabel` - Il label corrente del gioco (LABEL0, LABEL1, ecc.)

### Metodi di Convenienza

```java
// Per ObjectGame
variableWatcher.notifyCurrentLabel(Position.LABEL1);

// Per altre logiche di gioco
variableWatcher.notifyPlayerScore(1250);
variableWatcher.notifyCurrentRound(3);
```

## Aggiungere Nuove Variabili

Per monitorare una nuova variabile:

1. Nel tuo bean/controller:
```java
@Autowired
private VariableWatcher variableWatcher;

public void setMyCustomVariable(String newValue) {
    this.myCustomVariable = newValue;
    variableWatcher.notifyChange("myCustomVariable", newValue, "MyClass");
}
```

2. Nel frontend, la variabile sarà automaticamente disponibile via WebSocket e REST API.

## Note Tecniche

- Il sistema è thread-safe
- I WebSocket si riconnettono automaticamente in caso di disconnessione
- I valori vengono serializzati in JSON utilizzando Jackson
- Le notifiche vengono inviate solo quando il valore cambia effettivamente
