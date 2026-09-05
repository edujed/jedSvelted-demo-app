import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // ESSA LINHA É OBRIGATÓRIA para limpar o ": RouteState" antes do Vite travar
  preprocess: vitePreprocess(),

  compilerOptions: {
    runes: true, // Garante suporte total ao Svelte 5 ($state, etc)
  },
};

export default config;
