import { Router } from "express";
import { authRouter } from "@src/api/auth";
import { tokenRouter } from "@src/api/token";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/token", tokenRouter);

export { apiRouter };
