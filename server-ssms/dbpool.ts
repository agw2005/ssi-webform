import ssms from "mssql";

const config: ssms.config = {
  server: Deno.env.get("DB_HOST") || "127.0.0.1",
  port: Number(Deno.env.get("DB_PORT")),
  user: Deno.env.get("DB_USER"),
  password: Deno.env.get("DB_PASSWORD"),
  database: Deno.env.get("DB_NAME"),
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const databasePool = await new ssms.ConnectionPool(config).connect();

export default databasePool;
