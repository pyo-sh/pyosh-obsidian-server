import { Router } from "express";
import { authRouter } from "@src/api/auth";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);

export { apiRouter };
