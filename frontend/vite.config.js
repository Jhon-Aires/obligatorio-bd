import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // 👈 Change this to desired port
    host: true // 👈 Required for Docker
  },
  
})
