/**
 * Utilità per il preloading strategico del componente Game
 */

// Preload del componente Game quando l'utente è nella lobby
export const preloadComponents = {
  // Precarica il componente Game quando l'utente è nella lobby
  preloadGame: () => import('../components/Game/Game')
};
