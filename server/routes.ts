import { Router } from "@oak/oak";
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
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import process from "node:process";

dotenv.config();

const oakRouter = new Router();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

oakRouter.get("/", (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = "Healthy";
});

oakRouter.get("/budget/:page", async (ctx) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await BudgetGet(pool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
});

oakRouter.get("/fileresource/:page", async (ctx) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await FileResourceGet(pool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
});

oakRouter.get("/flow/:page", async (ctx) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await FlowGet(pool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
});

oakRouter.get("/form/:page", async (ctx) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await FormGet(pool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
});

oakRouter.get("/frmprd/:page", async (ctx) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await FrmPRDGet(pool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
});

oakRouter.get("/frmprh/:page", async (ctx) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await FrmPRHGet(pool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
});

oakRouter.get("/frmprnopr/:page", async (ctx) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await FrmPRNoPRGet(pool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
});

oakRouter.get("/nature/:page", async (ctx) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await NatureGet(pool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
});

oakRouter.get("/ratedollar/:page", async (ctx) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await RateDollarGet(pool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
});

oakRouter.get("/ratedollartemp/:page", async (ctx) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await RateDollarTempGet(pool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
});

oakRouter.get("/section/:page", async (ctx) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await SectionGet(pool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
});

oakRouter.get("/title/:page", async (ctx) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await TitleGet(pool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
});

oakRouter.get("/trace/:page", async (ctx) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await TraceGet(pool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
});

oakRouter.get("/traced/:page", async (ctx) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await TraceDGet(pool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
});

oakRouter.get("/type/:page", async (ctx) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await TypeGet(pool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
});

oakRouter.get("/uploadfile/:page", async (ctx) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await UploadFileGet(pool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
});

oakRouter.get("/usermaster/:page", async (ctx) => {
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await UserMasterGet(pool, page);
  ctx.response.status = 200;
  ctx.response.body = rows;
});

export default oakRouter;
