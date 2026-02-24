import { Application, Router } from "@oak/oak";
import {
  authenticate,
  getPagedBudgets,
  getPagedFileResources,
  getPagedFlows,
  getPagedForms,
  getPagedFrmNoPRs,
  getPagedFrmPRDs,
  getPagedFrmPRHs,
  getPagedNatures,
  getPagedRateDollars,
  getPagedRateDollarTemps,
  getPagedSections,
  getPagedTitles,
  getPagedTraceDs,
  getPagedTraces,
  getPagedTypes,
  getPagedUploadFiles,
  getPagedUserMasters,
  getUserAuthInfo,
  healthCheck,
} from "./routes.ts";
import login from "./auth/main.ts";
import isAuthenticated from "./auth/authMiddleware.ts";

const oakApp = new Application();
const oakRouter = new Router();

oakRouter.get("/", healthCheck);
oakRouter.get("/budget/:page", getPagedBudgets);
oakRouter.get("/fileresource/:page", getPagedFileResources);
oakRouter.get("/flow/:page", getPagedFlows);
oakRouter.get("/form/:page", getPagedForms);
oakRouter.get("/frmprd/:page", getPagedFrmPRDs);
oakRouter.get("/frmprh/:page", getPagedFrmPRHs);
oakRouter.get("/frmprnopr/:page", getPagedFrmNoPRs);
oakRouter.get("/nature/:page", getPagedNatures);
oakRouter.get("/ratedollar/:page", getPagedRateDollars);
oakRouter.get("/ratedollartemp/:page", getPagedRateDollarTemps);
oakRouter.get("/section/:page", getPagedSections);
oakRouter.get("/title/:page", getPagedTitles);
oakRouter.get("/trace/:page", getPagedTraces);
oakRouter.get("/traced/:page", getPagedTraceDs);
oakRouter.get("/type/:page", getPagedTypes);
oakRouter.get("/uploadfile/:page", getPagedUploadFiles);
oakRouter.get("/usermaster/:page", getPagedUserMasters);
oakRouter.get("/auth", isAuthenticated, authenticate);
oakRouter.get("/authInfo/:page", getUserAuthInfo);

oakRouter.post("/login", login);

oakApp.use(async (ctx, next) => {
  ctx.response.headers.set(
    "Access-Control-Allow-Origin",
    "http://localhost:5173",
  );
  ctx.response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS",
  );
  ctx.response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  ctx.response.headers.set("Access-Control-Max-Age", "86400");

  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = 204;
    return;
  }

  await next();
});

oakApp.use(oakRouter.routes());
oakApp.use(oakRouter.allowedMethods());

if (import.meta.main) {
  console.log(`Server is running on http://localhost:8000`);
  await oakApp.listen({ port: 8000 });
}
