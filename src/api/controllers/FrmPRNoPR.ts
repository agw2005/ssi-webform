import mysql from "mysql2/promise";
import type { FrmPRNoPRTable } from "../models/FrmPRNoPR";

export const basicGet = async (
  pool: mysql.Pool,
  page: number,
  pagination: number = 50,
) => {
  const numRows = pagination;
  const [rows, metadata] = await pool.query<FrmPRNoPRTable[]>(
    `SELECT * 
    FROM frm_PR_NoPR
    LIMIT ? , ?`,
    [(page - 1) * numRows, numRows],
  );
  return [rows, metadata];
};
