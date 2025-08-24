// packages/frontend/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    hmr: {
      host: 'a9e109e52e1c.ngrok-free.app', // <-- UPDATE THIS
      protocol: 'wss',
    },
    allowedHosts: [
      'a9e109e52e1c.ngrok-free.app' // <-- AND UPDATE THIS
    ],
    proxy: {
      '/socket.io': { // Default path for WebSocket connections
        target: 'ws://localhost:8080', // Your backend server
        ws: true, // This is the crucial line that enables WebSocket proxying
      },
    },
  }
})