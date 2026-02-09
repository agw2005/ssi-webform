import mysql from "mysql2/promise";
import type { FrmPRHTable } from "../models/FrmPRH.d.ts";

export const basicGet = async (
  pool: mysql.Pool,
  page: number,
  pagination: number = 50,
) => {
  const numRows = pagination;
  const [rows, metadata] = await pool.query<FrmPRHTable[]>(
    `SELECT * 
    FROM frm_PR_H
    LIMIT ? , ?`,
    [(page - 1) * numRows, numRows],
  );
  return [rows, metadata];
};
