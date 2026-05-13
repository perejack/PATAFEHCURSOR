import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api/hashback": {
        target: "https://api.hashback.co.ke",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/hashback/, ""),
        secure: true,
      },
    },
  },
});
