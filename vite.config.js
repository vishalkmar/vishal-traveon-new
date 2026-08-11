import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', // Allow access from any IP
    port: 5173,
    cors: true, // Enable CORS
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Apache has no MIME mapping for .mjs and serves it with an empty
        // Content-Type, which browsers refuse to execute as a module — that
        // breaks pdf.js's worker. Emit those assets as .js instead.
        assetFileNames: (info) =>
          (info.names?.[0] || info.name || "").endsWith(".mjs")
            ? "assets/[name]-[hash].js"
            : "assets/[name]-[hash][extname]",
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
          ],
          'ui-libs': [
            'react-hot-toast',
            'framer-motion',
            'motion',
            'aos',
          ],
          'icons': [
            'react-icons',
            'lucide-react',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
