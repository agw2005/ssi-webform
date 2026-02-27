import {
  allFileResources,
  allPeriods,
  basicGet as BudgetGet,
} from "./controllers/Budget.ts";
import { basicGet as FileResourceGet } from "./controllers/FileResource.ts";
import { basicGet as FlowGet } from "./controllers/Flow.ts";
import { basicGet as FormGet } from "./controllers/Form.ts";
import { basicGet as FrmPRDGet } from "./controllers/FrmPRD.ts";
import { basicGet as FrmPRHGet } from "./controllers/FrmPRH.ts";
import {
  allDepartments,
  basicGet as FrmPRNoPRGet,
} from "./controllers/FrmPRNoPR.ts";
import { basicGet as NatureGet } from "./controllers/Nature.ts";
import { basicGet as RateDollarGet } from "./controllers/RateDollar.ts";
import { basicGet as RateDollarTempGet } from "./controllers/RateDollarTemp.ts";
import {
  basicGet as SectionGet,
  sectionNames,
  userSectionMappings,
} from "./controllers/Section.ts";
import { basicGet as TitleGet } from "./controllers/Title.ts";
import { basicGet as TraceGet } from "./controllers/Trace.ts";
import { basicGet as TraceDGet } from "./controllers/TraceD.ts";
import { basicGet as TypeGet } from "./controllers/Type.ts";
import { basicGet as UploadFileGet } from "./controllers/UploadFile.ts";
import {
  authInformation,
  supervisorNames,
  basicGet as UserMasterGet,
} from "./controllers/UserMaster.ts";
import type { RouterContext } from "@oak/oak";
import databasePool from "./dbpool.ts";

export const healthCheck = (ctx: RouterContext<"/">) => {
  ctx.response.status = 200;
  ctx.response.body = "Healthy";
};

export const getBudgetsPaginated = async (
  ctx: RouterContext<"/budget/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await BudgetGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getAllFileResources = async (
  ctx: RouterContext<"/budget/fileresources">,
) => {
  const [rows, _metadata] = await allFileResources(databasePool);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getAllPeriods = async (ctx: RouterContext<"/budget/periods">) => {
  const [rows, _metadata] = await allPeriods(databasePool);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getFileResourcesPaginated = async (
  ctx: RouterContext<"/fileresource/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await FileResourceGet(
    databasePool,
    page,
    pagination,
  );
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getFlowsPaginated = async (
  ctx: RouterContext<"/flow/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await FlowGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getFormsPaginated = async (
  ctx: RouterContext<"/form/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await FormGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getFrmPRDsPaginated = async (
  ctx: RouterContext<"/frmprd/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await FrmPRDGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getFrmPRHsPaginated = async (
  ctx: RouterContext<"/frmprh/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await FrmPRHGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getFrmNoPRsPaginated = async (
  ctx: RouterContext<"/frmprnopr/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await FrmPRNoPRGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getAllDepartments = async (
  ctx: RouterContext<"/frmprnopr/departments">,
) => {
  const [rows, _metadata] = await allDepartments(databasePool);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getNaturesPaginated = async (
  ctx: RouterContext<"/nature/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await NatureGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getRateDollarsPaginated = async (
  ctx: RouterContext<"/ratedollar/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await RateDollarGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getRateDollarTempsPaginated = async (
  ctx: RouterContext<"/ratedollartemp/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await RateDollarTempGet(
    databasePool,
    page,
    pagination,
  );
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getSectionsPaginated = async (
  ctx: RouterContext<"/section/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await SectionGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getSectionNames = async (ctx: RouterContext<"/section/names">) => {
  const [rows, _metadata] = await sectionNames(databasePool);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getSectionUsers = async (ctx: RouterContext<"/section/users">) => {
  const [rows, _metadata] = await userSectionMappings(databasePool);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getTitlesPaginated = async (
  ctx: RouterContext<"/title/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await TitleGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getTracesPaginated = async (
  ctx: RouterContext<"/trace/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await TraceGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getTraceDsPaginated = async (
  ctx: RouterContext<"/traced/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await TraceDGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getTypesPaginated = async (
  ctx: RouterContext<"/type/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await TypeGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getUploadFilesPaginated = async (
  ctx: RouterContext<"/uploadfile/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await UploadFileGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getUserMastersPaginated = async (
  ctx: RouterContext<"/usermaster/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await UserMasterGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getUserAuthInfo = async (
  ctx: RouterContext<"/authInfo/:page">,
) => {
  const pagination = 50;
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await authInformation(
    databasePool,
    page,
    pagination,
  );
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getSupervisorNames = async (
  ctx: RouterContext<"/usermaster/names">,
) => {
  const [rows, _metadata] = await supervisorNames(databasePool);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const authenticate = (ctx: RouterContext<"/auth">) => {
  ctx.response.status = 200;
  ctx.response.body = {
    message: "Authentication success",
    verdict: true,
  };
};
