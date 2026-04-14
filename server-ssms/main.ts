import { Application, Router } from "@oak/oak";
import * as handlers from "./routes.ts";
import { handleCors } from "./handleCors.ts";
import { verifyJwt } from "./auth/verifyJwt.ts";

const oakApp = new Application();

const rootRouter = new Router();
const budgetRouter = new Router();
const traceRouter = new Router();
const adminRouter = new Router();

budgetRouter
  .get("/fileresources", handlers.getAllFileResources)
  .get("/years", handlers.getAvailableBudgetYears)
  .get("/periods", handlers.getAvailableBudgetPeriods)
  .get("/nature", handlers.getAllValidNatures)
  .get("/balance", handlers.getSingleBalance)
  .get("/", handlers.getBudgetViewInformation)
  .get("/report", handlers.getReportViewInformation)
  .get("/departments", handlers.getAllValidDepartments)
  .get("/costcenters", handlers.getAllValidCostCenters);

traceRouter
  .get("/requests", handlers.getRequests)
  .get("/requests/count", handlers.getRequestsCount)
  .get("/request/:traceId", handlers.getSpecificRequest)
  .get("/approve", handlers.getRequestsBySupervisorNrp)
  .get("/approve/count", handlers.getRequestsBySupervisorNrpCount);

adminRouter.get("/jwt/verify", verifyJwt)
  .put("/budget", handlers.putBudgets)
  .delete("/:traceId", handlers.deleteRequest);

rootRouter.get("/", handlers.healthCheck);
rootRouter.use("/budget", budgetRouter.routes(), budgetRouter.allowedMethods());
rootRouter.use("/trace", traceRouter.routes(), traceRouter.allowedMethods());
rootRouter.use("/admin", adminRouter.routes(), adminRouter.allowedMethods());

oakApp.use(async (ctx, next) => {
  handleCors(ctx);
  await next();
});

oakApp.use(rootRouter.routes());
oakApp.use(rootRouter.allowedMethods());

if (import.meta.main) {
  console.log(
    `Server is running on http://${Deno.env.get("SERVER_HOST")}:${
      Deno.env.get("SERVER_PORT")
    }`,
  );
  console.log(
    `CORS available for client ${Deno.env.get("CLIENT_URL")}`,
  );
  await oakApp.listen({ port: Number(Deno.env.get("SERVER_PORT")) });
}
