import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { qrcode } from "vite-plugin-qrcode";

export default defineConfig({
  plugins: [react(), tailwindcss(), qrcode()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    watch: {
      ignored: ["**/.claude/**"],
    },
  },
});
