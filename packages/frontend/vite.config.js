// packages/frontend/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    hmr: {
      host: '53e6f093a1b3.ngrok-free.app', // <-- UPDATE THIS
      protocol: 'wss',
    },
    allowedHosts: [
      '53e6f093a1b3.ngrok-free.app' // <-- AND UPDATE THIS
    ]
  }
})