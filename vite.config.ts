import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig(({ mode }) => {
  // Ativa o modo arquivo único se a variável estiver presente
  const isSingleFile = process.env.VITE_SINGLE_FILE === "true";

  return {
    plugins: [
      svelte(),
      // O plugin injeta o CSS/JS no HTML apenas se for build single-file
      ...(isSingleFile ? [viteSingleFile()] : []),
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
