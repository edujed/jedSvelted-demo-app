import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  server: {
    fs: {
      // Permite que o Vite acesse arquivos fora da pasta demo-app (a lib vizinha)
      allow: ['..']
    }
  },
  optimizeDeps: {
    // Força o Vite a processar a sua biblioteca local corretamente
    exclude: ['@edujed/jedsvelted-ui']
  }
});
