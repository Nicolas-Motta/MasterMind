// Centralized runtime configuration for the frontend (browser-safe)
// Prefer environment variables when available, with sensible fallbacks

export const config = {
  baseURL: (import.meta as any)?.env?.VITE_API_BASE_URL ?? 'http://localhost:8080',
  wsURL: (import.meta as any)?.env?.VITE_WS_BASE_URL ?? 'ws://localhost:8080'
};

export type AppConfig = typeof config;
