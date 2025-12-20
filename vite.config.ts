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
const inputPath = join(__dirname, "/front/page");

export default defineConfig({
  root: "front",
  base: isDev ? "/" : "/views/",
  build: {
    outDir: join(__dirname, "/public/views"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: join(inputPath, "/index.html"),
        dashboard: join(inputPath, "/dashboard.html"),
        "privacy-policy": join(inputPath, "/privacy-policy.html"),
        "terms-of-service": join(inputPath, "/terms-of-service.html"),
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
