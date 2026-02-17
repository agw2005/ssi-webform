import type mysql from "mysql2/promise";
import type { TraceDTable } from "../models/TraceD.d.ts";

export const basicGet = async (
  pool: mysql.Pool,
  page: number,
  pagination: number = 50,
) => {
  const numRows = pagination;
  const [rows, metadata] = await pool.query<TraceDTable[]>(
    `SELECT * 
    FROM Trace_D
    LIMIT ? , ?`,
    [(page - 1) * numRows, numRows],
  );
  return [rows, metadata];
};
