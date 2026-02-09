import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { testConnection } from "./controllers/Test.ts";
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
import process from "node:process";

dotenv.config();

const expressServer = express().use(express.json());
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

expressServer.get("/", (_, res) => {
  res.status(200).send("Healthy");
});

expressServer.get("/budget/:page", async (req, res) => {
  const page = Number(req.params.page);
  const [rows, __] = await BudgetGet(pool, page);
  res.status(200).send(rows);
});

expressServer.get("/fileresource/:page", async (req, res) => {
  const page = Number(req.params.page);
  const [rows, __] = await FileResourceGet(pool, page);
  res.status(200).send(rows);
});

expressServer.get("/flow/:page", async (req, res) => {
  const page = Number(req.params.page);
  const [rows, __] = await FlowGet(pool, page);
  res.status(200).send(rows);
});

expressServer.get("/form/:page", async (req, res) => {
  const page = Number(req.params.page);
  const [rows, __] = await FormGet(pool, page);
  res.status(200).send(rows);
});

expressServer.get("/frmprd/:page", async (req, res) => {
  const page = Number(req.params.page);
  const [rows, __] = await FrmPRDGet(pool, page);
  res.status(200).send(rows);
});

expressServer.get("/frmprh/:page", async (req, res) => {
  const page = Number(req.params.page);
  const [rows, __] = await FrmPRHGet(pool, page);
  res.status(200).send(rows);
});

expressServer.get("/frmprnopr/:page", async (req, res) => {
  const page = Number(req.params.page);
  const [rows, __] = await FrmPRNoPRGet(pool, page);
  res.status(200).send(rows);
});

expressServer.get("/nature/:page", async (req, res) => {
  const page = Number(req.params.page);
  const [rows, __] = await NatureGet(pool, page);
  res.status(200).send(rows);
});

expressServer.get("/ratedollar/:page", async (req, res) => {
  const page = Number(req.params.page);
  const [rows, __] = await RateDollarGet(pool, page);
  res.status(200).send(rows);
});

expressServer.get("/ratedollartemp/:page", async (req, res) => {
  const page = Number(req.params.page);
  const [rows, __] = await RateDollarTempGet(pool, page);
  res.status(200).send(rows);
});

expressServer.get("/section/:page", async (req, res) => {
  const page = Number(req.params.page);
  const [rows, __] = await SectionGet(pool, page);
  res.status(200).send(rows);
});

expressServer.get("/title/:page", async (req, res) => {
  const page = Number(req.params.page);
  const [rows, __] = await TitleGet(pool, page);
  res.status(200).send(rows);
});

expressServer.get("/trace/:page", async (req, res) => {
  const page = Number(req.params.page);
  const [rows, __] = await TraceGet(pool, page);
  res.status(200).send(rows);
});

expressServer.get("/traced/:page", async (req, res) => {
  const page = Number(req.params.page);
  const [rows, __] = await TraceDGet(pool, page);
  res.status(200).send(rows);
});

expressServer.get("/type/:page", async (req, res) => {
  const page = Number(req.params.page);
  const [rows, __] = await TypeGet(pool, page);
  res.status(200).send(rows);
});

expressServer.get("/uploadfile/:page", async (req, res) => {
  const page = Number(req.params.page);
  const [rows, __] = await UploadFileGet(pool, page);
  res.status(200).send(rows);
});

expressServer.get("/usermaster/:page", async (req, res) => {
  const page = Number(req.params.page);
  const [rows, __] = await UserMasterGet(pool, page);
  res.status(200).send(rows);
});

expressServer.listen(process.env.SERVER_PORT, () => {
  console.log(
    `Server is running on http://localhost:${process.env.SERVER_PORT}`,
  );
  testConnection(pool);
});
