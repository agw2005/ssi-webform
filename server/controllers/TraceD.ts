import type mysql from "mysql2/promise";
import type { TraceApproverPath, TraceDTable } from "../models/TraceD.d.ts";

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

export const getApproverPathInformation = async (
  pool: mysql.Pool,
  traceId: number,
) => {
  const [rows, metadata] = await pool.query<TraceApproverPath[]>(
    `SELECT
      Trace_D.Result,
      Trace_D.ApproverType,
      Trace_D.DateApprove,
      UserMaster.NRP,
      UserMaster.NameUser
    FROM Trace_D 
    INNER JOIN UserMaster
	    ON UserMaster.IDUser = Trace_D.IDUser
    WHERE IDTrace = ?
    ORDER BY ApproverLevel ASC;`,
    [traceId],
  );
  return [rows, metadata];
};

export const postRequestApproverPath = async (
  pool: mysql.Pool,
  traceId: number,
  userId: number,
  approverType: string,
  approverStep: number,
) => {
  const result = approverStep === 1 ? "In Progress" : "";
  await pool.query(
    `INSERT INTO Trace_D
        (IDTrace, IDUser, Result, DateApprove, ApproverType, ApproverLevel)
      VALUES
        (? , ? , ? , null , ? , ?);`,
    [traceId, userId, result, approverType, approverStep],
  );
  return void 0;
};
