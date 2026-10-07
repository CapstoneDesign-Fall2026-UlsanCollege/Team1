import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/Team1/',
  plugins: [vue()],
  server: { proxy: { '/api': 'http://127.0.0.1:3000' } },
})

