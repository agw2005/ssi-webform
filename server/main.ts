import { Application, Router } from "@oak/oak";
import * as handlers from "./routes.ts";
import { handleCors } from "./handleCors.ts";
import { verifyJwt } from "./auth/verifyJwt.ts";
import { updateRates } from "./jobs.ts";
import { getLogger } from "@logtape/logtape";
import { loggerDate } from "./helper/loggerDate.ts";
import { setupLogger } from "./logger.ts";

await setupLogger();
const logger = getLogger("webform-oak-server");

Deno.cron("start-of-each-month", "0 17 1 * *", async () => {
  logger.info(
    `${loggerDate()} : Starting Deno.cron for the "start-of-each-month"`,
  );

  logger.trace(
    `${loggerDate()} : Started copying RateDollarTemp to RateDollar`,
  );
  await updateRates();
  logger.trace(
    `${loggerDate()} : Finished copying RateDollarTemp to RateDollar`,
  );
});

Deno.cron("everyday", "0 17 * * *", async () => {
  logger.info(
    `${loggerDate()} : Starting Deno.cron for "everyday"`,
  );

  logger.trace(
    `${loggerDate()} : Started truncating file "server.log"`,
  );
  const logSize = (await Deno.stat(`${Deno.cwd()}/logs/server.log`)).size;
  await Deno.truncate(`${Deno.cwd()}/logs/server.log`);
  logger.trace(
    `${loggerDate()} : Finished truncating file "server.log" (size: ${logSize} bytes)`,
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

sectionRouter
  .get("/names", handlers.getSectionNames)
  .get("/users", handlers.getSectionUsers);

userMasterRouter
  .get("/names", handlers.getSupervisorNames)
  .get("/auth", handlers.getAuthInformation)
  .get("/:nrp", handlers.getUserByNRP);

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

frmPrDRouter
  .get("/request/:traceId", handlers.getSpecificRequestItems);

uploadFileRouter
  .get("/:traceId", handlers.getUploadFiles);

traceDRouter
  .get("/:traceId", handlers.getApproverPath);

frmPrHRouter
  .get("/", handlers.getRequestsAtBudgetView);

jwtRouter
  .post("/request", handlers.requestJwt).get("/verify", verifyJwt);

approverRouter
  .patch("/remarks", handlers.patchRemarks)
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

rootRouter
  .use("/section", sectionRouter.routes(), sectionRouter.allowedMethods())
  .use(
    "/usermaster",
    userMasterRouter.routes(),
    userMasterRouter.allowedMethods(),
  )
  .use("/budget", budgetRouter.routes(), budgetRouter.allowedMethods())
  .use("/frmprd", frmPrDRouter.routes(), frmPrDRouter.allowedMethods())
  .use("/trace", traceRouter.routes(), traceRouter.allowedMethods())
  .use(
    "/uploadfile",
    uploadFileRouter.routes(),
    uploadFileRouter.allowedMethods(),
  )
  .use("/traced", traceDRouter.routes(), traceDRouter.allowedMethods())
  .use("/frmprh", frmPrHRouter.routes(), frmPrHRouter.allowedMethods())
  .use("/jwt", jwtRouter.routes(), jwtRouter.allowedMethods())
  .use("/approve", approverRouter.routes(), approverRouter.allowedMethods())
  .use("/admin", adminRouter.routes(), adminRouter.allowedMethods());

oakApp
  .use(async (ctx, next) => {
    const isPreflight = handleCors(ctx);
    if (isPreflight) return;
    await next();
  })
  .use(rootRouter.routes())
  .use(rootRouter.allowedMethods());

if (import.meta.main) {
  logger.info(
    `Server is running on http://${Deno.env.get("SERVER_HOST")}:${
      Deno.env.get("SERVER_PORT")
    }`,
  );
  logger.info(
    `CORS available for client ${Deno.env.get("CLIENT_URL")}`,
  );
  await oakApp.listen({ port: Number(Deno.env.get("SERVER_PORT")) });
}
