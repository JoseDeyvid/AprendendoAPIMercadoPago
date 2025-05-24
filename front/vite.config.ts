import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "5c16-2804-d56-2a0-d400-5b8-ea9f-c90f-8919.ngrok-free.app"
    ]
  }
})
