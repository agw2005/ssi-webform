import type mysql from "mysql2/promise";
import type {
  FrmPRHTable,
  RequestItemsAtBudgetView,
} from "../models/FrmPRH.d.ts";

export const basicGet = async (
  pool: mysql.Pool,
  page: number,
  pagination: number = 50,
) => {
  const numRows = pagination;
  const [rows, metadata] = await pool.query<FrmPRHTable[]>(
    `SELECT * 
    FROM frm_PR_H
    LIMIT ? , ?`,
    [(page - 1) * numRows, numRows],
  );
  return [rows, metadata];
};

export const getRequestItemForBudgetView = async (
  pool: mysql.Pool,
  nature: string | null,
  costCenter: string | null,
  startDate: string | null,
  endDate: string | null,
) => {
  const [rows, metadata] = await pool.query<RequestItemsAtBudgetView[]>(
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
    WHERE frm_PR_D.Nature = ?
      AND frm_PR_D.CostCenter = ?
      AND Trace.SubmitDate
        BETWEEN ? AND ?;`,
    [nature, costCenter, startDate, endDate],
  );
  return [rows, metadata];
};
