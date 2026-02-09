import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import type { TestTable } from "./models/Test";

dotenv.config();

const expressServer = express().use(express.json());
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const testConnection = async () => {
  const [rows, _] = await pool.query<TestTable[]>("SELECT * FROM test");
  console.log(rows[0].first_word + " " + rows[0].second_word);
};

expressServer.get("/", async (_, res) => {
  res.status(200).send("Healthy");
});

expressServer.listen(process.env.SERVER_PORT, () => {
  console.log(
    `Server is running on http://localhost:${process.env.SERVER_PORT}`,
  );
  testConnection();
});
