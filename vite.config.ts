import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.gltf', '**/*.glb'],
  build: {
    outDir: 'dist', // Directorio de salida
    sourcemap: true, // Puedes activar los sourcemaps para depuración si es necesario
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'], // Mantén `three` como un chunk separado
          'react-three': ['@react-three/fiber', '@react-three/drei'], // Mantén `react-three` en su propio chunk
        }
      }
    }
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' } // Esto es útil si encuentras problemas con "this"
  }
})
