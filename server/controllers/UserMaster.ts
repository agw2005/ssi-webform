import type mysql from "mysql2/promise";
import type { UserMasterTable } from "../models/UserMaster.d.ts";

export const basicGet = async (
  pool: mysql.Pool,
  page: number,
  pagination: number = 50,
) => {
  const numRows = pagination;
  const [rows, metadata] = await pool.query<UserMasterTable[]>(
    `SELECT * 
    FROM UserMaster
    LIMIT ? , ?`,
    [(page - 1) * numRows, numRows],
  );
  return [rows, metadata];
};
