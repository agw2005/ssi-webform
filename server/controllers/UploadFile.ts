import type mysql from "mysql2/promise";
import type {
  UploadFileMinimalInformation,
  UploadFileTable,
} from "../models/UploadFile.d.ts";
import type { ResultSetHeader } from "mysql2/promise.js";

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

export const postRequestFiles = async (
  pool: mysql.Pool,
  noForm: string,
  requestSubject: string,
  requestorName: string,
  filename: string,
  uploadDate: string,
): Promise<number> => {
  const [rows] = await pool.query<ResultSetHeader>(
    `INSERT INTO UploadFile
        (NoForm, FormName, Requestor, Filename, DateUpload)
      VALUES
        (? , ? , ? , ? , ?)`,
    [noForm, requestSubject, requestorName, filename, uploadDate],
  );
  const newUploadId = rows.insertId;
  return newUploadId;
};
