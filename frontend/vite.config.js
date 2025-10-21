import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Dev-only: keep COEP disabled by default; set VITE_ENABLE_COEP=1 to re-enable
  const enableCoep = env.VITE_ENABLE_COEP === "1";

  return {
    plugins: [react(), tailwindcss()],
    server: {
      headers: enableCoep
        ? {
            "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
            "Cross-Origin-Embedder-Policy": "require-corp",
          }
        : undefined,
    },
    define: {
      // Fix for SockJS: Define global variable for browser environment
      global: 'globalThis',
    },
  };
});
