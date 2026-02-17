import type mysql from "mysql2/promise";
import type { RateDollarTable } from "../models/RateDollar.d.ts";

export const basicGet = async (
  pool: mysql.Pool,
  page: number,
  pagination: number = 50,
) => {
  const numRows = pagination;
  const [rows, metadata] = await pool.query<RateDollarTable[]>(
    `SELECT * 
    FROM RateDollar
    LIMIT ? , ?`,
    [(page - 1) * numRows, numRows],
  );
  return [rows, metadata];
};
