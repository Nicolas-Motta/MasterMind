import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './main.css'
import Lobby from './components/Lobby/Lobby';
import Game from './components/Game/Game';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Lobby/>}/>
          <Route path="/game" element={<Game/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
