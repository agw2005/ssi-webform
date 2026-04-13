import type { FrmPRDTable, MsSqlResponse } from "@scope/server-ssms";
import type { FrmPRDRequestItem } from "../models/FrmPRD.d.ts";
import * as ssms from "mssql";

export const getAllRequestItems = async (
  pool: ssms.ConnectionPool,
  traceId: number,
): Promise<MsSqlResponse<FrmPRDRequestItem>> => {
  const request = pool.request();

  request.input("traceId", ssms.NVarChar, traceId);

  const result = await request.query<FrmPRDRequestItem>(
    `SELECT
      frm_PR_D.IDItem,
      frm_PR_D.Description,
      frm_PR_D.Qty,
      frm_PR_D.Measure,
      frm_PR_D.UnitPrice,
      frm_PR_D.Currency,
      frm_PR_D.EstimationDeliveryDate AS EstimatedDelivery,
      frm_PR_D.Vendor,
      frm_PR_D.Reason,
      frm_PR_D.StatusItem,
      frm_PR_D.RejectedBy,
      frm_PR_D.Supplier,
      frm_PR_D.DeliveryDate
    FROM frm_PR_D
    INNER JOIN frm_PR_H
	    ON frm_PR_H.NoPR = frm_PR_D.NoPR
    INNER JOIN Trace
	    ON Trace.NoForm = frm_PR_H.NoForm
    WHERE Trace.IDTrace = @traceId;
    `,
  );

  const response: MsSqlResponse<FrmPRDRequestItem> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response;
};

export const postUsage = async (
  requestSource: ssms.Transaction,
  noPR: string,
  costCenter: string,
  nature: string,
  description: string,
  quantity: number,
  measure: string,
  unitPrice: number,
  currency: string,
  estimatedDeliveryDate: string,
  vendor: string,
  reason: string,
  rateByCurrency: number,
  budgetId: string,
): Promise<number> => {
  const netPrice = (quantity * unitPrice) / rateByCurrency;

  const request = new ssms.Request(requestSource);

  request.input("noPR", ssms.NVarChar, noPR);
  request.input("costCenter", ssms.NVarChar, costCenter);
  request.input("nature", ssms.NVarChar, nature);
  request.input("description", ssms.NVarChar, description);
  request.input("quantity", ssms.Int, quantity);
  request.input("measure", ssms.NVarChar, measure);
  request.input("unitPrice", ssms.Decimal(18, 2), unitPrice);
  request.input("currency", ssms.NVarChar, currency);
  request.input("estimatedDeliveryDate", ssms.DateTime, estimatedDeliveryDate);
  request.input("vendor", ssms.NVarChar, vendor);
  request.input("reason", ssms.NVarChar, reason);
  request.input("netPrice", ssms.Decimal(18, 2), netPrice);
  request.input("rate", ssms.Decimal(18, 2), rateByCurrency);
  request.input("budgetId", ssms.NVarChar, budgetId);

  const result = await request.query<Pick<FrmPRDTable, "IDItem">>(`
    INSERT INTO frm_PR_D 
        (NoPR, AcctAssgCategory, CostCenter, Nature, Description, Qty, Measure, 
         UnitPrice, Currency, EstimationDeliveryDate, Vendor, Reason, StatusItem, 
         RejectedBy, Supplier, NetPrice, DeliveryDate, NoPO, Rate, IDBudget)
      OUTPUT INSERTED.IDItem
      VALUES 
        (@noPR, '', @costCenter, @nature, @description, @quantity, @measure, 
         @unitPrice, @currency, @estimatedDeliveryDate, @vendor, @reason, 'False', 
         '', '', ROUND(@netPrice, 2), NULL, '', @rate, @budgetId);
    `);

  const newIdItem = result.recordset[0].IDItem;
  return newIdItem;
};

export const patchFrmPRDVerdict = async (
  requestSource: ssms.Transaction,
  supervisorId: number,
  itemId: number,
) => {
  const request = new ssms.Request(requestSource);

  request.input("supervisorId", ssms.NVarChar, supervisorId);
  request.input("itemId", ssms.NVarChar, itemId);

  await request.query(
    `UPDATE frm_PR_D
      SET
        StatusItem = 'True',
        RejectedBy = @supervisorId
      WHERE IDItem = @itemId;`,
  );
  return void 0;
};

export const deleteRequestItems = async (
  requestSource: ssms.Transaction,
  noPr: string,
) => {
  const request = new ssms.Request(requestSource);

  request.input("supervisorId", ssms.NVarChar, noPr);

  await request.query(
    `DELETE FROM frm_PR_D WHERE NoPR = @noPr;`,
  );

  return null;
};
