import path from "path";

export function extractPageName(url: string): string {
  try {
    const urlObj = new URL(url, "http://localhost");
    const pathname = urlObj.pathname.slice(1) || "index";

    return pathname.replace(/\.\./g, "").replace(/[^a-zA-Z0-9-_/]/g, "");
  } catch {
    return "index";
  }
}

export function resolveHtmlPath(page: string, baseDir: string): string {
  return path.join(baseDir, `${page}.html`);
}
