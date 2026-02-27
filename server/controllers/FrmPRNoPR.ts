import type mysql from "mysql2/promise";
import type {
  FrmPRNoPRDepartment,
  FrmPRNoPRTable,
} from "../models/FrmPRNoPR.d.ts";

/**
 * A basic GET, affecting all attributes with pagination support.
 * @param pool An instance of mysql2 database pool
 * @param page The page of the GET
 * @param pagination The number of instances to GET
 * @returns An array of instances (all its attributes) and a metadata variable
 */
export const basicGet = async (
  pool: mysql.Pool,
  page: number,
  pagination: number = 50,
) => {
  const numRows = pagination;
  const [rows, metadata] = await pool.query<FrmPRNoPRTable[]>(
    `SELECT * 
    FROM frm_PR_NoPR
    LIMIT ? , ?`,
    [(page - 1) * numRows, numRows],
  );
  return [rows, metadata];
};

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
