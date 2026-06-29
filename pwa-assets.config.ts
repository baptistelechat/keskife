import { defineConfig, minimalPreset } from "@vite-pwa/assets-generator/config";

export default defineConfig({
  preset: {
    ...minimalPreset,
    maskable: {
      sizes: [512],
      resizeOptions: { background: "#1e2d4a" },
    },
  },
  images: ["public/icon.svg"],
});
