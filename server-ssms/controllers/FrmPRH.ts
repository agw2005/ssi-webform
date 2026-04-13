import type {
  FrmPRHTable,
  PRNumberIncrement,
  RequestItemsAtBudgetView,
} from "../models/FrmPRH.d.ts";
import * as ssms from "mssql";
import type { MsSqlResponse } from "@scope/server-ssms";

export const getRequestItemForBudgetView = async (
  pool: ssms.ConnectionPool,
  nature: string | null,
  costCenter: string | null,
  startDate: string | null,
  endDate: string | null,
): Promise<MsSqlResponse<RequestItemsAtBudgetView>> => {
  const request = pool.request();

  request.input("nature", ssms.NVarChar, nature);
  request.input("costCenter", ssms.NVarChar, costCenter);
  request.input("startDate", ssms.NVarChar, startDate);
  request.input("endDate", ssms.NVarChar, endDate);

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
  noForm: string,
  requestorName: string,
  requestorNrp: string,
  requestorSection: string,
  noPR: string,
  requestSubject: string,
  requestAmount: number,
  requestReturnOnOutgoing: string,
  remarks: string,
): Promise<number> => {
  const request = requestSource.request();

  request.input("noForm", ssms.NVarChar, noForm);
  request.input("requestorName", ssms.NVarChar, requestorName);
  request.input("requestorNrp", ssms.NVarChar, requestorNrp);
  request.input("requestorSection", ssms.NVarChar, requestorSection);
  request.input("noPR", ssms.NVarChar, noPR);
  request.input("requestSubject", ssms.NVarChar, requestSubject);
  request.input("requestAmount", ssms.Numeric(18, 2), requestAmount);
  request.input(
    "requestReturnOnOutgoing",
    ssms.NVarChar,
    requestReturnOnOutgoing,
  );
  request.input("remarks", ssms.NVarChar, remarks);

  const result = await request.query<Pick<FrmPRHTable, "ID">>(
    `INSERT INTO 
      frm_PR_H (NoForm, Requestor, NRP, Section, NoPR, Subject, Amount, ReturnOnOutgoing, Remarks) 
      VALUES (@noForm , @requestorName , @requestorNrp , @requestorSection , @noPR , @requestSubject , ROUND( @requestAmount , 2 ) , @requestReturnOnOutgoing , @remarks);`,
  );

  const newId = result.recordset[0].ID;
  return newId;
};

export const patchRemarksOfRequest = async (
  pool: ssms.ConnectionPool,
  newRemarks: string,
  noForm: string,
) => {
  const request = pool.request();

  request.input("newRemarks", ssms.NVarChar, newRemarks);
  request.input("noForm", ssms.VarChar, noForm);

  await request.query(
    `UPDATE frm_PR_H
      SET Remarks = ?
      WHERE
        NoForm = ?;`,
  );
};

export const deleteRequestInformation = async (
  pool: ssms.Transaction,
  formId: number,
) => {
  const request = pool.request();

  request.input("formId", ssms.Int, formId);

  await request.query(
    `DELETE FROM frm_PR_H WHERE ID = @formId;`,
  );

  return null;
};
