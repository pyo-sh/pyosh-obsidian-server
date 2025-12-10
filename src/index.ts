import express, { Request, Response } from "express";
import { env } from "@util/env";
import { app } from "@src/server";

app.listen(env.PORT, env.HOST, () => {
  console.log(`Server started on ${env.HOST}:${env.PORT}`);
});
