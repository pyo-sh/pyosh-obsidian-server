import { app } from "@src/server";
import { env } from "@util/env";

app.listen(env.PORT, env.HOST, () => {
  console.log(`Server started on ${env.HOST}:${env.PORT}`);
});
