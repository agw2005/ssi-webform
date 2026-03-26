import type mysql from "mysql2/promise";
import type {
  TraceApproveRequests,
  TraceRequestOverview,
  TraceRequests,
  TraceRequestsCount,
  TraceTable,
} from "../models/Trace.d.ts";
import type { ResultSetHeader } from "mysql2/promise.js";
import { sum } from "../helper/sum.ts";

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
    LEFT JOIN UserMaster
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
    LIMIT ? , ?;`,
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
      COUNT(*) AS Count
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
      ));`,
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
  remarks: string,
): Promise<number> => {
  const [rows, _metadata] = await pool.query<ResultSetHeader>(
    `INSERT INTO Trace
	    (IDForm, FormTable, NoForm, Requestor, IDSection, NRP, Ext, EmailReq, Status, SubmitDate, ProcessedBy, ProcessedLevel, LevelProgress, Remarks)
    VALUES
	    ('8', 'frm_PR_H', ? , ? , ? , ? , ? , ? , 'In Progress', ? , ? , 0 , 1 , ?);`,
    [
      noForm,
      requestorName,
      requestorSectionId,
      requestorNrp,
      requestorExtensionNumber,
      requestorEmail,
      requestSubmissionDate,
      initialSupervisorId,
      remarks,
    ],
  );

  const newIDTrace = rows.insertId;
  return newIDTrace;
};

export const approveRequests = async (
  pool: mysql.Pool,
  supervisorNrp: string | null,
  page: number,
  pagination: number = 50,
  status: string | null,
  startDate: string | null,
  endDate: string | null,
  search: string | null,
) => {
  const supervisorNrpPattern = `%${supervisorNrp}%`;
  const searchPattern = search ? `%${search}%` : null;
  const numRows = pagination;
  const [rows, metadata] = await pool.query<TraceApproveRequests[]>(
    `SELECT 
      Trace.IDTrace,
      frm_PR_H.Subject,
      frm_PR_H.Amount,
      frm_PR_H.Requestor,
      frm_PR_H.Section,
      Trace.IDSection,
      Trace.Status,
      Trace.SubmitDate,
      Trace.Remarks
    FROM Trace
    INNER JOIN frm_PR_H
    ON frm_PR_H.NoForm = Trace.NoForm
    INNER JOIN UserMaster
    On Trace.ProcessedBy = UserMaster.IDUser
    WHERE
      UserMaster.NRP LIKE ?
    AND
      (? IS NULL OR Trace.Status = ?)
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
    LIMIT ? , ?;`,
    [
      supervisorNrpPattern,
      status,
      status,
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

export const approveRequestsCount = async (
  pool: mysql.Pool,
  supervisorNrp: string | null,
  status: string | null,
  startDate: string | null,
  endDate: string | null,
  search: string | null,
) => {
  const supervisorNrpPattern = `%${supervisorNrp}%`;
  const searchPattern = search ? `%${search}%` : null;
  const [rows, metadata] = await pool.query<TraceRequestsCount[]>(
    `SELECT 
      COUNT(*) AS Count
    FROM Trace
    INNER JOIN frm_PR_H
    ON frm_PR_H.NoForm = Trace.NoForm
    INNER JOIN UserMaster
    On Trace.ProcessedBy = UserMaster.IDUser
    WHERE
      UserMaster.NRP LIKE ?
    AND
      (? IS NULL OR Trace.Status = ?)
    AND
      (? IS NULL OR Trace.SubmitDate >= ?)
    AND
      (? IS NULL OR Trace.SubmitDate <= ?)
    AND 
      (? IS NULL OR (
        frm_PR_H.Subject LIKE ? OR 
        Trace.IDTrace LIKE ? OR 
        frm_PR_H.Requestor LIKE ?
      ));`,
    [
      supervisorNrpPattern,
      status,
      status,
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

export const patchRemarksOfTrace = async (
  pool: mysql.Pool,
  newRemarks: string,
  noForm: string,
) => {
  await pool.query(
    `UPDATE Trace
      SET Remarks = ?
      WHERE
        NoForm = ?;`,
    [newRemarks, noForm],
  );
};

export const patchTraceVerdict = async (
  pool: mysql.Pool,
  verdict: "Rejected" | "Approved",
  traceId: number,
  maxApproverLevel: number,
  sumApproverLevel: number,
  nextApproverId: number | null,
  nextApproverLevel: number | null,
) => {
  if (verdict === "Rejected") {
    await pool.query(
      `UPDATE Trace
        SET
          Trace.Status = 'Rejected',
          Trace.ProcessedBy = 0,
          Trace.ProcessedLevel = ?,
          Trace.LevelProgress = ?
        WHERE Trace.IDTrace = ?;`,
      [maxApproverLevel, sumApproverLevel, traceId],
    );
  } else {
    const isLastSupervisor =
      nextApproverLevel === null && nextApproverId === null;

    const newStatus = isLastSupervisor ? "Final Approved" : "In Progress";
    const newProcessedBy = isLastSupervisor ? 0 : nextApproverId;
    const newProcessedLevel = isLastSupervisor
      ? sum(maxApproverLevel)
      : nextApproverLevel !== null
        ? sum(nextApproverLevel)
        : sum(maxApproverLevel);
    const newLevelProgress = isLastSupervisor
      ? maxApproverLevel
      : nextApproverLevel;

    await pool.query(
      `UPDATE Trace
        SET
          Trace.Status = ?,
          Trace.ProcessedBy = ?,
          Trace.ProcessedLevel = ?,
          Trace.LevelProgress = ?
        WHERE Trace.IDTrace = ?;`,
      [newStatus, newProcessedBy, newProcessedLevel, newLevelProgress, traceId],
    );
  }
  return void 0;
};
