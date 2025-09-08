# SystemController Documentation

## Panoramica

Il `SystemController` è il controller REST principale per la gestione delle operazioni di sistema del gioco MasterMind. Fornisce un'API unificata per la comunicazione client-server, la gestione delle partite e le operazioni di persistenza dei dati.

## Architettura

### Annotazioni di Classe
- `@RestController`: Definisce la classe come controller REST Spring Boot
- `@RequestMapping("/MasterMind")`: Imposta il path base per tutti gli endpoint
- `@CrossOrigin(origins = "*")`: Abilita CORS per tutte le origini (configurazione sviluppo)

### Dipendenze Iniettate
```java
@Autowired
private Game game;              // Istanza principale del gioco

@Autowired  
private PlayController playController;  // Controller per le operazioni di gioco
```

### Configurazione
```java
String filePath = "game.dat";   // File per la persistenza del gioco
```

## API Endpoints

### 1. Health Check - `/ping`

```java
@PostMapping("/ping")
public SystemResponse<String> ping(@RequestBody SystemRequest message)
```

**Descrizione**: Endpoint per verificare lo stato del server e la connettività.

**Request Body**:
```json
{
    "instraction": "ping"
}
```

**Responses**:
- **Successo**: `{"checkResponse": "pong"}`
- **Fallimento**: `{"checkResponse": ""}`

**Comportamento**:
- Valida che l'istruzione sia esattamente `"ping"`
- Restituisce risposta immediata senza effetti collaterali

---

### 2. Nuova Partita - `/newGame`

```java
@PostMapping("/newGame")
public SystemResponse<Boolean> createNewGame(@RequestBody SystemRequest message)
```

**Descrizione**: Inizializza una nuova partita del MasterMind.

**Request Body**:
```json
{
    "instraction": "newGame"
}
```

**Responses**:
- **Successo**: `{"checkResponse": true}`
- **Fallimento**: `{"checkResponse": false}`

**Operazioni Eseguite**:
1. Valida l'istruzione `"newGame"`
2. Chiama `game.newGame()` per inizializzare una nuova partita
3. Resetta l'indice delle palline home tramite `playController.resetHomeBallIndex()`

---

### 3. Salvataggio Partita - `/saveGame`

```java
@PostMapping("/saveGame")
public SystemResponse<Void> saveGame(@RequestBody SystemRequest message)
```

**Descrizione**: Salva lo stato corrente della partita su file.

**Request Body**:
```json
{
    "instraction": "saveGame"
}
```

**Responses**:
- **Successo**: `{"success": true, "message": "Operazione completata con successo"}`
- **Errore Salvataggio**: `{"success": false, "message": "Errore durante il salvataggio del gioco"}`
- **Istruzione Non Valida**: `{"success": false, "message": "Istruzione non valida"}`

**File di Destinazione**: `game.dat` (configurabile tramite `filePath`)

---

### 4. Caricamento Partita - `/loadGame`

```java
@PostMapping("/loadGame")
public SystemResponse<Void> loadGame(@RequestBody SystemRequest message)
```

**Descrizione**: Carica una partita precedentemente salvata.

**Request Body**:
```json
{
    "instraction": "loadGame"
}
```

**Responses**:
- **Successo**: `{"success": true, "message": "Operazione completata con successo"}`
- **Errore Caricamento**: `{"success": false, "message": "Errore durante il caricamento del gioco o file non trovato"}`
- **Istruzione Non Valida**: `{"success": false, "message": "Istruzione non valida"}`

**File Sorgente**: `game.dat` (configurabile tramite `filePath`)

## Classi di Supporto

### SystemRequest
```java
public class SystemRequest {
    @JsonProperty("instraction")
    private String instraction;  // Istruzione da eseguire
}
```

**Utilizzo**: Classe DTO per la deserializzazione delle richieste client.

### SystemResponse<T>
```java
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SystemResponse<T> {
    @JsonProperty("success")     private Boolean success;
    @JsonProperty("message")     private String message;
    @JsonProperty("data")        private T data;
    @JsonProperty("checkResponse") private Object checkResponse;
}
```

**Caratteristiche**:
- **Type-safe**: Utilizzo di generics per la tipizzazione
- **JSON ottimizzato**: Include solo campi non-null
- **Compatibilità**: Supporta sia il formato legacy (`checkResponse`) che il nuovo formato (`success`/`message`)

**Metodi Factory Disponibili**:
- `SystemResponse.success()` - Operazione riuscita
- `SystemResponse.error(String message)` - Operazione fallita
- `SystemResponse.gameOperation(boolean result)` - Operazioni di gioco

## Metodi di Utilità

### `isValidInstruction(String instruction, String expected)`
**Scopo**: Valida che l'istruzione ricevuta corrisponda a quella attesa.  
**Parametri**:
- `instruction`: Istruzione dal client
- `expected`: Istruzione attesa

**Return**: `boolean` - true se valida

## Gestione degli Errori

### Tipi di Errore
1. **Istruzione Non Valida**: Quando `instraction` non corrisponde al valore atteso
2. **Errore I/O**: Durante operazioni di salvataggio/caricamento file
3. **Stato del Gioco**: Errori nella gestione dello stato interno

### Pattern di Risposta
- **Ping**: Utilizza `checkResponse` per compatibilità legacy
- **Operazioni CRUD**: Utilizza pattern `success`/`message` per maggiore chiarezza

## Best Practices Implementate

### 1. **Separation of Concerns**
- Controller gestisce solo HTTP/REST logic
- Business logic delegata a `Game` e `PlayController`

### 2. **Type Safety**
- Utilizzo di generics per responses tipizzate
- DTO specifici per request/response

### 3. **Consistent API Design**
- Pattern uniforme per validazione istruzioni
- Gestione errori standardizzata

### 4. **Documentation**
- JavaDoc completa per tutti i metodi pubblici
- Documentazione API dettagliata
