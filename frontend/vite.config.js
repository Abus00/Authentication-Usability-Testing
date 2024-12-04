import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  envPrefix: 'VITE_', // vite meta env
  server: {
    port: 3000, // port for backend cors
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'vite-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'vite-cert.pem')),
    },
  },
})