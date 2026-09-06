import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { viteSingleFile } from "vite-plugin-singlefile";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(() => {
  // Ativa o modo arquivo único se a variável estiver presente
  const isSingleFile = process.env.VITE_SINGLE_FILE === "true";

  return {
    plugins: [
      svelte(),
      // O plugin injeta o CSS/JS no HTML apenas se for build single-file
      ...(isSingleFile ? [viteSingleFile()] : []),
      // Configuração do WebApp Instalável
      VitePWA({
             registerType: "autoUpdate",
             manifest: {
               name: "JedSvelted Demo App",
               short_name: "JedSvelted",
               description: "Demonstração da biblioteca @edujed/jedsvelted-ui",
               theme_color: "#ff3e00",
               background_color: "#ffffff",
               display: "standalone", // Faz o app abrir em tela cheia, sem barra de endereço do navegador
               icons: [
                 {
                   src: "https://svelte.dev", // Ícone temporário (pode usar o seu depois)
                   sizes: "512x512",
                   type: "image/svg+xml",
                   purpose: "any maskable"
                 }
               ]
             }
           }),
    ],
    server: {
      fs: {
        // Mantém a permissão para acessar a biblioteca vizinha em dev
        allow: [".."],
      },
    },
    optimizeDeps: {
      // Força o processamento correto da biblioteca local
      exclude: ["@edujed/jedsvelted-ui"],
    },
    build: {
      // Define pastas de saída diferentes para um build não apagar o outro
      outDir: isSingleFile ? "dist-single" : "dist",
      assetsInlineLimit: isSingleFile ? 100000000 : 4096,
      chunkSizeWarningLimit: isSingleFile ? 100000000 : 500,
      cssCodeSplit: !isSingleFile,
    },
  };
});
