import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";

// https://vitejs.dev/config
export default defineConfig({
  base: "",
  server: {
    fs: {
      allow: [".", "./src-renderer"],
    },
  },
  plugins: [sveltekit()],
  clearScreen: false,
  css: {
    postcss: "./postcss.config.cjs",
  },
  build: {
    outDir: ".vite/main_window",
    emptyOutDir: true,
    assetsDir: "assets",
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name][extname]",
        chunkFileNames: "assets/[name].js",
        entryFileNames: "assets/[name].js",
      },
    },
  },
});
