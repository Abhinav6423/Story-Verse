import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // 1. Increase the warning limit so the terminal is cleaner
    chunkSizeWarningLimit: 1000,

    // 2. Tell Vite how to split the code
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React core (Loads on every page, keep it separate)
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],

          // Split UI Libraries (Icons, Toasts - usually lighter)
          'vendor-ui': ['lucide-react', 'react-toastify'],

          // ⚠️ ISOLATE THE HEAVY EDITOR 
          // This ensures the huge editor code is NOT downloaded on the Home page.
          // (Only remove these lines if you aren't using TipTap/Mantine yet)
          'heavy-editor': ['@tiptap/react', '@tiptap/starter-kit', '@mantine/tiptap'],
        },
      },
    },
  },
})