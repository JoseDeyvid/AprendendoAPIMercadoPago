import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "5f74-2804-d56-290-3b00-24d3-43-d916-99c7.ngrok-free.app"
    ]
  }
})
