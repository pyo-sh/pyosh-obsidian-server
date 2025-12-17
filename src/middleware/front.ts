import type { Request, Response, NextFunction } from "express";
import { readFileSync, existsSync } from "fs";
import path from "path";
import type { ViteDevServer } from "vite";
import { env } from "@util/env";
import { extractPageName, resolveHtmlPath } from "@util/url";

class ViteService {
  private vite: ViteDevServer | null = null;
  private isInitializing = false;
  private initPromise: Promise<void> | null = null;

  async initialize(): Promise<void> {
    if (this.vite) return;

    if (this.isInitializing && this.initPromise) {
      return this.initPromise;
    }

    this.isInitializing = true;
    this.initPromise = this.createViteServer();

    try {
      await this.initPromise;
    } finally {
      this.isInitializing = false;
      this.initPromise = null;
    }
  }

  getMiddleware() {
    return this.vite?.middlewares;
  }

  async transformHtml(url: string, html: string): Promise<string> {
    if (!this.vite) {
      throw new Error("Vite is not initialized");
    }

    return this.vite.transformIndexHtml(url, html);
  }

  isReady(): boolean {
    return this.vite !== null;
  }

  private async createViteServer(): Promise<void> {
    const { createServer } = await import("vite");
    this.vite = await createServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    console.log("✓ Development: Vite server initialized");
  }
}

const viteService = new ViteService();

export async function viteDevMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await viteService.initialize();
    const middleware = viteService.getMiddleware();

    if (middleware) {
      middleware(req, res, next);
    } else {
      next(new Error("Vite middleware is not available"));
    }
  } catch (error) {
    console.error("Vite middleware error:", error);
    next(error);
  }
}

export async function devHtmlRouter(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await viteService.initialize();

    if (!viteService.isReady()) {
      throw new Error("Vite is not ready");
    }

    const page = extractPageName(req.originalUrl);
    const htmlPath = resolveHtmlPath(
      page,
      path.join(__dirname, "../../front/page"),
    );

    // 파일 존재 여부 확인
    if (!existsSync(htmlPath)) {
      return next();
    }

    const template = readFileSync(htmlPath, "utf-8");
    const transformedHtml = await viteService.transformHtml(
      req.originalUrl,
      template,
    );

    res
      .status(200)
      .set({ "Content-Type": "text/html; charset=utf-8" })
      .send(transformedHtml);
  } catch (error) {
    console.error("Dev HTML router error:", error);
    next(error);
  }
}

export function prodHtmlRouter(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const page = extractPageName(req.originalUrl);
    const htmlPath = resolveHtmlPath(
      page,
      path.join(__dirname, "../public/views"),
    );

    if (!existsSync(htmlPath)) {
      return next();
    }

    res.sendFile(htmlPath, (err) => {
      if (err) {
        console.error("Static HTML serve error:", err);
        next();
      }
    });
  } catch (error) {
    console.error("Prod HTML router error:", error);
    next(error);
  }
}

export function getHtmlRouter() {
  return env.isDev ? devHtmlRouter : prodHtmlRouter;
}

export function createViewMiddleware(paths: string[]) {
  const htmlRouter = getHtmlRouter();

  return {
    paths,
    router: htmlRouter,
    viteMiddleware: env.isDev ? viteDevMiddleware : null,
  };
}
