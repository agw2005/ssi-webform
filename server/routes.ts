import { basicGet as BudgetGet } from "./controllers/Budget.ts";
import { basicGet as FileResourceGet } from "./controllers/FileResource.ts";
import { basicGet as FlowGet } from "./controllers/Flow.ts";
import { basicGet as FormGet } from "./controllers/Form.ts";
import { basicGet as FrmPRDGet } from "./controllers/FrmPRD.ts";
import { basicGet as FrmPRHGet } from "./controllers/FrmPRH.ts";
import { basicGet as FrmPRNoPRGet } from "./controllers/FrmPRNoPR.ts";
import { basicGet as NatureGet } from "./controllers/Nature.ts";
import { basicGet as RateDollarGet } from "./controllers/RateDollar.ts";
import { basicGet as RateDollarTempGet } from "./controllers/RateDollarTemp.ts";
import { basicGet as SectionGet } from "./controllers/Section.ts";
import { basicGet as TitleGet } from "./controllers/Title.ts";
import { basicGet as TraceGet } from "./controllers/Trace.ts";
import { basicGet as TraceDGet } from "./controllers/TraceD.ts";
import { basicGet as TypeGet } from "./controllers/Type.ts";
import { basicGet as UploadFileGet } from "./controllers/UploadFile.ts";
import { basicGet as UserMasterGet } from "./controllers/UserMaster.ts";
import type { RouterContext } from "@oak/oak";
import databasePool from "./dbpool.ts";

export const healthCheck = (ctx: RouterContext<"/">) => {
  ctx.response.status = 200;
  ctx.response.body = "Healthy";
};

export const getPagedBudgets = async (ctx: RouterContext<"/budget/:page">) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await BudgetGet(databasePool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getPagedFileResources = async (
  ctx: RouterContext<"/fileresource/:page">,
) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await FileResourceGet(databasePool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getPagedFlows = async (ctx: RouterContext<"/flow/:page">) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await FlowGet(databasePool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getPagedForms = async (ctx: RouterContext<"/form/:page">) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await FormGet(databasePool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getPagedFrmPRDs = async (ctx: RouterContext<"/frmprd/:page">) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await FrmPRDGet(databasePool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getPagedFrmPRHs = async (ctx: RouterContext<"/frmprh/:page">) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await FrmPRHGet(databasePool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getPagedFrmNoPRs = async (
  ctx: RouterContext<"/frmprnopr/:page">,
) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await FrmPRNoPRGet(databasePool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getPagedNatures = async (ctx: RouterContext<"/nature/:page">) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await NatureGet(databasePool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getPagedRateDollars = async (
  ctx: RouterContext<"/ratedollar/:page">,
) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await RateDollarGet(databasePool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getPagedRateDollarTemps = async (
  ctx: RouterContext<"/ratedollartemp/:page">,
) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await RateDollarTempGet(databasePool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getPagedSections = async (
  ctx: RouterContext<"/section/:page">,
) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await SectionGet(databasePool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getPagedTitles = async (ctx: RouterContext<"/title/:page">) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await TitleGet(databasePool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getPagedTraces = async (ctx: RouterContext<"/trace/:page">) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await TraceGet(databasePool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getPagedTraceDs = async (ctx: RouterContext<"/traced/:page">) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await TraceDGet(databasePool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getPagedTypes = async (ctx: RouterContext<"/type/:page">) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await TypeGet(databasePool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getPagedUploadFiles = async (
  ctx: RouterContext<"/uploadfile/:page">,
) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await UploadFileGet(databasePool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getPagedUserMasters = async (
  ctx: RouterContext<"/usermaster/:page">,
) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await UserMasterGet(databasePool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
};
