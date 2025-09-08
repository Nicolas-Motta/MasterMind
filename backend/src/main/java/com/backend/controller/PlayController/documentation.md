# PlayController Documentation

## Panoramica

Il `PlayController` è il controller REST principale per la gestione delle operazioni di gioco del MasterMind. Fornisce un'API completa per l'interazione con le palline, la gestione delle label, la validazione delle mosse e il controllo dello stato di gioco.

## Architettura

### Annotazioni di Classe
- `@RestController`: Definisce la classe come controller REST Spring Boot
- `@RequestMapping("/MasterMind")`: Imposta il path base per tutti gli endpoint
- `@CrossOrigin(origins = "*")`: Abilita CORS per tutte le origini (configurazione sviluppo)

### Dipendenze Iniettate
```java
@Autowired
private Game game;              // Istanza principale del gioco
```

### Stato Interno
```java
private int currentHomeBallIndex = 0;   // Indice corrente per le palline home
```

**Base URL**: `http://localhost:8080/MasterMind`

---

## API Endpoints

### 1. Genera Pallina Home - `/newHomeBall`

```java
@PostMapping("/newHomeBall")
public PlayResponse<?> newHomeBall(@RequestBody PlayRequest request)
```

**Descrizione**: Genera una nuova pallina dalla sequenza base del gioco per l'area home.

**Request Body**:
```json
{
    "instraction": "newHomeBall"
}
```

**Responses**:
- **Successo**: 
```json
{
    "success": true,
    "Ball": {
        "id": "01015",
        "color": "BLUE", 
        "position": "HOME"
    }
}
```
- **Errore**: `{"success": false, "message": "Istruzione non valida"}`

**Comportamento**:
- Ottiene la sequenza base tramite `game.getBased()`
- Incrementa ciclicamente `currentHomeBallIndex`
- Crea una nuova istanza Ball con i dati della pallina selezionata

---

### 2. Ottieni Label - `/getLabel`

```java
@PostMapping("/getLabel")
public PlayResponse<?> getLabel(@RequestBody PlayRequest request)
```

**Descrizione**: Recupera l'array di palline di una label specifica.

**Request Body**:
```json
{
    "instructions": "getLabel",
    "id": "LABEL0"
}
```

**Responses**:
- **Successo**: 
```json
{
    "success": true,
    "composition": [
        {"id": "01023", "color": "RED", "position": "LABEL0"},
        {"id": "01034", "color": "BLUE", "position": "LABEL0"},
        {"id": "01045", "color": "GREEN", "position": "LABEL0"},
        {"id": "01056", "color": "YELLOW", "position": "LABEL0"}
    ]
}
```
- **Errore**: Array di palline errore con messaggio specifico

**Validazioni**:
- Istruzione deve essere esattamente `"getLabel"`
- Position ID deve essere valida (LABEL0-LABEL5)

---

### 3. Imposta Label - `/setLabel`

```java
@PostMapping("/setLabel")
public PlayResponse<?> setLabel(@RequestBody PlayRequest request)
```

**Descrizione**: Imposta una composizione di palline per una label specifica.

**Request Body**:
```json
{
    "instructions": "setLabel",
    "id": "LABEL1",
    "composition": [
        {"id": "01023", "color": "RED", "position": "LABEL1"},
        {"id": "01034", "color": "BLUE", "position": "LABEL1"},
        {"id": "01045", "color": "GREEN", "position": "LABEL1"},
        {"id": "01056", "color": "YELLOW", "position": "LABEL1"}
    ]
}
```

**Responses**:
- **Successo**: Composizione aggiornata della label
- **Errore**: Array di palline errore con messaggio specifico

**Operazioni Eseguite**:
1. Valida l'istruzione `"setLabel"`
2. Converte Position enum in indice numerico
3. Chiama `game.setLabel()` per aggiornare la composizione
4. Restituisce la composizione aggiornata tramite `game.getLabel()`

---

### 4. Controlla Risposta - `/sendResponse`

```java
@PostMapping("/sendResponse")
public PlayResponse<?> sendResponse(@RequestBody PlayRequest request)
```

**Descrizione**: Controlla una composizione proposta dall'utente e calcola pin rossi/bianchi.

**Request Body**:
```json
{
    "instruction": "sendResponse",
    "composition": [
        {"id": "01023", "color": "RED", "position": "GAME"},
        {"id": "01034", "color": "BLUE", "position": "GAME"},
        {"id": "01045", "color": "GREEN", "position": "GAME"},
        {"id": "01056", "color": "YELLOW", "position": "GAME"}
    ]
}
```

**Responses**:
- **Successo**: 
```json
{
    "success": true,
    "redPins": 2,
    "whitePins": 1,
    "finished": false
}
```
- **Vittoria**: 
```json
{
    "success": true,
    "redPins": 4,
    "whitePins": 0,
    "finished": true
}
```
- **Errore**: `{"success": false, "message": "Array non completo"}`

**Algoritmo Pin Counting**:
1. **Pin Rossi**: Conta le palline nella posizione corretta con colore corretto
2. **Pin Bianchi**: Conta le palline con colore corretto ma posizione sbagliata
3. **Gestione Vittoria**: Se redPins == 4, imposta game status a FINISHED

**Validazioni**:
- Istruzione deve essere `"sendResponse"`
- Composizione deve contenere esattamente 4 palline
- Controlla condizioni di vittoria automaticamente

---

### 5. Ottieni Risultato - `/getResult`

```java
@PostMapping("/getResult")
public PlayResponse<?> getResult(@RequestBody PlayRequest request)
```

**Descrizione**: Restituisce la soluzione corretta del gioco.

**Request Body**:
```json
{
    "instraction": "getResult"
}
```

**Responses**:
- **Successo**: 
```json
{
    "success": true,
    "result": [
        {"id": "01067", "color": "PURPLE", "position": "GAME"},
        {"id": "01078", "color": "ORANGE", "position": "GAME"},
        {"id": "01089", "color": "RED", "position": "GAME"},
        {"id": "01090", "color": "GREEN", "position": "GAME"}
    ]
}
```
- **Errore**: Array di palline errore con messaggio specifico

## Classi di Supporto

### PlayRequest (Unificata)
```java
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PlayRequest {
    @JsonProperty("instruction")  private String instruction;    // Per sendResponse
    @JsonProperty("instructions") private String instructions;   // Per getLabel/setLabel
    @JsonProperty("instraction")  private String instraction;    // Per newHomeBall/getResult
    @JsonProperty("id")           private Position id;           // Per getLabel/setLabel
    @JsonProperty("composition")  private Ball[] composition;    // Per setLabel/sendResponse
}
```

**Caratteristiche**:
- **Unificata**: Combina tutti i campi dei request precedenti
- **Metodi Factory**: `forCheck()`, `forLabel()`, `forSetLabel()`, `forMessage()`
- **Metodi Utility**: `isCheckRequest()`, `isLabelRequest()`, `getAnyInstruction()`

### PlayResponse<T>
```java
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PlayResponse<T> {
    @JsonProperty("success")     private Boolean success;
    @JsonProperty("message")     private String message;
    @JsonProperty("Ball")        private Ball ball;           // Per newHomeBall
    @JsonProperty("composition") private Ball[] composition;  // Per getLabel/setLabel
    @JsonProperty("result")      private Ball[] result;      // Per getResult
    @JsonProperty("redPins")     private Integer redPins;    // Per sendResponse
    @JsonProperty("whitePins")   private Integer whitePins;  // Per sendResponse
    @JsonProperty("finished")    private Boolean finished;   // Per sendResponse
}
```

**Metodi Factory Disponibili**:
- `PlayResponse.error(String message)` - Errore generico
- `PlayResponse.forLabel(Ball[] balls)` - Risposta getLabel
- `PlayResponse.forComposition(Ball[] balls)` - Risposta setLabel
- `PlayResponse.forResult(Ball[] balls)` - Risposta getResult
- `PlayResponse.forCheckGame(int red, int white, boolean finished)` - Risposta sendResponse

## Metodi di Utilità

### `convertPositionToIndex(Position position)`
**Scopo**: Converte enum Position in indice numerico per accesso array.  
**Mapping**:
- `LABEL0` → 0
- `LABEL1` → 1
- `LABEL2` → 2
- `LABEL3` → 3
- `LABEL4` → 4
- `LABEL5` → 5

**Throws**: `RuntimeException` per posizioni non valide

### `resetHomeBallIndex()`
**Scopo**: Resetta l'indice delle palline home (chiamato da SystemController)

## Gestione degli Errori

### Tipi di Errore
1. **Istruzione Non Valida**: Quando il campo instruction/instructions/instraction non corrisponde
2. **Position Non Valida**: Quando l'enum Position non è supportato  
3. **Array Incompleto**: Quando la composizione non ha esattamente 4 elementi
4. **Runtime Exceptions**: Errori durante l'accesso al game state

### Pattern di Risposta
- **Errori Semplici**: `{"success": false, "message": "Descrizione errore"}`
- **Errori con Array**: Array di palline errore tramite `PlayResponse.getErrorBallArray()`

## Algoritmi Chiave

### Pin Counting Algorithm (sendResponse)
```java
// Conta pin rossi (posizione e colore corretti)
for (int i = 0; i < 4; i++) {
    if (userComposition[i].getColor() == correctComposition[i].getColor()) {
        redPins++;
        // Marca come usate per evitare doppi conteggi
    }
}

// Conta pin bianchi (colore corretto, posizione sbagliata)
for (int i = 0; i < 4; i++) {
    if (!usedCorrect[i]) { // Non già contata come pin rosso
        for (int j = 0; j < 4; j++) {
            if (!usedUser[j] && userComposition[j].getColor() == correctComposition[i].getColor()) {
                whitePins++;
                break;
            }
        }
    }
}
```

### Sequenza Ciclica (newHomeBall)
```java
Ball selectedBall = availableBalls[currentHomeBallIndex];
currentHomeBallIndex = (currentHomeBallIndex + 1) % availableBalls.length;
```

## Best Practices Implementate

### 1. **Type Safety**
- Utilizzo di generics per responses tipizzate
- Enum per Position invece di magic numbers

### 2. **Unified Request Pattern**
- Single DTO class per tutte le operazioni
- Factory methods per creazione type-safe

### 3. **Consistent Error Handling**
- Pattern uniforme per validazione istruzioni
- Gestione eccezioni standardizzata

### 4. **Game State Management**
- Separazione tra controllo logico e stato del gioco
- Gestione automatica delle condizioni di vittoria

### 5. **API Design**
- Endpoint RESTful semantici
- Response structures appropriate per ogni operazione
- Validazione completa degli input

## Integrazione con SystemController

Il `PlayController` è utilizzato dal `SystemController` per:
- **Reset Home Ball Index**: Chiamata `resetHomeBallIndex()` durante `newGame`
- **Game State Coordination**: Mantenimento consistenza stato tra controllers
- **Separation of Concerns**: SystemController gestisce persistence, PlayController gestisce gameplay