import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { testConnection } from "./controllers/Test";
import { getAll as BudgetGet } from "./controllers/Budget";
import { getAll as FileResourceGet } from "./controllers/FileResource";

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

expressServer.listen(process.env.SERVER_PORT, () => {
  console.log(
    `Server is running on http://localhost:${process.env.SERVER_PORT}`,
  );
  testConnection(pool);
});
