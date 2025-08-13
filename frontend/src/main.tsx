import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './main.css'
import Lobby from './Components/Lobby/Lobby';
import Game from './Components/Game/Game';
import Load from './Components/Load/Load';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Load/>}/>
          <Route path="/lobby" element={<Lobby/>}/>
          <Route path="/game" element={<Game/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
