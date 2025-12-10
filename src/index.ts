import express, { Request, Response } from "express";
import { env } from "@util/env";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(env.PORT, () => {
  console.log(`Server started on ${env.HOST}:${env.PORT}`);
});
