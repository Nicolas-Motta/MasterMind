import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import './main.css'
import { PositionProvider } from './contexts/PositionContext';
import { WebSocketProvider } from './contexts/TransfertContext';

// Gestione F11 -> fullscreen (toggle)
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.().catch(() => { /* ignore */ })
  } else {
    document.exitFullscreen?.().catch(() => { /* ignore */ })
  }
}

// Intercetta F11 a livello globale; non interferisce con input attivi
window.addEventListener('keydown', (e) => {
  try {
    if (e.key === 'F11') {
      const activeTag = document.activeElement?.tagName || ''
      // lascia il comportamento normale se si è su un campo di input/select/textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag)) return
      e.preventDefault()
      toggleFullscreen()
    }
  } catch {
    // non bloccare l'app in caso di errori imprevisti
  }
})

// Lazy loading dei componenti per ottimizzare il bundle iniziale
const Lobby = lazy(() => import('./components/Lobby/Lobby'));
const Game = lazy(() => import('./components/Game/Game'));
const Load = lazy(() => import('./components/Load/Load'));

function GameReRender() {
  const location = useLocation();
  //? Usa sia il pathname che lo state per forzare il remount
  const key = location.pathname + (location.state?.timestamp || '');
  return <Game key={key} />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense>
        <WebSocketProvider>
          <Routes>
            <Route path="/" element={<Load />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/game" element={
              <PositionProvider>
                <GameReRender />
              </PositionProvider>
            } />
          </Routes>
        </WebSocketProvider>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
