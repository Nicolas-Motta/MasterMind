import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import './main.css'
import { PositionProvider } from './contexts/PositionContext';

// Lazy loading dei componenti per ottimizzare il bundle iniziale
const Lobby = lazy(() => import('./Components/Lobby/Lobby'));
const Game = lazy(() => import('./Components/Game/Game'));
const Load = lazy(() => import('./Components/Load/Load'));

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
        <Routes>
          <Route path="/" element={<Load />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/game" element={
            <PositionProvider>
              <GameReRender />
            </PositionProvider>
          } />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
