import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix: 'VITE_', //because we are using vite meta env
  server: {
    port: 3000, // port for backend cors
    https: true, // enable https
  },
})