import type {
  PurchasingRequestIds,
  PurchasingRequestItemsInformation,
  TraceApproveRequests,
  TraceRequestOverview,
  TraceRequests,
  TraceRequestsCount,
  TraceTable,
} from "../models/Trace.d.ts";
import { sum } from "../helper/sum.ts";
import type { MsSqlResponse } from "@scope/server-ssms";
import { UserMasterSSMSTypes } from "./UserMaster.ts";
import { TraceDSSMSTypes } from "./TraceD.ts";
import ssms from "mssql";

const { Int, VarChar, DateTime2, NVarChar } = ssms;

export const TraceSSMSTypes = {
  IDTrace: Int(),
  IDForm: Int(),
  FormTable: VarChar(50),
  NoForm: VarChar(50),
  Requestor: VarChar(50),
  IDSection: Int(),
  NRP: VarChar(50),
  Ext: VarChar(50),
  EmailReq: VarChar(50),
  Status: VarChar(50),
  SubmitDate: DateTime2(),
  ProcessedBy: Int(),
  ProcessedLevel: Int(),
  LevelProgress: Int(),
  Remarks: NVarChar(4000),
};

export const homeRequests = async (
  pool: ssms.ConnectionPool,
  page: number,
  pagination: number = 50,
  requestorSectionId: number | null,
  status: string | null,
  currentSupervisorId: number | null,
  startDate: string | null,
  endDate: string | null,
  search: string | null,
): Promise<MsSqlResponse<TraceRequests>> => {
  const skip = (page - 1) * pagination;
  const searchPattern = search ? `%${search}%` : null;
  const request = pool.request();

  request.input(
    "requestorSectionId",
    TraceSSMSTypes.IDSection,
    requestorSectionId,
  );
  request.input("status", TraceSSMSTypes.Status, status);
  request.input(
    "currentSupervisorId",
    UserMasterSSMSTypes.IDUser,
    currentSupervisorId,
  );
  request.input("startDate", TraceSSMSTypes.SubmitDate, startDate);
  request.input("endDate", TraceSSMSTypes.SubmitDate, endDate);
  request.input("searchPattern", ssms.VarChar(500), searchPattern);
  request.input("skip", ssms.Int, skip);
  request.input("take", ssms.Int, pagination);

  const result = await pool.query<TraceRequests>(
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
        ON Trace.ProcessedBy = UserMaster.IDUser
      WHERE 
        (@requestorSectionId IS NULL OR Trace.IDSection = @requestorSectionId)
      AND
        (@status IS NULL OR Trace.Status = @status)
      AND
        (@currentSupervisorId IS NULL OR UserMaster.IDUser = @currentSupervisorId)
      AND
        (@startDate IS NULL OR Trace.SubmitDate >= @startDate)
      AND
        (@endDate IS NULL OR Trace.SubmitDate <= @endDate)
      AND 
        (@searchPattern IS NULL OR (
          frm_PR_H.Subject LIKE @searchPattern OR 
          CAST(Trace.IDTrace AS VARCHAR) LIKE @searchPattern OR 
          frm_PR_H.Requestor LIKE @searchPattern
        ))
      AND
        Trace.Status IN ('Final Approved', 'In Progress', 'Rejected', 'Cancelled', 'Expired')
      ORDER BY Trace.SubmitDate DESC
      OFFSET @skip ROWS FETCH NEXT @take ROWS ONLY;`,
  );

  const response: MsSqlResponse<TraceRequests> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response;
};

export const homeRequestsCount = async (
  pool: ssms.ConnectionPool,
  requestorSectionId: number | null,
  status: string | null,
  currentSupervisorId: number | null,
  startDate: string | null,
  endDate: string | null,
  search: string | null,
): Promise<MsSqlResponse<TraceRequestsCount>> => {
  const searchPattern = search ? `%${search}%` : null;
  const request = pool.request();

  request.input(
    "requestorSectionId",
    TraceSSMSTypes.IDSection,
    requestorSectionId,
  );
  request.input("status", TraceSSMSTypes.Status, status);
  request.input(
    "currentSupervisorId",
    UserMasterSSMSTypes.IDUser,
    currentSupervisorId,
  );
  request.input("startDate", TraceSSMSTypes.SubmitDate, startDate);
  request.input("endDate", TraceSSMSTypes.SubmitDate, endDate);
  request.input("searchPattern", ssms.VarChar(500), searchPattern);

  const result = await pool.query<TraceRequestsCount>(`
    SELECT 
      COUNT(*) AS Count
    FROM Trace
    INNER JOIN frm_PR_H
      ON frm_PR_H.NoForm = Trace.NoForm
    LEFT JOIN UserMaster
      ON Trace.ProcessedBy = UserMaster.IDUser
    WHERE 
      (@requestorSectionId IS NULL OR Trace.IDSection = @requestorSectionId)
    AND
      (@status IS NULL OR Trace.Status = @status)
    AND
      (@currentSupervisorId IS NULL OR UserMaster.IDUser = @currentSupervisorId)
    AND
      (@startDate IS NULL OR Trace.SubmitDate >= @startDate)
    AND
      (@endDate IS NULL OR Trace.SubmitDate <= @endDate)
    AND 
      (@searchPattern IS NULL OR (
        frm_PR_H.Subject LIKE @searchPattern OR 
        CAST(Trace.IDTrace AS VARCHAR) LIKE @searchPattern OR 
        frm_PR_H.Requestor LIKE @searchPattern
      ))
    AND
      Trace.Status IN ('Final Approved', 'In Progress', 'Rejected', 'Cancelled', 'Expired');
      `);

  const response: MsSqlResponse<TraceRequestsCount> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response;
};

export const specificRequest = async (
  pool: ssms.ConnectionPool,
  traceId: number,
): Promise<MsSqlResponse<TraceRequestOverview>> => {
  const request = pool.request();

  request.input("traceId", TraceSSMSTypes.IDTrace, traceId);

  const result = await request.query<TraceRequestOverview>(
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
    WHERE Trace.IDTrace = @traceId;`,
  );

  const response: MsSqlResponse<TraceRequestOverview> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response;
};

export const postRequestTrace = async (
  requestSource: ssms.Transaction,
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
  const request = requestSource.request();

  request.input("noForm", TraceSSMSTypes.NoForm, noForm);
  request.input("requestorName", TraceSSMSTypes.Requestor, requestorName);
  request.input(
    "requestorSectionId",
    TraceSSMSTypes.IDSection,
    requestorSectionId,
  );
  request.input("requestorNrp", TraceSSMSTypes.NRP, requestorNrp);
  request.input("ext", TraceSSMSTypes.Ext, requestorExtensionNumber);
  request.input("email", TraceSSMSTypes.EmailReq, requestorEmail);
  request.input("submitDate", TraceSSMSTypes.SubmitDate, requestSubmissionDate);
  request.input("processedBy", TraceSSMSTypes.ProcessedBy, initialSupervisorId);
  request.input("remarks", TraceSSMSTypes.Remarks, remarks);

  const result = await request.query<Pick<TraceTable, "IDTrace">>(
    `INSERT INTO Trace
      (IDForm, FormTable, NoForm, Requestor, IDSection, NRP, Ext, EmailReq, Status, SubmitDate, ProcessedBy, ProcessedLevel, LevelProgress, Remarks)
    OUTPUT INSERTED.IDTrace
    VALUES
      ('8', 'frm_PR_H', @noForm, @requestorName, @requestorSectionId, @requestorNrp, @ext, @email, 'In Progress', @submitDate, @processedBy, 0, 1, @remarks);`,
  );

  const newIDTrace = result.recordset[0].IDTrace;
  return newIDTrace;
};

export const approveRequests = async (
  pool: ssms.ConnectionPool,
  supervisorNrp: string | null,
  page: number,
  pagination: number = 50,
  status: string | null,
  startDate: string | null,
  endDate: string | null,
  search: string | null,
): Promise<MsSqlResponse<TraceApproveRequests>> => {
  const supervisorNrpPattern = `%${supervisorNrp}%`;
  const searchPattern = search ? `%${search}%` : null;
  const skip = (page - 1) * pagination;

  const request = pool.request();

  request.input(
    "supervisorNrpPattern",
    UserMasterSSMSTypes.NRP,
    supervisorNrpPattern,
  );
  request.input("status", TraceDSSMSTypes.Result, status);
  request.input("startDate", TraceSSMSTypes.SubmitDate, startDate);
  request.input("endDate", TraceSSMSTypes.SubmitDate, endDate);
  request.input("searchPattern", ssms.VarChar(500), searchPattern);
  request.input("skip", ssms.Int(), skip);
  request.input("take", ssms.Int(), pagination);

  const result = await request.query<TraceApproveRequests>(
    `SELECT 
        Trace.IDTrace,
        frm_PR_H.Subject,
        frm_PR_H.Amount,
        frm_PR_H.Requestor,
        frm_PR_H.Section AS RequestorSection,
        Trace.IDSection AS RequesterSectionId,
        Trace_D.Result,
        ProcessedByUser.NameUser AS CurrentSupervisor,
        ProcessedByUser.IDUser AS CurrentSupervisorId,
        Trace.SubmitDate,
        Trace.Remarks,
        Trace_D.ApproverLevel AS SupervisorStep,
        Trace_D.ApproverType AS SupervisorType
      FROM Trace
      INNER JOIN frm_PR_H
        ON frm_PR_H.NoForm = Trace.NoForm
      LEFT JOIN UserMaster AS ProcessedByUser
        ON Trace.ProcessedBy = ProcessedByUser.IDUser
      INNER JOIN Trace_D
        ON Trace_D.IDTrace = Trace.IDTrace
      INNER JOIN UserMaster AS Supervisors
        ON Trace_D.IDUser = Supervisors.IDUser
      WHERE
        Supervisors.NRP LIKE @supervisorNrpPattern
      AND
        Trace_D.Result <> ''
      AND
        (@status IS NULL OR Trace_D.Result = @status)
      AND
        (@startDate IS NULL OR Trace.SubmitDate >= @startDate)
      AND
        (@endDate IS NULL OR Trace.SubmitDate <= @endDate)
      AND 
        (@searchPattern IS NULL OR (
          frm_PR_H.Subject LIKE @searchPattern OR 
          CAST(Trace.IDTrace AS VARCHAR) LIKE @searchPattern OR 
          frm_PR_H.Requestor LIKE @searchPattern
        ))
      AND
        Trace_D.Result IN ('Approved', 'In Progress', '', 'Rejected')
      ORDER BY Trace.SubmitDate DESC, Trace_D.ApproverLevel DESC
      OFFSET @skip ROWS FETCH NEXT @take ROWS ONLY;`,
  );

  const response: MsSqlResponse<TraceApproveRequests> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response;
};

export const approveRequestsCount = async (
  pool: ssms.ConnectionPool,
  supervisorNrp: string | null,
  status: string | null,
  startDate: string | null,
  endDate: string | null,
  search: string | null,
): Promise<MsSqlResponse<TraceRequestsCount>> => {
  const supervisorNrpPattern = `%${supervisorNrp}%`;
  const searchPattern = search ? `%${search}%` : null;

  const request = pool.request();

  request.input(
    "supervisorNrpPattern",
    UserMasterSSMSTypes.NRP,
    supervisorNrpPattern,
  );
  request.input("status", TraceDSSMSTypes.Result, status);
  request.input("startDate", TraceSSMSTypes.SubmitDate, startDate);
  request.input("endDate", TraceSSMSTypes.SubmitDate, endDate);
  request.input("searchPattern", ssms.VarChar(500), searchPattern);

  const result = await request.query<TraceRequestsCount>(`
    SELECT 
      COUNT(*) AS Count
    FROM Trace
    INNER JOIN frm_PR_H
      ON frm_PR_H.NoForm = Trace.NoForm
    LEFT JOIN UserMaster AS ProcessedByUser
      ON Trace.ProcessedBy = ProcessedByUser.IDUser
    INNER JOIN Trace_D
      ON Trace_D.IDTrace = Trace.IDTrace
    INNER JOIN UserMaster AS Supervisors
      ON Trace_D.IDUser = Supervisors.IDUser
    WHERE
      Supervisors.NRP LIKE @supervisorNrpPattern
    AND
      Trace_D.Result <> ''
    AND
      (@status IS NULL OR Trace_D.Result = @status)
    AND
      (@startDate IS NULL OR Trace.SubmitDate >= @startDate)
    AND
      (@endDate IS NULL OR Trace.SubmitDate <= @endDate)
    AND 
      (@searchPattern IS NULL OR (
        frm_PR_H.Subject LIKE @searchPattern OR 
        CAST(Trace.IDTrace AS VARCHAR) LIKE @searchPattern OR 
        frm_PR_H.Requestor LIKE @searchPattern
      ))
    AND
      Trace_D.Result IN ('Approved', 'In Progress', '', 'Rejected');
  `);

  const response: MsSqlResponse<TraceRequestsCount> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response;
};

export const patchRemarksOfTrace = async (
  pool: ssms.ConnectionPool,
  newRemarks: string,
  noForm: string,
) => {
  const request = pool.request();

  request.input("newRemarks", TraceSSMSTypes.Remarks, newRemarks);
  request.input("noForm", TraceSSMSTypes.NoForm, noForm);

  await request.query(
    `UPDATE Trace
      SET Remarks = ?
      WHERE
        NoForm = ?;`,
  );
};

export const patchTraceVerdict = async (
  requestSource: ssms.Transaction | ssms.ConnectionPool,
  verdict: "Rejected" | "Approved",
  traceId: number,
  maxApproverLevel: number,
  sumApproverLevel: number,
  nextApproverId: number | null,
  nextApproverLevel: number | null,
) => {
  const request = requestSource.request();

  if (verdict === "Rejected") {
    request.input(
      "maxApproverLevel",
      TraceSSMSTypes.ProcessedLevel,
      maxApproverLevel,
    );
    request.input(
      "sumApproverLevel",
      TraceSSMSTypes.LevelProgress,
      sumApproverLevel,
    );
    request.input("traceId", TraceSSMSTypes.IDTrace, traceId);

    await request.query(
      `UPDATE Trace
        SET
          Trace.Status = 'Rejected',
          Trace.ProcessedBy = 0,
          Trace.ProcessedLevel = @maxApproverLevel,
          Trace.LevelProgress = @sumApproverLevel
        WHERE Trace.IDTrace = @traceId;`,
    );
  } else {
    const isLastSupervisor = nextApproverLevel === null &&
      nextApproverId === null;

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

    request.input("newStatus", TraceSSMSTypes.Status, newStatus);
    request.input("newProcessedBy", TraceSSMSTypes.ProcessedBy, newProcessedBy);
    request.input(
      "newProcessedLevel",
      TraceSSMSTypes.ProcessedLevel,
      newProcessedLevel,
    );
    request.input(
      "newLevelProgress",
      TraceSSMSTypes.LevelProgress,
      newLevelProgress,
    );
    request.input("traceId", TraceSSMSTypes.IDTrace, traceId);

    await request.query(
      `UPDATE Trace
        SET
          Trace.Status = @newStatus,
          Trace.ProcessedBy = @newProcessedBy,
          Trace.ProcessedLevel = @newProcessedLevel,
          Trace.LevelProgress = @newLevelProgress
        WHERE Trace.IDTrace = @traceId;`,
    );
  }
  return void 0;
};

export const getRequestIds = async (
  pool: ssms.ConnectionPool | ssms.Transaction,
  idTrace: number,
): Promise<{
  formId: number;
  noForm: string;
  noPr: string;
  requestItems: PurchasingRequestItemsInformation[];
}> => {
  const request = pool.request();

  request.input("idTrace", TraceSSMSTypes.IDTrace, idTrace);

  const result = await request.query<PurchasingRequestIds>(`
    SELECT DISTINCT
      frm_PR_H.ID AS FormID,
      frm_PR_H.NoForm,
      frm_PR_H.NoPR,
      frm_PR_D.CostCenter,
      frm_PR_D.Nature,
      frm_PR_D.IDBudget,
      frm_PR_D.NetPrice
    FROM Trace
    INNER JOIN frm_PR_H
      ON frm_PR_H.NoForm = Trace.NoForm
    INNER JOIN frm_PR_D
      ON frm_PR_D.NoPR = frm_PR_H.NoPR
    WHERE Trace.IDTrace = @idTrace;`);

  const rows = result.recordset;

  if (rows.length === 0) {
    throw new Error(`No request found for IDTrace: ${idTrace}`);
  }

  const items: PurchasingRequestItemsInformation[] = rows.map((item) => ({
    CostCenter: item.CostCenter,
    Nature: item.Nature,
    Periode: item.IDBudget.substring(0, 8),
    NetPrice: item.NetPrice,
    FileResource: item.IDBudget.substring(13),
    Department: item.NoPR.substring(0, 3),
  }));

  return {
    formId: rows[0].FormID,
    noForm: rows[0].NoForm,
    noPr: rows[0].NoPR,
    requestItems: items,
  };
};

export const deleteRequestTrace = async (
  requestSource: ssms.Transaction,
  noForm: string,
) => {
  const request = requestSource.request();

  request.input("noForm", TraceSSMSTypes.NoForm, noForm);

  await request.query(`DELETE FROM Trace WHERE NoForm = @noForm;`);

  return null;
};
