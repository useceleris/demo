import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// The dev server sends /api requests to the backend.
export default defineConfig({
  plugins: [vue()],
  server: { proxy: { "/api": "http://127.0.0.1:4000" } },
});
