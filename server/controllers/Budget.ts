import type mysql from "mysql2/promise";
import type {
  BudgetNature,
  BudgetPeriod,
  BudgetTable,
} from "../models/Budget.d.ts";

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
  const [rows, metadata] = await pool.query<BudgetTable[]>(
    `SELECT * 
    FROM Budget
    LIMIT ? , ?`,
    [(page - 1) * numRows, numRows],
  );
  return [rows, metadata];
};

/**
 * GET all instance of file resources (for some reason all 25 file resources are in the Budget table rather than the FileResource table).
 * @param pool An instance of mysql2 database pool
 * @returns An array of budget, containing its file resources and a metadata variable
 */
export const allFileResources = async (pool: mysql.Pool) => {
  const [rows, metadata] = await pool.query<BudgetTable[]>(
    `SELECT DISTINCT FileResource 
    FROM Budget
    WHERE FileResource <> ''
    ORDER BY FileResource ASC`,
  );
  return [rows, metadata];
};

/**
 * GET all instance of available periods.
 * @param pool An instance of mysql2 database pool
 * @returns An array of budget, containing its periods and a metadata variable
 */
export const allPeriods = async (pool: mysql.Pool) => {
  const [rows, metadata] = await pool.query<BudgetPeriod[]>(
    `SELECT DISTINCT SUBSTRING(Periode, 1, 6) AS Period
    FROM Budget
    WHERE Periode IS NOT NULL AND Periode <> ''
    ORDER BY Period DESC`,
  );
  return [rows, metadata];
};

/**
 * GET all instance of available natures by a single cost center.
 * @param pool An instance of mysql2 database pool
 * @param costCenter A valid cost center value
 * @returns An array of budget, containing all the natures of a cost center and a metadata variable
 */
export const natureByCostCenter = async (
  pool: mysql.Pool,
  costCenter: number,
) => {
  const [rows, metadata] = await pool.query<BudgetNature[]>(
    `SELECT DISTINCT Nature
    FROM Budget
    WHERE CostCenter = ?
    ORDER BY Nature DESC`,
    [costCenter],
  );
  return [rows, metadata];
};
