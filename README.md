# 🎯 MasterMind v2

![MasterMind Logo](./icon.png)

**Una moderna implementazione del classico gioco MasterMind con interfaccia desktop ed architettura full-stack**

## 📋 Indice

- [📖 Descrizione](#-descrizione)
- [🎮 Come Giocare](#-come-giocare)
- [🚀 Come Provare l'Applicazione](#-come-provare-lapplicazione)
- [🛠️ Tecnologie Utilizzate](#%EF%B8%8F-tecnologie-utilizzate)
- [🏗️ Architettura del Progetto](#%EF%B8%8F-architettura-del-progetto)
- [📁 Struttura del Progetto](#-struttura-del-progetto)
- [🔧 Configurazione di Sviluppo](#-configurazione-di-sviluppo)
- [📡 API Endpoints](#-api-endpoints)
- [🎨 Features Principali](#-features-principali)
- [⚙️ Requisiti di Sistema](#%EF%B8%8F-requisiti-di-sistema)
- [🐛 Troubleshooting](#-troubleshooting)
- [👥 Contribuire](#-contribuire)

## 📖 Descrizione

MasterMind v2 è una versione moderna e completa del classico gioco di logica MasterMind. L'applicazione combina un backend Spring Boot robusto con un frontend React elegante, il tutto impacchettato in un'applicazione desktop Electron per un'esperienza utente ottimale.

### 🎯 Obiettivo del Gioco

Il gioco consiste nell'indovinare una sequenza segreta di 4 colori scelti dal computer. Il giocatore ha a disposizione 6 tentativi per indovinare la combinazione corretta, ricevendo feedback sotto forma di:

- **🔴 Pin Rossi**: Indicano colori corretti nella posizione giusta
- **⚪ Pin Bianchi**: Indicano colori corretti ma nella posizione sbagliata

### 🌈 Colori Disponibili

Il gioco utilizza 6 colori distinti:
- 🔴 **Rosso** (RED)
- 🔵 **Blu** (BLUE) 
- 🟢 **Verde** (GREEN)
- 🟡 **Giallo** (YELLOW)
- 🟠 **Arancione** (ORANGE)
- 🟣 **Viola** (PURPLE)

## 🎮 Come Giocare

### 🚀 Avvio del Gioco

1. **Avvia l'applicazione** tramite il comando `npm run project`
2. **Attendi il caricamento** di tutti i componenti (backend, frontend, Electron)
3. **Clicca su "Nuova Partita"** per iniziare

### 🎯 Meccaniche di Gioco

1. **Scegli la Composizione**: Seleziona 4 colori dalla palette disponibile
2. **Posiziona le Palline**: Trascina i colori nelle 4 posizioni del tentativo corrente
3. **Conferma il Tentativo**: Clicca su "Invia" per sottoporre la tua combinazione
4. **Analizza il Feedback**: 
   - Conta i pin rossi (posizione e colore corretti)
   - Conta i pin bianchi (colore corretto, posizione sbagliata)
5. **Strategizza**: Usa le informazioni ricevute per il prossimo tentativo
6. **Vinci**: Indovina la sequenza corretta entro 6 tentativi!

### 🏆 Condizioni di Vittoria

- **Vittoria**: 4 pin rossi (sequenza completamente indovinata)
- **Sconfitta**: Esaurimento dei 6 tentativi senza indovinare la sequenza

## 🚀 Come Provare l'Applicazione

### 📋 Prerequisiti

Prima di iniziare, assicurati di avere installato:

- **Node.js** (versione 18 o superiore)
- **Java 21** (per il backend Spring Boot)
- **Maven** (per la gestione delle dipendenze Java)
- **Git** (per clonare il repository)

### 🔽 Installazione

1. **Clona il repository**:
   ```bash
   git clone https://github.com/yourusername/MasterMindv2.git
   cd MasterMindv2
   ```

2. **Installa le dipendenze root**:
   ```bash
   npm install
   ```

3. **Installa le dipendenze del frontend**:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Verifica l'installazione Java/Maven**:
   ```bash
   cd backend
   ./mvnw --version  # Su Windows: mvnw.cmd --version
   cd ..
   ```

### ▶️ Avvio Rapido

**Comando Unico per Avviare Tutto**:
```bash
npm run project
```

Questo comando avvia simultaneamente:
- 🟢 **Backend Spring Boot** (porta 8080)
- 🔵 **Frontend React** (porta 5173) 
- 🖥️ **Applicazione Electron Desktop**

### 🔧 Avvio Separato dei Componenti

Se preferisci maggiore controllo, puoi avviare i componenti singolarmente:

```bash
# Backend Spring Boot
npm run java

# Frontend React (in un nuovo terminale)
npm run react

# Applicazione Electron (in un nuovo terminale)
npm run electron
```

### ✅ Verifica del Funzionamento

1. **Backend**: Vai su `http://localhost:8080/MasterMind/ping` (dovrebbe rispondere "pong")
2. **Frontend**: Vai su `http://localhost:5173` (interfaccia React)
3. **Desktop**: L'applicazione Electron dovrebbe aprirsi automaticamente

## 🛠️ Tecnologie Utilizzate

### 🖥️ **Frontend**
- **React 19.1.1** - Libreria UI moderna e reattiva
- **TypeScript 5.8.3** - Tipizzazione statica per JavaScript
- **Vite 7.1.2** - Build tool veloce per lo sviluppo
- **React Router DOM 7.6.3** - Routing client-side
- **CSS3** - Styling avanzato con animazioni

### ⚙️ **Backend**
- **Spring Boot 3.5.4** - Framework Java enterprise
- **Spring Web** - API REST e controller
- **Spring WebSocket** - Comunicazione real-time
- **Java 21** - Linguaggio di programmazione moderno
- **Maven** - Gestione dipendenze e build
- **Lombok** - Riduzione boilerplate code

### 🖥️ **Desktop Application**
- **Electron 37.1.0** - Framework per app desktop cross-platform
- **Electron Builder 26.0.12** - Packaging e distribuzione

### 🔧 **Development Tools**
- **Concurrently 8.2.2** - Esecuzione parallela di comandi
- **ESLint** - Linting del codice JavaScript/TypeScript
- **Node-Fetch 3.3.2** - Client HTTP per Node.js

### 🌐 **Protocolli e Standard**
- **REST API** - Comunicazione HTTP stateless
- **WebSocket** - Comunicazione real-time bidirezionale
- **JSON** - Formato dati per API
- **CORS** - Cross-Origin Resource Sharing

## 🏗️ Architettura del Progetto

### 🔄 **Pattern Architetturale**

L'applicazione segue un'architettura **Client-Server** con i seguenti layer:

```
┌─────────────────────────────────────┐
│          Electron Desktop           │ ← Presentation Layer
├─────────────────────────────────────┤
│            React Frontend           │ ← UI Logic Layer  
├─────────────────────────────────────┤
│         REST API Gateway            │ ← Communication Layer
├─────────────────────────────────────┤
│         Spring Boot Backend         │ ← Business Logic Layer
├─────────────────────────────────────┤
│          Game State Management      │ ← Data Layer
└─────────────────────────────────────┘
```

### 🔗 **Flusso di Comunicazione**

1. **User Interaction** → React Components
2. **State Management** → React Context + Hooks
3. **API Calls** → Fetch to Spring Boot
4. **Business Logic** → Spring Controllers + Services
5. **Game State** → Game Object + Serialization
6. **Response** → JSON back to React
7. **UI Update** → React Re-rendering

### 🎯 **Design Patterns Utilizzati**

- **MVC (Model-View-Controller)** - Separazione logica backend
- **Component-Based Architecture** - Componenti React riutilizzabili
- **Dependency Injection** - Spring IoC Container
- **Context Pattern** - Gestione stato React
- **Repository Pattern** - Gestione persistenza dati

## 📁 Struttura del Progetto

```
MasterMindv2/
├── 📄 package.json              # Configurazione principale e script
├── 📄 config.js                 # Configurazione Electron
├── 🖼️ icon.png                  # Icona dell'applicazione
├── 📄 README.md                 # Documentazione (questo file)
│
├── 🗂️ backend/                  # 🟢 Backend Spring Boot
│   ├── 📄 pom.xml               # Dipendenze Maven
│   ├── 📄 mvnw, mvnw.cmd        # Maven Wrapper
│   ├── 🗂️ src/main/java/com/backend/
│   │   ├── 📄 BackendApplication.java
│   │   ├── 🗂️ config/           # Configurazioni (CORS, WebSocket)
│   │   ├── 🗂️ controller/       # Controller REST
│   │   │   ├── 🗂️ PlayController/    # Gestione gameplay
│   │   │   ├── 🗂️ SystemController/  # Operazioni sistema
│   │   │   └── 🗂️ VariableController/ # Gestione variabili
│   │   ├── 🗂️ Enums/            # Enumerazioni (Color, Position, Status)
│   │   ├── 🗂️ event/            # Eventi WebSocket
│   │   ├── 🗂️ Object/           # Oggetti di dominio (Game, Ball)
│   │   ├── 🗂️ service/          # Logica di business
│   │   └── 🗂️ util/             # Utilità
│   └── 🗂️ src/main/resources/   # File di configurazione
│
├── 🗂️ frontend/                 # 🔵 Frontend React
│   ├── 📄 package.json          # Dipendenze npm
│   ├── 📄 vite.config.ts        # Configurazione Vite
│   ├── 📄 tsconfig.json         # Configurazione TypeScript
│   ├── 📄 index.html            # Entry point HTML
│   ├── 🗂️ public/              # Asset statici
│   └── 🗂️ src/
│       ├── 📄 main.tsx          # Entry point React
│       ├── 📄 main.css          # Stili globali
│       ├── 🗂️ Components/       # Componenti React
│       │   ├── 🗂️ Ball/         # Componente pallina
│       │   ├── 🗂️ Button/       # Componente pulsante
│       │   ├── 🗂️ Game/         # Componente gioco principale
│       │   ├── 🗂️ Lobby/        # Componente lobby
│       │   ├── 🗂️ Load/         # Componente caricamento
│       │   └── 🗂️ ...
│       ├── 🗂️ contexts/         # Context React per stato globale
│       ├── 🗂️ Types/            # Definizioni TypeScript
│       └── 🗂️ utils/            # Funzioni di utilità
│
└── 🗂️ node_modules/             # Dipendenze npm
```

## 🔧 Configurazione di Sviluppo

### 🌐 **Porte di Default**

- **Backend Spring Boot**: `8080`
- **Frontend React/Vite**: `5173`  
- **Electron**: Finestra desktop (usa porta frontend)

### ⚙️ **Variabili di Ambiente**

Crea un file `.env` nella cartella `frontend/` per configurazioni personalizzate:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_TITLE=MasterMind v2
```

### 🔧 **Configurazione CORS**

Il backend è configurato per accettare richieste da qualsiasi origine durante lo sviluppo:

```java
@CrossOrigin(origins = "*")
```

⚠️ **Nota**: In produzione, limita le origini per sicurezza.

### 🗃️ **Persistenza Dati**

Il gioco salva automaticamente lo stato in `backend/game.dat` utilizzando la serializzazione Java.

## 📡 API Endpoints

### 🎮 **PlayController** (`/MasterMind`)

| Endpoint | Metodo | Descrizione |
|----------|--------|-------------|
| `/getBaseBall` | POST | Ottiene le palline base disponibili |
| `/sendResponse` | POST | Invia un tentativo e ottiene feedback |
| `/calculatePins` | POST | Calcola pin rossi/bianchi per una composizione |
| `/getResult` | POST | Ottiene la soluzione corretta del gioco |

### 🔧 **SystemController** (`/MasterMind`)

| Endpoint | Metodo | Descrizione |
|----------|--------|-------------|
| `/ping` | POST | Test di connessione al server |
| `/newGame` | POST | Inizializza una nuova partita |
| `/saveGame` | POST | Salva lo stato corrente del gioco |
| `/loadGame` | POST | Carica uno stato di gioco salvato |

### 📋 **Formato Richieste**

```json
{
  "instraction": "nomeComando",
  "composition": [
    {"color": "RED", "position": "POS0"},
    {"color": "BLUE", "position": "POS1"},
    {"color": "GREEN", "position": "POS2"},
    {"color": "YELLOW", "position": "POS3"}
  ]
}
```

### 📋 **Formato Risposte**

```json
{
  "checkResponse": true,
  "homeBalls": [...],
  "redPins": 2,
  "whitePins": 1,
  "errorMessage": null
}
```

## 🎨 Features Principali

### ✨ **Gameplay**
- 🎯 Logica MasterMind classica con 6 colori e 4 posizioni
- 🔄 Sistema di feedback con pin rossi e bianchi
- 💾 Salvataggio/caricamento automatico dello stato
- 🏆 Rilevamento automatico vittoria/sconfitta
- 📊 Tracking dei tentativi e progressi

### 🖥️ **Interfaccia Utente**
- 🎨 Design moderno e intuitivo
- 🖱️ Drag & Drop per posizionare le palline
- 🎭 Animazioni fluide e feedback visivo
- 📱 Layout responsive per diverse risoluzioni
- 🌓 Temi personalizzabili (tramite CSS)

### ⚡ **Performance**
- 🚀 Lazy loading dei componenti React
- 🔄 Comunicazione WebSocket per aggiornamenti real-time
- 📦 Bundling ottimizzato con Vite
- 🗂️ Gestione efficiente dello stato con Context API

### 🔧 **Sviluppo**
- 🔥 Hot Module Replacement (HMR) per sviluppo rapido
- 📝 Documentazione completa del codice
- 🧪 Struttura pronta per testing
- 📊 Logging dettagliato per debugging

## ⚙️ Requisiti di Sistema

### 💻 **Minimi**
- **OS**: Windows 10, macOS 10.14, Ubuntu 18.04
- **RAM**: 4GB
- **Storage**: 1GB di spazio libero
- **Node.js**: v18.0.0+
- **Java**: JDK 21+

### 🚀 **Raccomandati**
- **OS**: Windows 11, macOS 12+, Ubuntu 20.04+
- **RAM**: 8GB+
- **Storage**: 2GB+ di spazio libero
- **CPU**: Multi-core per compilazione rapida
- **Internet**: Per download dipendenze

## 🐛 Troubleshooting

### ❗ **Problemi Comuni**

#### 🔴 "Porta già in uso"
```bash
# Trova e termina il processo sulla porta 8080
netstat -ano | findstr 8080  # Windows
lsof -ti:8080 | xargs kill   # macOS/Linux
```

#### 🔴 "Java non trovato"
```bash
# Verifica installazione Java
java --version
javac --version

# Se non installato, scarica da: https://adoptium.net/
```

#### 🔴 "Errore di build Maven"
```bash
# Pulisci e reinstalla dipendenze
cd backend
./mvnw clean install  # mvnw.cmd su Windows
```

#### 🔴 "Moduli Node non trovati"
```bash
# Reinstalla dipendenze
rm -rf node_modules package-lock.json
npm install

# Stessa cosa per frontend
cd frontend
rm -rf node_modules package-lock.json  
npm install
```

### 🔍 **Debug**

#### 📊 **Log Backend**
I log di Spring Boot vengono mostrati nella console dove hai eseguito `npm run java`.

#### 📊 **Log Frontend**  
Apri Developer Tools del browser (F12) per vedere log React e errori JavaScript.

#### 📊 **Log Electron**
I log Electron sono visibili nella console dove hai eseguito `npm run electron`.

### 🆘 **Supporto**

Se incontri problemi non risolti:

1. 🔍 Controlla i log di tutti i componenti
2. 🔄 Prova a riavviare tutti i servizi
3. 💾 Verifica che `game.dat` non sia corrotto (eliminalo per reset)
4. 🌐 Testa la connettività API con `curl` o Postman

## 👥 Contribuire

### 🤝 **Come Contribuire**

1. **Fork** il repository
2. **Crea** un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** le tue modifiche (`git commit -m 'Add some AmazingFeature'`)
4. **Push** nel branch (`git push origin feature/AmazingFeature`)
5. **Apri** una Pull Request

### 📋 **Linee Guida**

- 📝 Scrivi codice pulito e ben commentato
- 🧪 Aggiungi test per nuove funzionalità
- 📚 Aggiorna la documentazione se necessario
- 🎨 Segui le convenzioni di naming esistenti
- 🔍 Testa accuratamente le modifiche

### 🐛 **Segnalazione Bug**

Usa GitHub Issues e includi:
- 📋 Descrizione dettagliata del problema
- 🔄 Passi per riprodurre il bug
- 💻 Informazioni sistema (OS, versioni Node/Java)
- 📊 Log di errore se disponibili

---

## 📄 Licenza

Questo progetto è sotto licenza ISC. Vedi il file `LICENSE` per dettagli.

## 🙏 Ringraziamenti

- 🎮 Ispirato dal classico gioco MasterMind di Mordecai Meirowitz
- 🚀 Costruito con tecnologie open-source moderne
- 👨‍💻 Sviluppato con passione per l'apprendimento

---

**🎯 Buon divertimento con MasterMind v2! 🎉**

*Per domande o supporto, apri una issue su GitHub.*