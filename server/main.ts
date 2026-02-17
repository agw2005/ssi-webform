import { Application } from "@oak/oak";
import oakRouter from "./routes.ts";

const oakApp = new Application();

oakApp.use(oakRouter.routes());
oakApp.use(oakRouter.allowedMethods());

if (import.meta.main) {
  console.log(`Server is running on http://localhost:8000`);
  await oakApp.listen({ port: 8000 });
}
