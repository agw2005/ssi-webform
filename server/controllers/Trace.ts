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
import type { MsSqlResponse } from "@scope/server";
import { UserMasterSSMSTypes } from "./UserMaster.ts";
import { TraceDSSMSTypes } from "./TraceD.ts";
import ssms from "mssql";
import type { UserMasterTable } from "../models/UserMaster.d.ts";
import type { TraceDTable } from "../models/TraceD.d.ts";
import type { FrmPRHTable } from "../models/FrmPRH.d.ts";

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
  transaction: ssms.Transaction,
  page: number,
  pagination: number = 50,
  requestorSectionId: TraceTable["IDSection"] | null,
  status: TraceTable["Status"] | null,
  currentSupervisorId: UserMasterTable["IDUser"] | null,
  startDate: TraceTable["SubmitDate"] | null,
  endDate: TraceTable["SubmitDate"] | null,
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

  const result = await request.query<TraceRequests>(`
    WITH RawResults AS (
      SELECT 
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
        Trace.Remarks,
        ROW_NUMBER() OVER (ORDER BY Trace.SubmitDate DESC) AS RowNum
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
    )
    SELECT 
      IDTrace, Subject, Amount, Requestor, RequestorSection, 
      RequesterSectionId, Status, CurrentSupervisor, 
      CurrentSupervisorId, SubmitDate, Remarks
    FROM RawResults
    WHERE RowNum > @skip AND RowNum <= (@skip + @take)
    ORDER BY RowNum ASC;`);

  const response: MsSqlResponse<TraceRequests> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response;
};

export const homeRequestsCount = async (
  transaction: ssms.Transaction,
  requestorSectionId: TraceTable["IDSection"] | null,
  status: TraceTable["Status"] | null,
  currentSupervisorId: UserMasterTable["IDUser"] | null,
  startDate: TraceTable["SubmitDate"] | null,
  endDate: TraceTable["SubmitDate"] | null,
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

  const result = await request.query<TraceRequestsCount>(`
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
  transaction: ssms.Transaction,
  traceId: TraceTable["IDTrace"],
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
  noForm: TraceTable["NoForm"],
  requestorName: TraceTable["Requestor"],
  requestorSectionId: TraceTable["IDSection"],
  requestorNrp: TraceTable["NRP"],
  requestorExtensionNumber: TraceTable["NRP"],
  requestorEmail: TraceTable["EmailReq"],
  requestSubmissionDate: TraceTable["SubmitDate"],
  initialSupervisorId: TraceTable["ProcessedBy"],
  remarks: TraceTable["Remarks"],
) => {
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
  return { rowsAffected: result.rowsAffected, newIDTrace };
};

export const approveRequests = async (
  transaction: ssms.Transaction,
  supervisorNrp: UserMasterTable["NRP"] | null,
  page: number,
  pagination: number = 50,
  status: TraceDTable["Result"] | null,
  startDate: TraceTable["SubmitDate"] | null,
  endDate: TraceTable["SubmitDate"] | null,
  search: string | null,
): Promise<MsSqlResponse<TraceApproveRequests>> => {
  const supervisorNrpPattern = `%${supervisorNrp}%`;
  const searchPattern = search ? `%${search}%` : null;
  const startRow = (page - 1) * pagination + 1;
  const endRow = page * pagination;

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
  request.input("startRow", ssms.Int(), startRow);
  request.input("endRow", ssms.Int(), endRow);

  const result = await request.query<TraceApproveRequests>(`
    WITH OrderedRequests AS (
      SELECT 
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
        Trace_D.ApproverType AS SupervisorType,
        ROW_NUMBER() OVER (
          ORDER BY Trace.SubmitDate DESC, Trace_D.ApproverLevel DESC
        ) AS RowNum
      FROM Trace
      INNER JOIN frm_PR_H
        ON frm_PR_H.NoForm = Trace.NoForm
      LEFT JOIN UserMaster AS ProcessedByUser
        ON Trace.ProcessedBy = ProcessedByUser.IDUser
      INNER JOIN Trace_D
        ON Trace_D.IDTrace = Trace.IDTrace
      INNER JOIN UserMaster AS Supervisors
        ON Trace_D.IDUser = Supervisors.IDUser
      WHERE Supervisors.NRP LIKE @supervisorNrpPattern
      AND Trace_D.Result <> ''
      AND (@status IS NULL OR Trace_D.Result = @status)
      AND (@startDate IS NULL OR Trace.SubmitDate >= @startDate)
      AND (@endDate IS NULL OR Trace.SubmitDate <= @endDate)
      AND 
        (@searchPattern IS NULL OR (
          frm_PR_H.Subject LIKE @searchPattern OR 
          CAST(Trace.IDTrace AS VARCHAR) LIKE @searchPattern OR 
          frm_PR_H.Requestor LIKE @searchPattern
        ))
      AND Trace_D.Result IN ('Approved', 'In Progress', '', 'Rejected')
    )
    SELECT * FROM OrderedRequests 
    WHERE RowNum BETWEEN @startRow AND @endRow
    ORDER BY RowNum;`);

  const response: MsSqlResponse<TraceApproveRequests> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response;
};

export const approveRequestsCount = async (
  transaction: ssms.Transaction,
  supervisorNrp: UserMasterTable["NRP"] | null,
  status: TraceDTable["Result"] | null,
  startDate: TraceTable["SubmitDate"] | null,
  endDate: TraceTable["SubmitDate"] | null,
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
  transaction: ssms.Transaction,
  newRemarks: TraceTable["Remarks"],
  noForm: TraceTable["NoForm"],
) => {
  const request = transaction.request();

  request.input("newRemarks", TraceSSMSTypes.Remarks, newRemarks);
  request.input("noForm", TraceSSMSTypes.NoForm, noForm);

  const result = await request.query(
    `UPDATE Trace
      SET Remarks = @newRemarks
      WHERE
        NoForm = @noForm;`,
  );

  return result.rowsAffected[0];
};

export const patchTraceVerdict = async (
  requestSource: ssms.Transaction,
  verdict: "Rejected" | "Approved",
  traceId: TraceTable["IDTrace"],
  maxApproverLevel: TraceTable["ProcessedLevel"],
  sumApproverLevel: TraceTable["LevelProgress"],
  nextApproverId: TraceTable["ProcessedBy"] | null,
  nextApproverLevel: TraceTable["LevelProgress"] | null,
) => {
  const request = requestSource.request();

  let result: ssms.IResult<null> | null = null;

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

    result = await request.query(
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
    const newProcessedBy: TraceTable["ProcessedBy"] | null = isLastSupervisor
      ? 0
      : nextApproverId;
    const newProcessedLevel = isLastSupervisor
      ? sum(Number(maxApproverLevel))
      : nextApproverLevel !== null
      ? sum(nextApproverLevel)
      : sum(Number(maxApproverLevel));
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

    result = await request.query(
      `UPDATE Trace
        SET
          Trace.Status = @newStatus,
          Trace.ProcessedBy = @newProcessedBy,
          Trace.ProcessedLevel = @newProcessedLevel,
          Trace.LevelProgress = @newLevelProgress
        WHERE Trace.IDTrace = @traceId;`,
    );
  }
  return result.rowsAffected[0];
};

export const getRequestIds = async (
  transaction: ssms.Transaction,
  idTrace: TraceTable["IDTrace"],
): Promise<{
  formId: FrmPRHTable["ID"];
  noForm: FrmPRHTable["NoForm"];
  noPr: FrmPRHTable["NoPR"];
  requestItems: PurchasingRequestItemsInformation[];
}> => {
  const request = transaction.request();

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
  noForm: FrmPRHTable["NoForm"],
) => {
  const request = requestSource.request();

  request.input("noForm", TraceSSMSTypes.NoForm, noForm);

  const result = await request.query(
    `DELETE FROM Trace WHERE NoForm = @noForm;`,
  );

  return result.rowsAffected[0];
};
