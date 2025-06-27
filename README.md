 ## Tempi di Sviluppo

 
 ## Task Principali
  - Sviluppo grafica base
  - Connesione backend e frontend
  - Logica di gioco base
  - Sistema di salvataggio delle partite e delle statistiche
  - Aggiunta delle impostazioni programmabili
  - Rilascio gioco
  - Inizio sviluppo DLC 
 
 ## Funzionamento del gioco
 
Il gioco è una versione digitalizata di MasterMind, i giocatori dovranno indovinare la sequenza di palline che il PC ha randomizzato

L'app è interamente gestita da electron che permette l'utilizzo del freamwork react per la parte grafica, e di spring boot con java per la parte di logica. I due sistemi sono messi in comunicazione tramite socket con la libreria WebSocket. Il protocollo di trasmissione è STOMP con l'invio di json

 ## Struttura dei Commit
  - I commit seguono la convenzione [tipo]: [descrizione breve]
 
 ## Credits
  - Sviluppo: [Nicolas Motta]
  - Ringraziamenti speciali a tutti i collaboratori e ai beta tester.