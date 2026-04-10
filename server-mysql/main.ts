import { Application, Router } from "@oak/oak";
import {
  deleteRequest,
  getAllFileResources,
  getAllValidCostCenters,
  getAllValidDepartments,
  getAllValidNatures,
  getApproverPath,
  getAuthInformation,
  getAvailableBudgetPeriods,
  getAvailableBudgetYears,
  getBudgetViewInformation,
  getReportViewInformation,
  getRequests,
  getRequestsAtBudgetView,
  getRequestsBySupervisorNrp,
  getRequestsBySupervisorNrpCount,
  getRequestsCount,
  getSectionNames,
  getSectionUsers,
  getSingleBalance,
  getSpecificRequest,
  getSpecificRequestItems,
  getSupervisorNames,
  getUploadFiles,
  healthCheck,
  patchAcceptRequest,
  patchRejectRequest,
  patchRemarks,
  putBudgets,
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
oakRouter.get("/budget/years", getAvailableBudgetYears);
oakRouter.get("/budget/periods", getAvailableBudgetPeriods);
oakRouter.get("/budget/nature", getAllValidNatures);
oakRouter.get("/budget/balance", getSingleBalance);
oakRouter.get("/budget", getBudgetViewInformation);
oakRouter.get("/budget/report", getReportViewInformation);
oakRouter.get("/budget/departments", getAllValidDepartments);
oakRouter.get("/budget/costcenters", getAllValidCostCenters);
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
oakRouter.put("/admin/budget", putBudgets);
oakRouter.delete("/admin/:traceId", deleteRequest);

// Rest of the code
oakApp.use(oakRouter.routes());
oakApp.use(oakRouter.allowedMethods());

if (import.meta.main) {
  console.log(
    `Server is running on http://${Deno.env.get("SERVER_HOST")}:${
      Deno.env.get("SERVER_PORT")
    }`,
  );
  console.log(
    `CORS available for client http://${Deno.env.get("CLIENT_HOST")}:${
      Deno.env.get("CLIENT_PORT")
    }`,
  );
  await oakApp.listen({ port: Number(Deno.env.get("SERVER_PORT")) });
}
