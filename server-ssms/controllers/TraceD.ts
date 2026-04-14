import type {
  NextApproverPath,
  OtherApproverPathInfo,
  TraceApproverPath,
} from "../models/TraceD.d.ts";
import type { MsSqlResponse } from "@scope/server-ssms";

import ssms from "mssql";

const { Int, VarChar, DateTime2 } = ssms;

export const TraceDSSMSTypes = {
  IDTrace: Int(),
  IDUser: Int(),
  Result: VarChar(50),
  DateApprove: DateTime2(),
  ApproverType: VarChar(50),
  ApproverLevel: Int(),
};

export const getApproverPathInformation = async (
  pool: ssms.ConnectionPool,
  traceId: number,
): Promise<MsSqlResponse<TraceApproverPath>> => {
  const request = pool.request();

  request.input("traceId", TraceDSSMSTypes.IDTrace, traceId);

  const result = await request.query<TraceApproverPath>(
    `SELECT
      Trace_D.Result,
      Trace_D.ApproverType,
      Trace_D.DateApprove,
      UserMaster.NRP,
      UserMaster.NameUser
    FROM Trace_D 
    INNER JOIN UserMaster
	    ON UserMaster.IDUser = Trace_D.IDUser
    WHERE IDTrace = @traceId
    ORDER BY ApproverLevel ASC;`,
  );

  const response: MsSqlResponse<TraceApproverPath> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response;
};

export const postRequestApproverPath = async (
  requestSource: ssms.Transaction,
  traceId: number,
  userId: number,
  approverType: string,
  approverStep: number,
) => {
  const result = approverStep === 1 ? "In Progress" : "";

  const request = requestSource.request();

  request.input("traceId", TraceDSSMSTypes.IDTrace, traceId);
  request.input("userId", TraceDSSMSTypes.IDUser, userId);
  request.input("result", TraceDSSMSTypes.Result, result);
  request.input("approverType", TraceDSSMSTypes.ApproverType, approverType);
  request.input("approverStep", TraceDSSMSTypes.ApproverLevel, approverStep);

  await request.query(
    `INSERT INTO Trace_D
        (IDTrace, IDUser, Result, DateApprove, ApproverType, ApproverLevel)
      VALUES
        (@traceId , @userId , @result , null , @approverType , @approverStep);`,
  );
  return void 0;
};

export const patchTraceDVerdict = async (
  requestSource: ssms.Transaction | ssms.ConnectionPool,
  verdict: "Rejected" | "Approved",
  traceId: number,
  currentApproverLevel: number,
) => {
  const request = requestSource.request();

  request.input("verdict", TraceDSSMSTypes.Result, verdict);
  request.input("traceId", TraceDSSMSTypes.IDTrace, traceId);
  request.input(
    "currentApproverLevel",
    TraceDSSMSTypes.ApproverLevel,
    currentApproverLevel,
  );

  await request.query(
    `UPDATE Trace_D
      SET
        Trace_D.Result = @verdict,
        Trace_D.DateApprove = GETDATE()
      WHERE Trace_D.IDTrace = @traceId
      AND Trace_D.ApproverLevel = @currentApproverLevel;`,
  );
  return void 0;
};

export const getNextApprover = async (
  requestSource: ssms.Transaction | ssms.ConnectionPool,
  traceId: number,
  idUser: number,
  currentLevel: number,
): Promise<{
  nextUserId: number | null;
  nextApproverLevel: number | null;
}> => {
  const request = requestSource.request();

  request.input("traceId", TraceDSSMSTypes.IDTrace, traceId);
  request.input("idUser", TraceDSSMSTypes.IDUser, idUser);
  request.input("currentLevel", TraceDSSMSTypes.ApproverLevel, currentLevel);

  const results = await request.query<NextApproverPath[]>(
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
      FROM SequentialApprovers
      WHERE 
        IDTrace = @traceId
        AND CurrentIDUser = @idUser
        AND CurrentLevel = @currentLevel;`,
  );

  const nextUserId = results.recordset[0]?.NextIDUser ?? null;
  const nextApproverLevel = results.recordset[0]?.NextApproverLevel ?? null;

  return { nextUserId, nextApproverLevel };
};

export const getOtherApproverInfo = async (
  requestSource: ssms.Transaction | ssms.ConnectionPool,
  traceId: number,
) => {
  const request = requestSource.request();

  request.input("traceId", TraceDSSMSTypes.IDTrace, traceId);

  const result = await request.query<OtherApproverPathInfo[]>(
    `SELECT
        SUM(Trace_D.ApproverLevel) AS Summed,
        MAX(Trace_D.ApproverLevel) AS Maxxed
      FROM Trace_D
      WHERE Trace_D.IDTrace = @traceId;`,
  );

  const Maxxed = result.recordset[0].Maxxed;
  const Summed = result.recordset[0].Summed;
  return { Maxxed, Summed };
};

export const patchApproverToActiveApproving = async (
  pool: ssms.ConnectionPool,
  traceId: number,
  approverLevel: number,
) => {
  const request = pool.request();

  request.input("traceId", TraceDSSMSTypes.IDTrace, traceId);
  request.input("approverLevel", TraceDSSMSTypes.ApproverLevel, approverLevel);

  await pool.query(
    `UPDATE Trace_D
      SET
        Trace_D.Result = 'In Progress'
      WHERE Trace_D.IDTrace = @traceId
      AND Trace_D.ApproverLevel = @approverLevel;`,
  );
  return void 0;
};

export const deleteRequestApproverPath = async (
  requestSource: ssms.Transaction,
  traceId: number,
) => {
  const request = requestSource.request();

  request.input("traceId", TraceDSSMSTypes.IDTrace, traceId);

  await request.query(
    `DELETE FROM Trace_D WHERE IDTrace = @traceId;`,
  );

  return null;
};
