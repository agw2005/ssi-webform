import type mysql from "mysql2/promise";
import type {
  BudgetBalance,
  BudgetNature,
  BudgetTable,
  BudgetViewInformation,
  BudgetYear,
  ReportViewInformation,
} from "../models/Budget.d.ts";
import type { ResultSetHeader } from "mysql2/promise.js";

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
export const availableYears = async (pool: mysql.Pool) => {
  const [rows, metadata] = await pool.query<BudgetYear[]>(
    `SELECT DISTINCT SUBSTRING(Periode, 1, 4) AS Year
    FROM Budget
    WHERE Periode IS NOT NULL AND Periode <> '';`,
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
  pool: mysql.PoolConnection | mysql.Pool,
  costCenter: number,
  periode: string,
  nature: string,
): Promise<[BudgetBalance[], mysql.FieldPacket[]]> => {
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
export const getBudgetsByYear = async (
  pool: mysql.Pool,
  fileResource: string | null,
  year: string | null,
) => {
  const [rows, metadata] = await pool.query<BudgetViewInformation[]>(
    `SELECT
      Budget.Periode AS DatabasePeriod,
      CAST(SUBSTRING(Periode, 7, 2) AS UNSIGNED) AS MonthIndex,
      IF(
          SUBSTRING(Periode, 5, 2) = 'LH' AND CAST(SUBSTRING(Periode, 7, 2) AS UNSIGNED) < 6,
          CAST(SUBSTRING(Periode, 1, 4) AS UNSIGNED)+1,
          CAST(SUBSTRING(Periode, 1, 4) AS UNSIGNED)
      ) AS PeriodYear,
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
    WHERE (? IS NULL OR Budget.FileResource = ?)
    AND IF(
        SUBSTRING(Budget.Periode, 5, 2) = 'LH' AND CAST(SUBSTRING(Budget.Periode, 7, 2) AS UNSIGNED) < 6,
        CAST(SUBSTRING(Budget.Periode, 1, 4) AS UNSIGNED) + 1,
        CAST(SUBSTRING(Budget.Periode, 1, 4) AS UNSIGNED)
    ) = ?
    ORDER BY PeriodYear DESC, MonthIndex DESC;`,
    [fileResource, fileResource, year],
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
  pool: mysql.PoolConnection,
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
