import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const express_server = express().use(express.json());
const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const testConnection = async () => {
  try {
    const [results, metadata] = await connection.query("SELECT * FROM test");
    console.log(results);
    console.log(metadata);
  } catch (err) {
    console.log(err);
  }
};

express_server.get("/", (_, res) => {
  res.send("Hello World");
});

express_server.listen(process.env.SERVER_PORT, () => {
  console.log(
    `Server is running on http://localhost:${process.env.SERVER_PORT}`,
  );
  testConnection();
});
