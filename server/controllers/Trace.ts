import type mysql from "mysql2/promise";
import type { TraceRequests, TraceTable } from "../models/Trace.d.ts";

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
) => {
  const numRows = pagination;
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
      (page - 1) * numRows,
      numRows,
    ],
  );
  return [rows, metadata];
};
