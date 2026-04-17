import { Application, Router } from "@oak/oak";
import * as handlers from "./routes.ts";
import { handleCors } from "./handleCors.ts";
import { verifyJwt } from "./auth/verifyJwt.ts";
import { updateRates } from "./jobs.ts";
import { getLogger } from "@logtape/logtape";
import { loggerDate } from "./helper/loggerDate.ts";

const logger = getLogger("webform-oak-server");

Deno.cron("start-of-each-month", "0 0 1 * *", async () => {
  logger.info(
    `${loggerDate()} : Starting Deno.cron for the start of each month`,
  );

  logger.trace(
    `${loggerDate()} : Started copying RateDollarTemp to RateDollar`,
  );
  await updateRates();
  logger.trace(
    `${loggerDate()} : Finished copying RateDollarTemp to RateDollar`,
  );
});

const oakApp = new Application();

const rootRouter = new Router();
const sectionRouter = new Router();
const userMasterRouter = new Router();
const budgetRouter = new Router();
const frmPrDRouter = new Router();
const traceRouter = new Router();
const uploadFileRouter = new Router();
const traceDRouter = new Router();
const frmPrHRouter = new Router();
const jwtRouter = new Router();
const approverRouter = new Router();
const adminRouter = new Router();

sectionRouter.get("/names", handlers.getSectionNames)
  .get("/users", handlers.getSectionUsers);

userMasterRouter.get("/names", handlers.getSupervisorNames).get(
  "/auth",
  handlers.getAuthInformation,
);

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

frmPrDRouter.get("/request/:traceId", handlers.getSpecificRequestItems);

uploadFileRouter.get("/:traceId", handlers.getUploadFiles);

traceDRouter.get("/:traceId", handlers.getApproverPath);

frmPrHRouter.get("/", handlers.getRequestsAtBudgetView);

jwtRouter.post("/request", handlers.requestJwt).get("/verify", verifyJwt);

approverRouter.patch("/remarks", handlers.patchRemarks)
  .patch("/reject", handlers.patchRejectRequest)
  .patch("/accept", handlers.patchAcceptRequest);

adminRouter
  .get("/template", handlers.getUploadBudgetTemplate)
  .put("/budget", handlers.putBudgets)
  .delete("/:traceId", handlers.deleteRequest)
  .patch("/ratedollartemp", handlers.patchForex);

rootRouter
  .get("/", handlers.healthCheck)
  .post("/submit", handlers.submitRequest)
  .get("/forex", handlers.getForex)
  .get("/forextemp", handlers.getForexTemp);

rootRouter.use(
  "/section",
  sectionRouter.routes(),
  sectionRouter.allowedMethods(),
);
rootRouter.use(
  "/usermaster",
  userMasterRouter.routes(),
  userMasterRouter.allowedMethods(),
);
rootRouter.use("/budget", budgetRouter.routes(), budgetRouter.allowedMethods());
rootRouter.use("/frmprd", frmPrDRouter.routes(), frmPrDRouter.allowedMethods());
rootRouter.use("/trace", traceRouter.routes(), traceRouter.allowedMethods());
rootRouter.use(
  "/uploadfile",
  uploadFileRouter.routes(),
  uploadFileRouter.allowedMethods(),
);
rootRouter.use("/traced", traceDRouter.routes(), traceDRouter.allowedMethods());
rootRouter.use("/frmprh", frmPrHRouter.routes(), frmPrHRouter.allowedMethods());
rootRouter.use("/jwt", jwtRouter.routes(), jwtRouter.allowedMethods());
rootRouter.use(
  "/approve",
  approverRouter.routes(),
  approverRouter.allowedMethods(),
);
rootRouter.use("/admin", adminRouter.routes(), adminRouter.allowedMethods());

oakApp.use(async (ctx, next) => {
  const isPreflight = handleCors(ctx);
  if (isPreflight) return;
  await next();
});

oakApp.use(rootRouter.routes());
oakApp.use(rootRouter.allowedMethods());

if (import.meta.main) {
  logger.info(
    `${loggerDate()} : Server is running on http://${
      Deno.env.get("SERVER_HOST")
    }:${Deno.env.get("SERVER_PORT")}`,
  );
  logger.info(
    `${loggerDate()} : CORS available for client ${Deno.env.get("CLIENT_URL")}`,
  );
  await oakApp.listen({ port: Number(Deno.env.get("SERVER_PORT")) });
}
