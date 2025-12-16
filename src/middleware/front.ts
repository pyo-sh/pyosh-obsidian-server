import type { Request, Response, NextFunction } from "express";
import { readFileSync } from "fs";
import path from "path";
import type { ViteDevServer } from "vite";

let vite: ViteDevServer | null = null;
let viteMiddleware:
  | ((req: Request, res: Response, next: NextFunction) => void)
  | null = null;

async function initVite() {
  if (viteMiddleware) return;

  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
  });
  console.log("Development: Vite server ON!");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  viteMiddleware = vite.middlewares as any;
}
initVite();

export async function frontMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  await initVite();

  if (viteMiddleware) {
    viteMiddleware(req, res, next);
  } else {
    next(new Error("Vite middleware is not initialized."));
  }
}

export const frontRouter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const url = req.originalUrl;
    const page = url === "/" ? "index" : url.slice(1);
    /**
     * / → front/page/index.html
     * /others → front/page/others.html
     */
    const filePath = path.posix.join(
      __dirname,
      "../../front/page",
      `${page}.html`,
    );

    if (vite) {
      let template = readFileSync(filePath, {
        encoding: "utf-8",
      });
      template = await vite.transformIndexHtml(req.originalUrl, template);

      return res
        .status(200)
        .set({ "Content-Type": "text/html" })
        .send(template);
    }
    next(new Error("Vite middleware is not initialized."));

    next();
  } catch (e) {
    next(e);
  }
};

export const viewRouter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const url = req.originalUrl;
  const page = url === "/" ? "index" : url.slice(1);
  const filePath = path.join(__dirname, "../public/views", `${page}.html`);

  res.sendFile(filePath, (err) => {
    if (err) next();
  });
};
