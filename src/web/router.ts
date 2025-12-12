import { Router } from "express";
import path from "path";

const webRouter = Router();
const viewPath = path.join(__dirname, "../..", "public/views");

/* home page. */
webRouter.get("/", function (req, res) {
  res.sendFile(path.join(viewPath, "index.html"));
});

webRouter.get("/privacy-policy", function (req, res) {
  res.sendFile(path.join(viewPath, "privacy-policy.html"));
});

webRouter.get("/success", function (req, res) {
  res.sendFile(path.join(viewPath, "success.html"));
});

export { webRouter };
