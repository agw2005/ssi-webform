import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { testConnection } from "./controllers/Test";
import { basicGet as BudgetGet } from "./controllers/Budget";
import { basicGet as FileResourceGet } from "./controllers/FileResource";
import { basicGet as FlowGet } from "./controllers/Flow";
import { basicGet as FormGet } from "./controllers/Form";
import { basicGet as FrmPRDGet } from "./controllers/FrmPRD";
import { basicGet as FrmPRHGet } from "./controllers/FrmPRH";
import { basicGet as FrmPRNoPRGet } from "./controllers/FrmPRNoPR";
import { basicGet as NatureGet } from "./controllers/Nature";

dotenv.config();

const expressServer = express().use(express.json());
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

expressServer.get("/", async (_, res) => {
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

expressServer.listen(process.env.SERVER_PORT, () => {
  console.log(
    `Server is running on http://localhost:${process.env.SERVER_PORT}`,
  );
  testConnection(pool);
});
