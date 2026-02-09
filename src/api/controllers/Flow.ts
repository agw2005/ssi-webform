import mysql from "mysql2/promise";
import type { FlowTable } from "../models/Flow";

export const basicGet = async (
  pool: mysql.Pool,
  page: number,
  pagination: number = 50,
) => {
  const numRows = pagination;
  const [rows, metadata] = await pool.query<FlowTable[]>(
    `SELECT * 
    FROM Flow
    LIMIT ? , ?`,
    [(page - 1) * numRows, numRows],
  );
  return [rows, metadata];
};
