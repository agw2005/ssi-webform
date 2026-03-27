import type mysql from "mysql2/promise";
import type { FrmPRNoPRDepartment } from "../models/FrmPRNoPR.d.ts";

/**
 * GET all instance of available departments.
 * @param pool An instance of mysql2 database pool
 * @returns An array of frm_PR_NoPR, containing its departments and a metadata variable
 */
export const allDepartments = async (pool: mysql.Pool) => {
  const [rows, metadata] = await pool.query<FrmPRNoPRDepartment[]>(
    `SELECT DISTINCT CostCenter, Description, Dept
    FROM frm_PR_NoPR
    ORDER BY CostCenter ASC`,
  );
  return [rows, metadata];
};
