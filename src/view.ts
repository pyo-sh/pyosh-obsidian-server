import { Router } from "express";
import path from "path";

const viewRouter = Router();
const viewPath = path.join(__dirname, "../..", "public/views");

/* home page. */
viewRouter.get("/", function (req, res) {
  res.sendFile(path.join(viewPath, "index.html"));
});

viewRouter.get("/privacy-policy", function (req, res) {
  res.sendFile(path.join(viewPath, "privacy-policy.html"));
});

viewRouter.get("/success", function (req, res) {
  res.sendFile(path.join(viewPath, "success.html"));
});

export { viewRouter };
