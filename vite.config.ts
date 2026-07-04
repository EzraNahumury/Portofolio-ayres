import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [checker({ typescript: true })],
  worker: {},
  build: {
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        project: resolve(__dirname, "project.html"),
      },
    },
  },
  server: {
    open: true,
    port: 1234,
    host: "localhost",
  },
});
