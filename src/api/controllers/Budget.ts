import mysql from "mysql2/promise";
import type { BudgetTable } from "../models/Budget";

export const getAll = async (
  pool: mysql.Pool,
  page: number,
  pagination: number = 50,
) => {
  const numRows = pagination;
  const [rows, metadata] = await pool.query<BudgetTable[]>(
    `SELECT * 
    FROM Budget
    LIMIT ? , ?`,
    [(page - 1) * numRows, numRows],
  );
  return [rows, metadata];
};
