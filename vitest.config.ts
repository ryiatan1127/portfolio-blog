import { fileURLToPath } from "url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
  test: { environment: "jsdom", setupFiles: ["./vitest.setup.ts"], include: ["**/*.test.{ts,tsx}"] },
});
