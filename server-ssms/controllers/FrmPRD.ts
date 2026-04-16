import type {
  FrmPRDTable,
  MsSqlResponse,
  TraceTable,
} from "@scope/server-ssms";
import type { FrmPRDRequestItem } from "../models/FrmPRD.d.ts";
import { TraceSSMSTypes } from "./Trace.ts";
import ssms from "mssql";

const { Int, VarChar, Numeric } = ssms;

export const FrmPRDSSMSTypes = {
  IDItem: Int(),
  NoPR: VarChar(50),
  AcctAssgCategory: VarChar(50),
  CostCenter: VarChar(50),
  Nature: VarChar(50),
  Description: VarChar(500),
  Qty: Numeric(18, 2),
  Measure: VarChar(50),
  UnitPrice: Numeric(18, 2),
  Currency: VarChar(50),
  EstimationDeliveryDate: VarChar(50),
  Vendor: VarChar(500),
  Reason: VarChar(5000),
  StatusItem: VarChar(50),
  RejectedBy: VarChar(500),
  Supplier: VarChar(500),
  NetPrice: Numeric(18, 2),
  DeliveryDate: Date(),
  NoPO: VarChar(50),
  Rate: Numeric(18, 2),
  IDBudget: VarChar(50),
};

export const getAllRequestItems = async (
  pool: ssms.ConnectionPool,
  traceId: TraceTable["IDTrace"],
): Promise<MsSqlResponse<FrmPRDRequestItem>> => {
  const request = pool.request();

  request.input("traceId", TraceSSMSTypes.IDTrace, traceId);

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
  noPR: FrmPRDTable["NoPR"],
  costCenter: FrmPRDTable["CostCenter"],
  nature: FrmPRDTable["Nature"],
  description: FrmPRDTable["Description"],
  quantity: FrmPRDTable["Qty"],
  measure: FrmPRDTable["Measure"],
  unitPrice: FrmPRDTable["UnitPrice"],
  currency: FrmPRDTable["Currency"],
  estimatedDeliveryDate: FrmPRDTable["EstimationDeliveryDate"],
  vendor: FrmPRDTable["Vendor"],
  reason: FrmPRDTable["Reason"],
  rateByCurrency: FrmPRDTable["Rate"],
  budgetId: FrmPRDTable["IDBudget"],
): Promise<number> => {
  const netPrice = (quantity * unitPrice) / rateByCurrency;

  const request = requestSource.request();

  request.input("noPR", FrmPRDSSMSTypes.NoPR, noPR);
  request.input("costCenter", FrmPRDSSMSTypes.CostCenter, costCenter);
  request.input("nature", FrmPRDSSMSTypes.Nature, nature);
  request.input("description", FrmPRDSSMSTypes.Description, description);
  request.input("quantity", FrmPRDSSMSTypes.Qty, quantity);
  request.input("measure", FrmPRDSSMSTypes.Measure, measure);
  request.input("unitPrice", FrmPRDSSMSTypes.UnitPrice, unitPrice);
  request.input("currency", FrmPRDSSMSTypes.Currency, currency);
  request.input(
    "estimatedDeliveryDate",
    FrmPRDSSMSTypes.EstimationDeliveryDate,
    estimatedDeliveryDate,
  );
  request.input("vendor", FrmPRDSSMSTypes.Vendor, vendor);
  request.input("reason", FrmPRDSSMSTypes.Reason, reason);
  request.input("netPrice", FrmPRDSSMSTypes.NetPrice, netPrice);
  request.input("rate", FrmPRDSSMSTypes.Rate, rateByCurrency);
  request.input("budgetId", FrmPRDSSMSTypes.IDBudget, budgetId);

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
  supervisorId: FrmPRDTable["RejectedBy"],
  itemId: FrmPRDTable["IDItem"],
) => {
  const request = new ssms.Request(requestSource);

  request.input("supervisorId", FrmPRDSSMSTypes.RejectedBy, supervisorId);
  request.input("itemId", FrmPRDSSMSTypes.IDItem, itemId);

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
  noPr: FrmPRDTable["NoPR"],
) => {
  const request = new ssms.Request(requestSource);

  request.input("noPr", FrmPRDSSMSTypes.NoPR, noPr);

  await request.query(
    `DELETE FROM frm_PR_D WHERE NoPR = @noPr;`,
  );

  return null;
};
