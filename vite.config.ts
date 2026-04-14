import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],   // IMPORTANT: comma must be here

  define: {
    global: 'window'
  }
})
