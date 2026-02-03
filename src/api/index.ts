import express from "express";
import mysql from "mysql2/promise";

const server = express();
const connection = await mysql.createConnection({
  host: "localhost",
  port: 3333,
  user: "root",
  password: "u101",
  database: "dev",
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

server.get("/", (_, res) => {
  res.send("Hello World");
});

server.listen(3067, () => {
  console.log("Server is running on http://localhost:3067");
  testConnection();
});
