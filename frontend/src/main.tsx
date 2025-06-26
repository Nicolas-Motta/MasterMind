import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { runWebSocketTest } from './test/WebSocketTester';

runWebSocketTest(); // Test WebSocket

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  </StrictMode>,
)
