import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { runWebSocketTest } from './test/WebSocketTester';
import './main.css'; 
import Lobby from './components/Lobby/Lobby';

runWebSocketTest(); // Test WebSocket

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
