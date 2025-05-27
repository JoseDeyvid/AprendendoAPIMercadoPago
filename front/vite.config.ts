import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "6fec-2804-d56-2a0-d400-b1bc-5f35-103-3f9f.ngrok-free.app"
    ]
  }
})
