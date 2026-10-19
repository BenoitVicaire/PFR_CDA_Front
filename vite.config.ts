import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      // Mode `e2e` : les services Firebase sont remplacés par leur version en mémoire (src/services/memory).
      ...(mode === "e2e"
        ? [
            {
              find: /^@\/services\/firebase\/(.*)$/,
              replacement: path.resolve(__dirname, "./src/services/memory/$1"),
            },
          ]
        : []),
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
}))
