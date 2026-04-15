import type {
  FrmPRHTable,
  PRNumberIncrement,
  RequestItemsAtBudgetView,
} from "../models/FrmPRH.d.ts";
import type {
  FrmPRDTable,
  MsSqlResponse,
  TraceTable,
} from "@scope/server-ssms";
import { FrmPRDSSMSTypes } from "./FrmPRD.ts";
import { TraceSSMSTypes } from "./Trace.ts";
import ssms from "mssql";

const { Int, VarChar, Numeric } = ssms;

export const FrmPRHSSMSTypes = {
  ID: Int(),
  NoForm: VarChar(50),
  Requestor: VarChar(50),
  NRP: VarChar(50),
  Section: VarChar(50),
  NoPR: VarChar(50),
  Subject: VarChar(500),
  Amount: Numeric(18, 2),
  ReturnOnOutgoing: VarChar(500),
  Remarks: VarChar(500),
};

export const getRequestItemForBudgetView = async (
  pool: ssms.ConnectionPool,
  nature: FrmPRDTable["Nature"] | null,
  costCenter: FrmPRDTable["CostCenter"] | null,
  startDate: TraceTable["SubmitDate"] | null,
  endDate: TraceTable["SubmitDate"] | null,
): Promise<MsSqlResponse<RequestItemsAtBudgetView>> => {
  const request = pool.request();

  request.input("nature", FrmPRDSSMSTypes.Nature, nature);
  request.input("costCenter", FrmPRDSSMSTypes.CostCenter, costCenter);
  request.input("startDate", TraceSSMSTypes.SubmitDate, startDate);
  request.input("endDate", TraceSSMSTypes.SubmitDate, endDate);

  const result = await request.query<RequestItemsAtBudgetView>(
    `SELECT
      Trace.IDTrace,
      frm_PR_D.IDItem AS ItemId,
      frm_PR_D.NoPR,
      frm_PR_D.AcctAssgCategory,
      frm_PR_D.CostCenter,
      frm_PR_D.Nature,
      frm_PR_D.Description,
      frm_PR_D.Qty,
      frm_PR_D.Measure,
      frm_PR_D.UnitPrice,
      frm_PR_D.Currency,
      frm_PR_D.EstimationDeliveryDate,
      frm_PR_D.Vendor,
      frm_PR_D.Reason,
      frm_PR_D.StatusItem,
      frm_PR_D.RejectedBy,
      frm_PR_D.Supplier,
      frm_PR_D.NetPrice,
      frm_PR_D.DeliveryDate,
      frm_PR_D.NoPO,
      frm_PR_D.Rate,
      frm_PR_D.IDBudget,
      Trace.SubmitDate
    FROM frm_PR_H
    INNER JOIN frm_PR_D
	    ON frm_PR_D.NoPR = frm_PR_H.NoPR
    INNER JOIN Trace
	    ON frm_PR_H.NoForm = Trace.NoForm
    WHERE frm_PR_D.Nature = @nature
    AND frm_PR_D.CostCenter = @costCenter
    AND Trace.SubmitDate
      BETWEEN @startDate AND @endDate;`,
  );

  const response: MsSqlResponse<RequestItemsAtBudgetView> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response;
};

export const provisionPRNumber = async (
  requestSource: ssms.Transaction,
  dept: string,
): Promise<string> => {
  const request = requestSource.request();

  const result = await request.query<PRNumberIncrement>(`
    SELECT
        ISNULL(MAX(
          CAST(
            SUBSTRING(NoPR, 7, LEN(NoPR)) 
          AS INT)
        ), 0) AS Increment
      FROM frm_PR_H
      WITH (UPDLOCK, HOLDLOCK)
      WHERE SUBSTRING(NoPR, 4, 1) = CHAR(65 + MONTH(GETDATE()) - 1)
      AND SUBSTRING(NoPR, 5, 2) = RIGHT(CAST(YEAR(GETDATE()) AS VARCHAR), 2);
    `);

  const now = new Date();
  const monthLetter = String.fromCharCode(65 + now.getMonth());
  const year = now.getFullYear().toString().slice(-2);
  const nextIncrement = result.recordset[0]?.Increment + 1;

  return `${dept}${monthLetter}${year}${nextIncrement}`;
};

export const postRequestInformation = async (
  requestSource: ssms.Transaction,
  noForm: FrmPRHTable["NoForm"],
  requestorName: FrmPRHTable["Requestor"],
  requestorNrp: FrmPRHTable["NRP"],
  requestorSection: FrmPRHTable["Section"],
  noPR: FrmPRHTable["NoPR"],
  requestSubject: FrmPRHTable["Subject"],
  requestAmount: FrmPRHTable["Amount"],
  requestReturnOnOutgoing: FrmPRHTable["ReturnOnOutgoing"],
  remarks: FrmPRHTable["Remarks"],
): Promise<number> => {
  const request = requestSource.request();

  request.input("noForm", FrmPRHSSMSTypes.NoForm, noForm);
  request.input("requestorName", FrmPRHSSMSTypes.Requestor, requestorName);
  request.input("requestorNrp", FrmPRHSSMSTypes.NRP, requestorNrp);
  request.input("requestorSection", FrmPRHSSMSTypes.Section, requestorSection);
  request.input("noPR", FrmPRHSSMSTypes.NoPR, noPR);
  request.input("requestSubject", FrmPRHSSMSTypes.Subject, requestSubject);
  request.input("requestAmount", FrmPRHSSMSTypes.Amount, requestAmount);
  request.input(
    "requestReturnOnOutgoing",
    FrmPRHSSMSTypes.ReturnOnOutgoing,
    requestReturnOnOutgoing,
  );
  request.input("remarks", FrmPRHSSMSTypes.Remarks, remarks);

  const result = await request.query<Pick<FrmPRHTable, "ID">>(
    `INSERT INTO 
      frm_PR_H (NoForm, Requestor, NRP, Section, NoPR, Subject, Amount, ReturnOnOutgoing, Remarks) 
      OUTPUT INSERTED.ID
      VALUES (@noForm , @requestorName , @requestorNrp , @requestorSection , @noPR , @requestSubject , ROUND( @requestAmount , 2 ) , @requestReturnOnOutgoing , @remarks);`,
  );

  const newId = result.recordset[0].ID;
  console.log(newId);
  return newId;
};

export const patchRemarksOfRequest = async (
  pool: ssms.ConnectionPool,
  newRemarks: FrmPRHTable["Remarks"],
  noForm: FrmPRHTable["NoForm"],
) => {
  const request = pool.request();

  request.input("newRemarks", FrmPRHSSMSTypes.Remarks, newRemarks);
  request.input("noForm", FrmPRHSSMSTypes.NoForm, noForm);

  await request.query(
    `UPDATE frm_PR_H
      SET Remarks = ?
      WHERE
        NoForm = ?;`,
  );
};

export const deleteRequestInformation = async (
  pool: ssms.Transaction,
  formId: FrmPRHTable["ID"],
) => {
  const request = pool.request();

  request.input("formId", FrmPRHSSMSTypes.ID, formId);

  await request.query(
    `DELETE FROM frm_PR_H WHERE ID = @formId;`,
  );

  return null;
};
