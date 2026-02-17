import type mysql from "mysql2/promise";
import type { FrmPRDTable } from "../models/FrmPRD.d.ts";

export const basicGet = async (
  pool: mysql.Pool,
  page: number,
  pagination: number = 50,
) => {
  const numRows = pagination;
  const [rows, metadata] = await pool.query<FrmPRDTable[]>(
    `SELECT * 
    FROM frm_PR_D
    LIMIT ? , ?`,
    [(page - 1) * numRows, numRows],
  );
  return [rows, metadata];
};
