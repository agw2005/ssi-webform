import { Application, Router } from "@oak/oak";
import {
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
  healthCheck,
} from "./routes.ts";

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

oakApp.use(oakRouter.routes());
oakApp.use(oakRouter.allowedMethods());

if (import.meta.main) {
  console.log(`Server is running on http://localhost:8000`);
  await oakApp.listen({ port: 8000 });
}
