import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 3000, strictPort: true },
  preview: {
    port: process.env.VITE_PREVIEW_PORT ? parseInt(process.env.VITE_PREVIEW_PORT) : 3000,
    strictPort: true,
    allowedHosts: [process.env.VITE_APP_URL ? process.env.VITE_APP_URL.replace(/https?:\/\//, '') : 'localhost'],
  },
})
