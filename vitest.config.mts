// vitest.config.mts
// Configuration des tests unitaires (Vitest).
// .mts = TypeScript au format "module" (import/export), exigé par Vitest.

import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Même raccourci que dans tsconfig.json : "@/lib/…" = "<racine du projet>/lib/…".
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    // Nos tests portent sur de la logique pure (pas d'affichage) : Node suffit,
    // pas besoin de simuler un navigateur.
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
