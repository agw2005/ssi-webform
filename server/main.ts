import { Application, Router } from "@oak/oak";
import {
  authenticate,
  getAllDepartments,
  getAllFileResources,
  getAllPeriods,
  getBudgetsPaginated,
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
  getRequests,
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
  getUploadFilesPaginated,
  getUserAuthInfo,
  getUserMastersPaginated,
  healthCheck,
} from "./routes.ts";
import login from "./auth/main.ts";
import isAuthenticated from "./auth/authMiddleware.ts";
import { handleCors } from "./handleCors.ts";

const oakApp = new Application();
const oakRouter = new Router();

oakRouter.get("/", healthCheck);

// Specific GET
oakRouter.get("/section/names", getSectionNames);
oakRouter.get("/section/users", getSectionUsers);
oakRouter.get("/usermaster/names", getSupervisorNames);
oakRouter.get("/budget/fileresources", getAllFileResources);
oakRouter.get("/budget/periods", getAllPeriods);
oakRouter.get("/budget/nature/:costcenter", getNaturesOfCostCenter);
oakRouter.get("/budget/nature/:costcenter/:periode/:nature", getSingleBalance);
oakRouter.get("/frmprnopr/departments", getAllDepartments);
oakRouter.get("/trace/requests", getRequests);
oakRouter.get("/trace/requests/count", getRequestsCount);
oakRouter.get("/trace/request/:traceId", getSpecificRequest);
oakRouter.get("/frmprd/request/:traceId", getSpecificRequestItems);

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

// Auth
oakRouter.get("/auth", isAuthenticated, authenticate);
oakRouter.get("/authInfo/:page", getUserAuthInfo);
oakRouter.post("/login", login);

oakApp.use(async (ctx, next) => {
  handleCors(ctx);
  await next();
});

oakApp.use(oakRouter.routes());
oakApp.use(oakRouter.allowedMethods());

if (import.meta.main) {
  console.log(`Server is running on http://localhost:8000`);
  await oakApp.listen({ port: 8000 });
}
