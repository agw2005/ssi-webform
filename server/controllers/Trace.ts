import type mysql from "mysql2/promise";
import type {
  TraceRequestOverview,
  TraceRequests,
  TraceRequestsCount,
  TraceTable,
} from "../models/Trace.d.ts";
import type { ResultSetHeader } from "mysql2/promise.js";

/**
 * A basic GET, affecting all attributes with pagination support.
 * @param pool An instance of mysql2 database pool
 * @param page The page of the GET
 * @param pagination The number of instances to GET
 * @returns An array of instances (all its attributes) and a metadata variable
 */
export const basicGet = async (
  pool: mysql.Pool,
  page: number,
  pagination: number = 50,
) => {
  const numRows = pagination;
  const [rows, metadata] = await pool.query<TraceTable[]>(
    `SELECT * 
    FROM Trace
    LIMIT ? , ?`,
    [(page - 1) * numRows, numRows],
  );
  return [rows, metadata];
};

export const homeRequests = async (
  pool: mysql.Pool,
  page: number,
  pagination: number = 50,
  requestorSectionId: number | null,
  status: string | null,
  currentSupervisorId: number | null,
  startDate: string | null,
  endDate: string | null,
  search: string | null,
) => {
  const numRows = pagination;
  const searchPattern = search ? `%${search}%` : null;
  const [rows, metadata] = await pool.query<TraceRequests[]>(
    `SELECT 
      Trace.IDTrace,
      frm_PR_H.Subject,
      frm_PR_H.Amount,
      frm_PR_H.Requestor,
      frm_PR_H.Section AS RequestorSection,
      Trace.IDSection AS RequesterSectionId,
      Trace.Status,
      UserMaster.NameUser AS CurrentSupervisor,
      UserMaster.IDUser AS CurrentSupervisorId,
      Trace.SubmitDate,
      Trace.Remarks
    FROM Trace
    INNER JOIN frm_PR_H
    ON frm_PR_H.NoForm = Trace.NoForm
    INNER JOIN UserMaster
    On Trace.ProcessedBy = UserMaster.IDUser
    WHERE 
      (? IS NULL OR Trace.IDSection = ?)
    AND
      (? IS NULL OR Trace.Status = ?)
    AND
      (? IS NULL OR UserMaster.IDUser = ?)
    AND
      (? IS NULL OR Trace.SubmitDate >= ?)
    AND
      (? IS NULL OR Trace.SubmitDate <= ?)
    AND 
      (? IS NULL OR (
        frm_PR_H.Subject LIKE ? OR 
        Trace.IDTrace LIKE ? OR 
        frm_PR_H.Requestor LIKE ?
      ))
    AND
      Trace.Status IN ('Final Approved', 'In Progress', 'Rejected', 'Cancelled', 'Expired')
    ORDER BY SubmitDate DESC
    LIMIT ? , ?`,
    [
      requestorSectionId,
      requestorSectionId,
      status,
      status,
      currentSupervisorId,
      currentSupervisorId,
      startDate,
      startDate,
      endDate,
      endDate,
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      (page - 1) * numRows,
      numRows,
    ],
  );
  return [rows, metadata];
};

export const homeRequestsCount = async (
  pool: mysql.Pool,
  requestorSectionId: number | null,
  status: string | null,
  currentSupervisorId: number | null,
  startDate: string | null,
  endDate: string | null,
  search: string | null,
) => {
  const searchPattern = search ? `%${search}%` : null;
  const [rows, metadata] = await pool.query<TraceRequestsCount[]>(
    `SELECT 
      COUNT(*) AS COUNT
    FROM Trace
    INNER JOIN frm_PR_H
    ON frm_PR_H.NoForm = Trace.NoForm
    INNER JOIN UserMaster
    On Trace.ProcessedBy = UserMaster.IDUser
    WHERE 
      (? IS NULL OR Trace.IDSection = ?)
    AND
      (? IS NULL OR Trace.Status = ?)
    AND
      (? IS NULL OR UserMaster.IDUser = ?)
    AND
      (? IS NULL OR Trace.SubmitDate >= ?)
    AND
      (? IS NULL OR Trace.SubmitDate <= ?)
    AND 
      (? IS NULL OR (
        frm_PR_H.Subject LIKE ? OR 
        Trace.IDTrace LIKE ? OR 
        frm_PR_H.Requestor LIKE ?
      ))`,
    [
      requestorSectionId,
      requestorSectionId,
      status,
      status,
      currentSupervisorId,
      currentSupervisorId,
      startDate,
      startDate,
      endDate,
      endDate,
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
    ],
  );
  return [rows, metadata];
};

export const specificRequest = async (pool: mysql.Pool, traceId: number) => {
  const [rows, metadata] = await pool.query<TraceRequestOverview[]>(
    `SELECT DISTINCT
      frm_PR_H.ID AS FormID,
      frm_PR_H.NoForm,
      frm_PR_H.Requestor,
      frm_PR_H.NRP AS RequestorNRP,
      frm_PR_H.Section AS RequestorSection,
      frm_PR_H.NoPR,
      frm_PR_H.Subject,
      frm_PR_H.Amount,
      frm_PR_H.ReturnOnOutgoing,
      frm_PR_H.Remarks,
      frm_PR_D.CostCenter,
      frm_PR_D.Nature,
      frm_PR_D.IDBudget,
      frm_PR_D.Rate
    FROM Trace
    INNER JOIN frm_PR_H
	    ON frm_PR_H.NoForm = Trace.NoForm
    INNER JOIN frm_PR_D
	    ON frm_PR_D.NoPR = frm_PR_H.NoPR
    WHERE Trace.IDTrace = ?;`,
    [traceId],
  );
  return [rows, metadata];
};

export const postRequestTrace = async (
  pool: mysql.Pool,
  noForm: string,
  requestorName: string,
  requestorSectionId: string,
  requestorNrp: string,
  requestorExtensionNumber: string,
  requestorEmail: string,
  requestSubmissionDate: string,
  initialSupervisorId: number,
): Promise<number> => {
  const [rows, _metadata] = await pool.query<ResultSetHeader>(
    `INSERT INTO Trace
	    (IDForm, FormTable, NoForm, Requestor, IDSection, NRP, Ext, EmailReq, Status, SubmitDate, ProcessedBy, ProcessedLevel, LevelProgress, Remarks)
    VALUES
	    ('8', 'frm_PR_H', ? , ? , ? , ? , ? , ? , 'In Progress', ? , ? , 0 , 1 , '');`,
    [
      noForm,
      requestorName,
      requestorSectionId,
      requestorNrp,
      requestorExtensionNumber,
      requestorEmail,
      requestSubmissionDate,
      initialSupervisorId,
    ],
  );

  const newIDTrace = rows.insertId;
  return newIDTrace;
};
