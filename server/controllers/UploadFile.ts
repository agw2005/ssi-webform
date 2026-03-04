import type mysql from "mysql2/promise";
import type {
  UploadFileMinimalInformation,
  UploadFileTable,
} from "../models/UploadFile.d.ts";

export const basicGet = async (
  pool: mysql.Pool,
  page: number,
  pagination: number = 50,
) => {
  const numRows = pagination;
  const [rows, metadata] = await pool.query<UploadFileTable[]>(
    `SELECT * 
    FROM UploadFile
    LIMIT ? , ?`,
    [(page - 1) * numRows, numRows],
  );
  return [rows, metadata];
};

export const getMinimumFileInformation = async (
  pool: mysql.Pool,
  TraceId: string,
) => {
  const [rows, metadata] = await pool.query<UploadFileMinimalInformation[]>(
    `SELECT Filename,DateUpload
    FROM UploadFile
    INNER JOIN Trace
      ON Trace.NoForm = UploadFile.NoForm
    WHERE Trace.IDTrace = ?`,
    [TraceId],
  );
  return [rows, metadata];
};
