import mysql from "mysql2/promise";
import type { TraceTable } from "../models/Trace";

export const basicGet = async (
  pool: mysql.Pool,
  page: number,
  pagination: number = 50,
) => {
  const numRows = pagination;
  const [rows, metadata] = await pool.query<TraceTable[]>(
    `SELECT * 
    FROM Trace
    LIMIT ? , ?`,
    [(page - 1) * numRows, numRows],
  );
  return [rows, metadata];
};
