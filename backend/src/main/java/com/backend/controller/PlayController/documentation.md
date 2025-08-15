# Documentazione PlayController

## Panoramica
Il PlayController gestisce la logica di gioco per ottenere le palline durante una partita di MasterMind. Fornisce endpoint per recuperare le palline dalla sequenza base del gioco.

**Base URL**: `http://localhost:8080/MasterMind`

---

## Endpoint

### Ottieni Pallina Casa
**Endpoint**: `POST /MasterMind/newHomeBall`

**Descrizione**: Ottiene la prossima pallina dalla sequenza base del gioco. Ogni chiamata incrementa un contatore interno (`currentHomeBall`) e ritorna la pallina successiva dalla sequenza in modo ciclico.

**Headers**:
- `Content-Type: application/json`
- `Access-Control-Allow-Origin: http://localhost:3000`

**Request Body**:
```json
{
    "instraction": "newHomeBall"
}
```

**Response Successo**:
```json
{
    "Ball": {
        "id": "01015",
        "color": "BLUE",
        "position": "HOME"
    }
}
```

**Response Errore** (comando non riconosciuto):
```json
{
    "Ball": {
        "id": "error",
        "color": "ERROR",
        "position": "HOME"
    }
}
```

---

## Modelli Dati

### Message (Request)
```json
{
    "instraction": "string"  // Deve essere esattamente "newHomeBall"
}
```

### BallResponse (Response)
```json
{
    "Ball": {
        "id": "string",      // ID univoco formato da "01" + codiceColore + numeroRandom
        "color": "enum",     // RED, BLUE, GREEN, YELLOW, ORANGE, PURPLE, ERROR
        "position": "enum"   // HOME, GAME, ERROR
    }
}
```

### Ball Object
- **id**: Stringa identificativa univoca (formato: "01" + codiceColore + numero)
- **color**: Enum che rappresenta il colore della pallina
- **position**: Enum che rappresenta la posizione della pallina nel gioco

---

## Colori Disponibili

| Colore    | Codice ID | Enum Value |
|-----------|-----------|------------|
| Rosso     | 0         | RED        |
| Blu       | 1         | BLUE       |
| Verde     | 2         | GREEN      |
| Giallo    | 3         | YELLOW     |
| Arancione | 4         | ORANGE     |
| Viola     | 5         | PURPLE     |
| Errore    | E         | ERROR      |

---

## Comportamento

1. **Sequenza Ciclica**: Le palline vengono restituite in sequenza ciclica dalla sequenza base del gioco (`game.getBased()`)
2. **Contatore Interno**: Il controller mantiene un contatore `currentHomeBall` che si incrementa ad ogni chiamata
3. **Validazione**: Se l'`instraction` non è esattamente "newHomeBall", ritorna una pallina di errore
4. **Posizione**: Tutte le palline ritornate hanno position "HOME"

---

## Esempi di Utilizzo

### Richiesta Valida
```bash
curl -X POST http://localhost:8080/MasterMind/newHomeBall \
  -H "Content-Type: application/json" \
  -d '{"instraction": "newHomeBall"}'
```

**Risposta**:
```json
{
    "Ball": {
        "id": "01243",
        "color": "ORANGE",
        "position": "HOME"
    }
}
```

### Richiesta Non Valida
```bash
curl -X POST http://localhost:8080/MasterMind/newHomeBall \
  -H "Content-Type: application/json" \
  -d '{"instraction": "wrongCommand"}'
```

**Risposta**:
```json
{
    "Ball": {
        "id": "error",
        "color": "ERROR", 
        "position": "HOME"
    }
}
```

---

## Note Tecniche

- **CORS**: Configurato per accettare richieste da `http://localhost:3000`
- **Dipendenze**: Utilizza `@Autowired ObjectGame game` per accedere alla sequenza base
- **Stato**: Mantiene stato interno con `currentHomeBall` per tracciare la posizione nella sequenza
- **Modulo**: L'operazione modulo (`%`) garantisce che l'indice rimanga sempre valido anche dopo molte richieste