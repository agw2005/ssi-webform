import mysql from "mysql2/promise";
import type { RateDollarTempTable } from "../models/RateDollarTemp";

export const basicGet = async (
  pool: mysql.Pool,
  page: number,
  pagination: number = 50,
) => {
  const numRows = pagination;
  const [rows, metadata] = await pool.query<RateDollarTempTable[]>(
    `SELECT * 
    FROM RateDollarTemp
    LIMIT ? , ?`,
    [(page - 1) * numRows, numRows],
  );
  return [rows, metadata];
};
