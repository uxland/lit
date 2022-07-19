import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    babel: {
      parserOpts: {
        plugins: ['decorators-legacy', 'classProperties']
      }
    },
  })],
  define: {
    'process.env': {}
  },
  build: {
    lib: {
      entry: 'index.html',
      formats: ['es']
    },
  }
})
