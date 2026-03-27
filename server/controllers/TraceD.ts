import type mysql from "mysql2/promise";
import type {
  NextApproverPath,
  OtherApproverPathInfo,
  TraceApproverPath,
} from "../models/TraceD.d.ts";
import { jsDateToMySQLDatetime } from "../helper/jsDateToMySQLDatetime.ts";

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

export const patchTraceDVerdict = async (
  pool: mysql.Pool,
  verdict: "Rejected" | "Approved",
  traceId: number,
  currentApproverLevel: number,
) => {
  const now = jsDateToMySQLDatetime(new Date());
  await pool.query(
    `UPDATE Trace_D
      SET
        Trace_D.Result = ?,
        Trace_D.DateApprove = ?
      WHERE Trace_D.IDTrace = ?
      AND Trace_D.ApproverLevel = ?;`,
    [verdict, now, traceId, currentApproverLevel],
  );
  return void 0;
};

/**
 * The IDUser and ApproverLevel of the next supervisor for that TraceID.
 *
 * Will return two `null` values if the input UserID is the last supervisor.
 */
export const getNextApprover = async (
  pool: mysql.Pool,
  traceId: number,
  idUser: number,
  currentLevel: number,
): Promise<{
  nextUserId: number | null;
  nextApproverLevel: number | null;
}> => {
  const [rows, _metadata] = await pool.query<NextApproverPath[]>(
    `WITH SequentialApprovers AS (
        SELECT 
          IDTrace,
          IDUser AS CurrentIDUser,
          ApproverLevel AS CurrentLevel,
          LEAD(IDUser) OVER (PARTITION BY IDTrace ORDER BY ApproverLevel ASC) AS NextIDUser,
          LEAD(ApproverLevel) OVER (PARTITION BY IDTrace ORDER BY ApproverLevel ASC) AS NextApproverLevel
        FROM 
          Trace_D
        )
      SELECT 
        NextIDUser, 
        NextApproverLevel
      FROM 
        SequentialApprovers
      WHERE 
        IDTrace = ?
        AND CurrentIDUser = ?
        AND CurrentLevel = ?;`,
    [traceId, idUser, currentLevel],
  );

  const nextUserId = rows[0]?.NextIDUser ?? null;
  const nextApproverLevel = rows[0]?.NextApproverLevel ?? null;

  return { nextUserId, nextApproverLevel };
};

export const getOtherApproverInfo = async (
  pool: mysql.Pool,
  traceId: number,
) => {
  const [rows, _metadata] = await pool.query<OtherApproverPathInfo[]>(
    `SELECT
        SUM(Trace_D.ApproverLevel) AS Summed,
        MAX(Trace_D.ApproverLevel) AS Maxxed
      FROM Trace_D
      WHERE Trace_D.IDTrace = ?;`,
    [traceId],
  );

  const Maxxed = rows[0].Maxxed;
  const Summed = rows[0].Summed;
  return { Maxxed, Summed };
};

export const patchApproverToActiveApproving = async (
  pool: mysql.Pool,
  traceId: number,
  approverLevel: number,
) => {
  await pool.query(
    `UPDATE Trace_D
      SET
        Trace_D.Result = 'In Progress'
      WHERE Trace_D.IDTrace = ?
      AND Trace_D.ApproverLevel = ?;`,
    [traceId, approverLevel],
  );
  return void 0;
};
