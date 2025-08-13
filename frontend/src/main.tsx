import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import './main.css'
import Lobby from './Components/Lobby/Lobby';
import Game from './Components/Game/Game';
import Load from './Components/Load/Load';

function GameReRender() {
  const location = useLocation();
  return <Game key={location.pathname} />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Load/>}/>
          <Route path="/lobby" element={<Lobby/>}/>
          <Route path="/game" element={<GameReRender/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
