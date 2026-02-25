import { Application, Router } from "@oak/oak";
import {
  authenticate,
  getBudgetsPaginated,
  getFileResourcesPaginated,
  getFlowsPaginated,
  getFormsPaginated,
  getFrmNoPRsPaginated,
  getFrmPRDsPaginated,
  getFrmPRHsPaginated,
  getNaturesPaginated,
  getRateDollarsPaginated,
  getRateDollarTempsPaginated,
  getSectionsPaginated,
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

const oakApp = new Application();
const oakRouter = new Router();

oakRouter.get("/", healthCheck);

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
