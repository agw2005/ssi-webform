import { Application, Router } from "@oak/oak";
import {
  getAllDepartments,
  getAllFileResources,
  getAllPeriods,
  getApproverPath,
  getAuthInformation,
  getBudgetsPaginated,
  getBudgetViewInformation,
  getFileResourcesPaginated,
  getFlowsPaginated,
  getFormsPaginated,
  getFrmNoPRsPaginated,
  getFrmPRDsPaginated,
  getFrmPRHsPaginated,
  getNaturesOfCostCenter,
  getNaturesPaginated,
  getRateDollarsPaginated,
  getRateDollarTempsPaginated,
  getReportViewInformation,
  getRequests,
  getRequestsAtBudgetView,
  getRequestsBySupervisorNrp,
  getRequestsBySupervisorNrpCount,
  getRequestsCount,
  getSectionNames,
  getSectionsPaginated,
  getSectionUsers,
  getSingleBalance,
  getSpecificRequest,
  getSpecificRequestItems,
  getSupervisorNames,
  getTitlesPaginated,
  getTraceDsPaginated,
  getTracesPaginated,
  getTypesPaginated,
  getUploadFiles,
  getUploadFilesPaginated,
  getUserMastersPaginated,
  healthCheck,
  patchRejectRequest,
  patchAcceptRequest,
  patchRemarks,
  requestJwt,
  submitRequest,
} from "./routes.ts";
import { handleCors } from "./handleCors.ts";
import { verifyJwt } from "./auth/verifyJwt.ts";

const oakApp = new Application();
const oakRouter = new Router();

oakApp.use(async (ctx, next) => {
  handleCors(ctx);
  await next();
});

oakRouter.get("/", healthCheck);

// Specific GET
oakRouter.get("/section/names", getSectionNames);
oakRouter.get("/section/users", getSectionUsers);

oakRouter.get("/usermaster/names", getSupervisorNames);

oakRouter.get("/budget/fileresources", getAllFileResources);
oakRouter.get("/budget/periods", getAllPeriods);
oakRouter.get("/budget/nature/:costcenter", getNaturesOfCostCenter);
oakRouter.get("/budget/nature/:costcenter/:periode/:nature", getSingleBalance);
oakRouter.get("/budget", getBudgetViewInformation);
oakRouter.get("/budget/report", getReportViewInformation);

oakRouter.get("/frmprnopr/departments", getAllDepartments);

oakRouter.get("/trace/requests", getRequests);
oakRouter.get("/trace/requests/count", getRequestsCount);
oakRouter.get("/trace/request/:traceId", getSpecificRequest);
oakRouter.get("/trace/approve", getRequestsBySupervisorNrp);
oakRouter.get("/trace/approve/count", getRequestsBySupervisorNrpCount);

oakRouter.get("/frmprd/request/:traceId", getSpecificRequestItems);

oakRouter.get("/uploadfile/:traceId", getUploadFiles);

oakRouter.get("/traced/:traceId", getApproverPath);

oakRouter.get("/frmprh", getRequestsAtBudgetView);

// Submit request
oakRouter.post("/submit", submitRequest);

// Auth
oakRouter.get("/usermaster/auth", getAuthInformation);
oakRouter.post("/jwt/request", requestJwt);
oakRouter.get("/jwt/verify", verifyJwt);

// Limited access
oakRouter.patch("/approve/remarks", patchRemarks);
oakRouter.patch("/approve/reject", patchRejectRequest);
oakRouter.patch("/approve/accept", patchAcceptRequest);

// Basic GET
oakRouter.get("/budget/:pagination/:page", getBudgetsPaginated);
oakRouter.get("/fileresource/:pagination/:page", getFileResourcesPaginated);
oakRouter.get("/flow/:pagination/:page", getFlowsPaginated);
oakRouter.get("/form/:pagination/:page", getFormsPaginated);
oakRouter.get("/frmprd/:pagination/:page", getFrmPRDsPaginated);
oakRouter.get("/frmprh/:pagination/:page", getFrmPRHsPaginated);
oakRouter.get("/frmprnopr/:pagination/:page", getFrmNoPRsPaginated);
oakRouter.get("/nature/:pagination/:page", getNaturesPaginated);
oakRouter.get("/ratedollar/:pagination/:page", getRateDollarsPaginated);
oakRouter.get("/ratedollartemp/:pagination/:page", getRateDollarTempsPaginated);
oakRouter.get("/section/:pagination/:page", getSectionsPaginated);
oakRouter.get("/title/:pagination/:page", getTitlesPaginated);
oakRouter.get("/trace/:pagination/:page", getTracesPaginated);
oakRouter.get("/traced/:pagination/:page", getTraceDsPaginated);
oakRouter.get("/type/:pagination/:page", getTypesPaginated);
oakRouter.get("/uploadfile/:pagination/:page", getUploadFilesPaginated);
oakRouter.get("/usermaster/:pagination/:page", getUserMastersPaginated);

oakApp.use(oakRouter.routes());
oakApp.use(oakRouter.allowedMethods());

if (import.meta.main) {
  console.log(
    `Server is running on http://${Deno.env.get("SERVER_HOST")}:${Deno.env.get("SERVER_PORT")}`,
  );
  console.log(
    `CORS available for client http://${Deno.env.get("CLIENT_HOST")}:${Deno.env.get("CLIENT_PORT")}`,
  );
  await oakApp.listen({ port: Number(Deno.env.get("SERVER_PORT")) });
}
