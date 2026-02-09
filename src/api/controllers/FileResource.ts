import mysql from "mysql2/promise";
import type { FileResourceTable } from "../models/FileResource.d.ts";

export const basicGet = async (
  pool: mysql.Pool,
  page: number,
  pagination: number = 50,
) => {
  const numRows = pagination;
  const [rows, metadata] = await pool.query<FileResourceTable[]>(
    `SELECT * 
    FROM FileResource
    LIMIT ? , ?`,
    [(page - 1) * numRows, numRows],
  );
  return [rows, metadata];
};
