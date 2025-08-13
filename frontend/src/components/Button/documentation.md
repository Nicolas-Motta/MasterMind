# 🟦 Button Component

Questo componente React rappresenta un bottone personalizzato per l'app MasterMind.

## Props principali
- **children** 👶: contenuto del bottone
- **onClick** 🖱️: funzione chiamata al click
- **id** 🆔: id HTML
- **className** 🎨: classe CSS per stile e comportamento
- **disabled** 🚫: disabilita il bottone

## Funzionalità speciali
- Se `className` è `quitButton` chiude l'app (Electron o browser) ❌
- Se `className` è `mainMenuButton` naviga verso la lobby 🏠

## Utilizzo
```jsx
<Button className="mainMenuButton">Vai al menu</Button>
<Button className="quitButton">Esci</Button>
<Button>Normale</Button>
```

🔗 Usa React Router per la navigazione
🎮 Personalizza con le tue classi CSS
