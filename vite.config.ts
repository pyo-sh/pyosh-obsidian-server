import { defineConfig, loadEnv } from "vite";
import { resolve, join } from "path";
import { fileURLToPath } from "url";
import tsconfigPaths from "vite-tsconfig-paths";

const __dirname = resolve(fileURLToPath(import.meta.url)).replace(
  /\/vite.config.ts$/,
  "",
);
const mode = process.env.NODE_ENV || "development";
const isDev = mode === "development";

export default defineConfig({
  root: "front",
  base: isDev ? "/" : "/views/",
  build: {
    outDir: join(__dirname, "/public/views"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: join(__dirname, "/front/page/index.html"),
        "privacy-policy": join(__dirname, "/front/page/privacy-policy.html"),
      },
      output: {
        entryFileNames: "js/[name].bundle.js",
        chunkFileNames: "js/[name].[hash].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) {
            return "css/[name].bundle.[ext]";
          }
          return "assets/[name].[hash][ext]";
        },
      },
    },
  },
  plugins: [
    tsconfigPaths({
      root: join(__dirname, "/front"),
    }),
  ],
});
