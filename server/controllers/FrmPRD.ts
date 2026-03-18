import type mysql from "mysql2/promise";
import type { FrmPRDRequestItem, FrmPRDTable } from "../models/FrmPRD.d.ts";
import type { ResultSetHeader } from "mysql2/promise.js";

export const basicGet = async (
  pool: mysql.Pool,
  page: number,
  pagination: number = 50,
) => {
  const numRows = pagination;
  const [rows, metadata] = await pool.query<FrmPRDTable[]>(
    `SELECT * 
    FROM frm_PR_D
    LIMIT ? , ?`,
    [(page - 1) * numRows, numRows],
  );
  return [rows, metadata];
};

export const getAllRequestItems = async (pool: mysql.Pool, traceId: number) => {
  const [rows, metadata] = await pool.query<FrmPRDRequestItem[]>(
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
    WHERE Trace.IDTrace = ?;`,
    [traceId],
  );
  return [rows, metadata];
};

export const postUsage = async (
  pool: mysql.Pool,
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
  const NetPrice = (quantity * unitPrice) / rateByCurrency;

  const [rows, _metadata] = await pool.execute<ResultSetHeader>(
    `INSERT INTO frm_PR_D 
      (NoPR, AcctAssgCategory, CostCenter, Nature, Description, Qty, Measure, UnitPrice, Currency, EstimationDeliveryDate, Vendor, Reason, StatusItem, RejectedBy, Supplier, NetPrice, DeliveryDate, NoPO, Rate, IDBudget)
      VALUES (? , '' , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , 'False' , '' , '' , ROUND( ? , 2 ) , NULL , '' , ? , ?);
    `,
    [
      noPR,
      costCenter,
      nature,
      description,
      quantity,
      measure,
      unitPrice,
      currency,
      estimatedDeliveryDate,
      vendor,
      reason,
      NetPrice,
      rateByCurrency,
      budgetId,
    ],
  );

  const newIdItem = rows.insertId;
  return newIdItem;
};
