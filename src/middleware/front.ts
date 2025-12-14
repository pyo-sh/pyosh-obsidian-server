import type { Request, Response, NextFunction } from "express";
import path from "path";

let viteMiddleware:
  | ((req: Request, res: Response, next: NextFunction) => void)
  | null = null;

async function initVite() {
  if (viteMiddleware) return;

  const { createServer } = await import("vite");
  const vite = await createServer({
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
    const page = req.params.page ?? "index";
    /**
     * / → front/page/index.html
     * /others → front/page/others.html
     */
    const filePath = path.posix.join("page", `${page}.html`);

    // Vite dev server middleware will handle the request
    req.url = `/${filePath}`;
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
  const page = req.params.page ?? "index";
  const filePath = path.join(__dirname, "../public/views", `${page}.html`);

  res.sendFile(filePath, (err) => {
    if (err) next();
  });
};
