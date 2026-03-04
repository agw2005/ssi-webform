import type mysql from "mysql2/promise";
import type { FrmPRDRequestItem, FrmPRDTable } from "../models/FrmPRD.d.ts";

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
