import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import deno from "@deno/vite-plugin";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
    deno(),
  ],
  resolve: {
    alias: {
      "@scope/server-mysql": path.resolve(__dirname, "../server-mysql/mod.ts"),
      "@scope/server-ssms": path.resolve(__dirname, "../server-ssms/mod.ts"),
      "xlsx": "https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs",
    },
  },
});
