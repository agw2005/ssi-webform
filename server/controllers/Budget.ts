import type mysql from "mysql2/promise";
import type {
  BudgetBalance,
  BudgetNature,
  BudgetPeriod,
  BudgetTable,
  BudgetViewInformation,
  ReportViewInformation,
} from "../models/Budget.d.ts";
import type { ResultSetHeader } from "mysql2/promise.js";

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

/**
 * GET an instance of balance by a the cost center, periode, and nature.
 * @param pool An instance of mysql2 database pool
 * @param costCenter A valid cost center value
 * @param periode A valid periode value
 * @param nature A valid nature value
 * @returns An array of budget, containing a single balance and a metadata variable
 */
export const singleBalance = async (
  pool: mysql.Pool,
  costCenter: number,
  periode: string,
  nature: string,
) => {
  const [rows, metadata] = await pool.query<BudgetBalance[]>(
    `SELECT DISTINCT Balance
    FROM Budget
    WHERE CostCenter = ?
    AND Periode = ?
    AND Nature = ?`,
    [costCenter, periode, nature],
  );
  return [rows, metadata];
};

/**
 * GET an instance of budget that contains information to be served in the budget view of the Budget page.
 * @param pool An instance of mysql2 database pool
 * @param periode A valid cost center value
 * @param fileResource A valid periode value
 * @returns An array of budget, containing a single balance and a metadata variable
 */
export const viewInformation = async (
  pool: mysql.Pool,
  periode: string | null,
  fileResource: string | null,
) => {
  const [rows, metadata] = await pool.query<BudgetViewInformation[]>(
    `SELECT
      Budget.Periode,
      Budget.FileResource,
      Budget.IDSection AS Department,
      Budget.CostCenter,
      Budget.Nature,
      Nature.Description,
      Budget.Budget,
      Budget.Balance
    From Budget
    INNER JOIN Nature
      ON Nature.Nature = Budget.Nature
    WHERE (? IS NULL OR Budget.Periode LIKE CONCAT( ? , '%' ))
    AND (? IS NULL OR Budget.FileResource = ?);`,
    [periode, periode, fileResource, fileResource],
  );
  return [rows, metadata];
};

/**
 * GET an instance of budget that contains information to be served in the report view of the Budget page.
 * @param pool An instance of mysql2 database pool
 * @param periode A valid cost center value
 * @param fileResource A valid periode value
 * @returns An array of budget, containing some budget and balance and a metadata variable
 */
export const reportInformation = async (
  pool: mysql.Pool,
  periode: string | null,
  fileResource: string | null,
) => {
  const [rows, metadata] = await pool.query<ReportViewInformation[]>(
    `SELECT
      Budget.Periode,
      Budget.FileResource,
      FileResource.Description AS ResourceName,
      Budget.IDSection AS Department,
      Nature.DeptGroup AS DepartmentGroup,
      Budget.CostCenter,
      Budget.Nature,
      Nature.Description,
      Budget.Budget,
      Budget.Balance
    From Budget
    INNER JOIN Nature
      ON Nature.Nature = Budget.Nature
	  INNER JOIN FileResource
      ON FileResource.FileResource = Budget.FileResource
    WHERE (? IS NULL OR Budget.Periode LIKE CONCAT( ? , '%' ))
    AND (? IS NULL OR Budget.FileResource = ?);`,
    [periode, periode, fileResource, fileResource],
  );
  return [rows, metadata];
};

export const patchRequestBudget = async (
  pool: mysql.Pool,
  usage: number,
  costCenter: string,
  nature: string,
  period: string,
) => {
  const [rows, metadata] = await pool.query<ResultSetHeader>(
    `UPDATE Budget
      SET Balance = Balance - ?
      WHERE
        CostCenter = ?
        AND Nature = ? 
        AND Periode = ?`,
    [usage, costCenter, nature, period],
  );
  return [rows, metadata];
};
