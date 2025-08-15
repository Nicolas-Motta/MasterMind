# SystemController Documentation

## Panoramica

La classe `SystemController` è il controller principale per la gestione delle operazioni di sistema del gioco MasterMind. Gestisce le richieste HTTP relative alla comunicazione con il client e alla gestione delle partite.

## Annotazioni

- `@RestController`: Indica che questa classe è un controller REST che gestisce richieste HTTP
- `@RequestMapping("/MasterMind")`: Definisce il percorso base per tutti gli endpoint (`/MasterMind`)
- `@CrossOrigin(origins = "http://localhost:3000")`: Abilita le richieste CORS dal frontend React in esecuzione su localhost:3000

## Dipendenze

### ObjectGame
```java
@Autowired
private ObjectGame game;
```
- **Tipo**: `ObjectGame`
- **Scope**: Istanza del gioco gestita da Spring
- **Funzione**: Rappresenta lo stato corrente della partita MasterMind

## Endpoints

### 1. Ping Endpoint

```java
@PostMapping("/ping")
public CheckResponse ping(@RequestBody Message message)
```

**Descrizione**: Endpoint per testare la connettività con il server.

**Parametri**:
- `message`: Oggetto `Message` contenente l'istruzione

**Comportamento**:
- Se `message.getInstraction()` è uguale a `"ping"`, restituisce `CheckResponse("pong")`
- Altrimenti restituisce `CheckResponse("")`

**Esempio di utilizzo**:
```json
// Request
POST /MasterMind/ping
{
    "instraction": "ping"
}

// Response
{
    "checkResponse": "pong"
}
```

### 2. New Game Endpoint

```java
@PostMapping("/newGame")
public CheckResponse createNewGame(@RequestBody Message message)
```

**Descrizione**: Crea una nuova partita del gioco MasterMind.

**Parametri**:
- `message`: Oggetto `Message` contenente l'istruzione

**Comportamento**:
- Se `message.getInstraction()` è uguale a `"newGame"`, crea una nuova istanza di `ObjectGame` e restituisce `CheckResponse(true)`
- Altrimenti restituisce `CheckResponse(false)`

**Esempio di utilizzo**:
```json
// Request
POST /MasterMind/newGame
{
    "instraction": "newGame"
}

// Response
{
    "checkResponse": true
}
```

## Classi di Supporto

### Message
Classe per la deserializzazione delle richieste JSON.

**Campi**:
- `instraction`: String che indica il tipo di operazione richiesta

### CheckResponse
Classe per la serializzazione delle risposte JSON.

**Campi**:
- `checkResponse`: Object che può contenere boolean o String come risposta

## Configurazione

### CORS
Il controller è configurato per accettare richieste dal frontend React:
- **Origine consentita**: `http://localhost:3000`
- **Metodi**: POST (per entrambi gli endpoint)

### Spring Boot
Il controller utilizza l'injection di dipendenze di Spring per gestire l'istanza `ObjectGame`.

## Note Tecniche

1. **Thread Safety**: L'istanza `ObjectGame` è condivisa, potrebbe essere necessario considerare la sincronizzazione per applicazioni multi-utente

2. **Gestione Errori**: Attualmente non è implementata una gestione esplicita degli errori

3. **Validazione**: Non è presente validazione dei dati in input

## Possibili Miglioramenti

1. **Gestione delle Sessioni**: Implementare un sistema di sessioni per supportare multiple partite simultanee
2. **Validation**: Aggiungere validazione sui parametri in input
3. **Exception Handling**: Implementare un sistema di gestione centralizzata delle eccezioni
4. **Logging**: Aggiungere logging per tracciare le operazioni
5. **Security**: Implementare meccanismi di sicurezza se necessario

## Dipendenze Maven

Assicurarsi che il `pom.xml` includa:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

Per il supporto CORS e le funzionalità REST.
