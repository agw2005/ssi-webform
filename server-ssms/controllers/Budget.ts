import type { MsSqlResponse } from "@scope/server-ssms";
import type {
  BudgetBalance,
  BudgetNature,
  BudgetPeriod,
  BudgetTable,
  BudgetViewInformation,
  BudgetYear,
  ReportViewInformation,
  ValidCostCenter,
  ValidDepartment,
} from "../models/Budget.d.ts";
import ssms from "mssql";

const { VarChar, Numeric, Int } = ssms;

export const BudgetSSMSTypes = {
  CostCenter: VarChar(50),
  Nature: VarChar(50),
  Periode: VarChar(50),
  Budget: Numeric(18, 2),
  Balance: Numeric(18, 2),
  IDSection: Int(),
  FileResource: VarChar(50),
};

export const allFileResources = async (
  pool: ssms.ConnectionPool,
): Promise<MsSqlResponse<BudgetTable>> => {
  const result = await pool.request().query<BudgetTable>(`
    SELECT DISTINCT FileResource 
    FROM Budget
    WHERE FileResource <> ''
    ORDER BY FileResource ASC;`);

  const response: MsSqlResponse<BudgetTable> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response;
};

export const availableYears = async (
  pool: ssms.ConnectionPool,
): Promise<MsSqlResponse<BudgetYear>> => {
  const result = await pool.request().query<BudgetYear>(`
    SELECT DISTINCT SUBSTRING(Periode, 1, 4) AS Year
    FROM Budget
    WHERE Periode IS NOT NULL
    AND Periode <> '';`);

  const response: MsSqlResponse<BudgetYear> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response;
};

export const availablePeriods = async (
  pool: ssms.ConnectionPool,
): Promise<MsSqlResponse<BudgetPeriod>> => {
  const result = await pool.request().query<BudgetPeriod>(`
      SELECT DISTINCT LEFT(Periode, 6) AS Period
      FROM Budget
      WHERE Periode IS NOT NULL AND Periode <> ''
      ORDER BY Period DESC;`);

  const response: MsSqlResponse<BudgetPeriod> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response;
};

export const getValidNatures = async (
  pool: ssms.ConnectionPool,
  fullPeriode: string | null,
  fileResource: string | null,
  deptId: number | null,
  costCenter: string | null,
): Promise<MsSqlResponse<BudgetNature>> => {
  const request = pool.request();

  request.input("fullPeriode", BudgetSSMSTypes.Periode, fullPeriode);
  request.input("fileResource", BudgetSSMSTypes.FileResource, fileResource);
  request.input("deptId", BudgetSSMSTypes.IDSection, deptId);
  request.input("costCenter", BudgetSSMSTypes.CostCenter, costCenter);

  const result = await request.query<BudgetNature>(`
    SELECT DISTINCT Nature
    FROM Budget
    WHERE IDSection IS NOT NULL
    AND (@fullPeriode IS NULL OR Periode = @fullPeriode)
    AND (@fileResource IS NULL OR FileResource = @fileResource)
    AND (@deptId IS NULL OR IDSection = @deptId)
    AND (@costCenter IS NULL OR CostCenter = @costCenter)
    ORDER BY Nature;
  `);

  const response: MsSqlResponse<BudgetNature> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response;
};

export const singleBalance = async (
  pool: ssms.ConnectionPool | ssms.Transaction,
  costCenter: number,
  periode: string,
  nature: string,
  fileResource: string,
  departId: number,
): Promise<MsSqlResponse<BudgetBalance>> => {
  const request = pool.request();

  request.input("costCenter", BudgetSSMSTypes.CostCenter, costCenter);
  request.input("periode", BudgetSSMSTypes.Periode, periode);
  request.input("nature", BudgetSSMSTypes.Nature, nature);
  request.input("fileResource", BudgetSSMSTypes.FileResource, fileResource);
  request.input("departId", BudgetSSMSTypes.IDSection, departId);

  const result = await request.query<BudgetBalance>(`
    SELECT DISTINCT Balance
    FROM Budget
    WHERE CostCenter = @costCenter
    AND Periode = @periode
    AND Nature = @nature
    AND FileResource = @fileResource
    AND IDSection = @departId;
  `);

  const response: MsSqlResponse<BudgetBalance> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response;
};

export const getBudgetsByYear = async (
  pool: ssms.ConnectionPool,
  fileResource: string | null,
  year: string | null,
): Promise<MsSqlResponse<BudgetViewInformation>> => {
  const request = pool.request();

  request.input("fileResource", BudgetSSMSTypes.FileResource, fileResource);
  request.input("year", ssms.Int(), year ? parseInt(year, 10) : null);

  const result = await request.query<BudgetViewInformation>(`
    WITH CalculatedBudget AS (
      SELECT
        B.Periode AS DatabasePeriod,
        CAST(SUBSTRING(B.Periode, 7, 2) AS INT) AS MonthIndex,
        CASE 
          WHEN SUBSTRING(B.Periode, 5, 2) = 'LH' AND CAST(SUBSTRING(B.Periode, 7, 2) AS INT) < 6
          THEN CAST(SUBSTRING(B.Periode, 1, 4) AS INT) + 1
          ELSE CAST(SUBSTRING(B.Periode, 1, 4) AS INT)
        END AS PeriodYear,
        B.FileResource,
        B.IDSection AS Department,
        B.CostCenter,
        B.Nature,
        N.Description,
        B.Budget,
        B.Balance
      FROM Budget B
      INNER JOIN Nature N ON N.Nature = B.Nature
    )
    SELECT *
    FROM CalculatedBudget
    WHERE (@fileResource IS NULL OR FileResource = @fileResource)
      AND (@year IS NULL OR PeriodYear = @year)
    ORDER BY FileResource ASC;
  `);

  const response: MsSqlResponse<BudgetViewInformation> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response;
};

export const reportInformation = async (
  requestSource: ssms.Transaction | ssms.ConnectionPool,
  periode: string | null,
  fileResource: string | null,
): Promise<MsSqlResponse<ReportViewInformation>> => {
  const request = requestSource.request();

  request.input("periode", BudgetSSMSTypes.Periode, periode);
  request.input("fileResource", BudgetSSMSTypes.FileResource, fileResource);

  const result = await request.query<ReportViewInformation>(`
    SELECT
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
    FROM Budget
    INNER JOIN Nature
      ON Nature.Nature = Budget.Nature
    INNER JOIN FileResource
      ON FileResource.FileResource = Budget.FileResource
    WHERE (@periode IS NULL OR Budget.Periode LIKE @periode + '%')
    AND (@fileResource IS NULL OR Budget.FileResource = @fileResource);
  `);

  const response: MsSqlResponse<ReportViewInformation> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response;
};

export const patchRequestBudget = async (
  requestSource: ssms.Transaction,
  usage: number,
  costCenter: string,
  nature: string,
  period: string,
  fileResource: string,
  dept: string,
): Promise<MsSqlResponse<null>> => {
  const request = new ssms.Request(requestSource);

  request.input("usage", BudgetSSMSTypes.Budget, usage);
  request.input("costCenter", BudgetSSMSTypes.CostCenter, costCenter);
  request.input("nature", BudgetSSMSTypes.Nature, nature);
  request.input("period", BudgetSSMSTypes.Periode, period);
  request.input("fileResource", BudgetSSMSTypes.FileResource, fileResource);
  request.input("dept", BudgetSSMSTypes.IDSection, dept);

  const result = await request.query(
    `UPDATE Budget
      SET Balance = Balance - @usage
      WHERE
        CostCenter = @costCenter
        AND Nature = @nature 
        AND Periode = @period
        AND FileResource = @fileResource
        AND IDSection = @dept;`,
  );

  const response: MsSqlResponse<null> = {
    rowsReturned: [],
    rowsAffected: result.rowsAffected,
  };

  return response;
};

export const getSpecificBudgetData = async (
  requestSource: ssms.Transaction,
  costCenter: string,
  nature: string,
  periode: string,
  idSection: number,
  fileResource: string,
) => {
  const request = new ssms.Request(requestSource);

  request.input("costCenter", BudgetSSMSTypes.CostCenter, costCenter);
  request.input("nature", BudgetSSMSTypes.Nature, nature);
  request.input("periode", BudgetSSMSTypes.Periode, periode);
  request.input("idSection", BudgetSSMSTypes.IDSection, idSection);
  request.input("fileResource", BudgetSSMSTypes.FileResource, fileResource);

  const result = await request.query<BudgetTable>(
    `SELECT *
      FROM Budget
      WHERE
        CostCenter = @costCenter
        AND Nature = @nature
        AND Periode = @periode
        AND IDSection = @idSection
        AND FileResource = @fileResource;`,
  );

  const response: MsSqlResponse<BudgetTable> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response.rowsReturned[0];
};

export const patchSpecificBudgetNewBudget = async (
  requestSource: ssms.Transaction,
  data: BudgetTable,
) => {
  const request = new ssms.Request(requestSource);

  request.input("Budget", BudgetSSMSTypes.Budget, data.Budget);
  request.input("Balance", BudgetSSMSTypes.Balance, data.Balance);
  request.input("CostCenter", BudgetSSMSTypes.CostCenter, data.CostCenter);
  request.input("Nature", BudgetSSMSTypes.Nature, data.Nature);
  request.input("Periode", BudgetSSMSTypes.Periode, data.Periode);
  request.input("IDSection", BudgetSSMSTypes.IDSection, data.IDSection);
  request.input(
    "FileResource",
    BudgetSSMSTypes.FileResource,
    data.FileResource,
  );

  await request.query(
    `UPDATE Budget
      SET
        Budget = @Budget,
        Balance = @Balance
      WHERE
        CostCenter = @CostCenter
        AND Nature = @Nature
        AND Periode = @Periode
        AND IDSection = @IDSection
        AND FileResource = @FileResource;`,
  );

  return null;
};

export const postBudget = async (
  requestSource: ssms.Transaction,
  data: BudgetTable,
) => {
  const request = new ssms.Request(requestSource);

  request.input("CostCenter", BudgetSSMSTypes.CostCenter, data.CostCenter);
  request.input("Nature", BudgetSSMSTypes.Nature, data.Nature);
  request.input("Periode", BudgetSSMSTypes.Periode, data.Periode);
  request.input("Budget", BudgetSSMSTypes.Budget, data.Budget);
  request.input("Balance", BudgetSSMSTypes.Balance, data.Balance);
  request.input("IDSection", BudgetSSMSTypes.IDSection, data.IDSection);
  request.input(
    "FileResource",
    BudgetSSMSTypes.FileResource,
    data.FileResource,
  );

  await request.query(
    `INSERT INTO Budget
        (CostCenter, Nature, Periode, Budget, Balance, IDSection, FileResource)
      VALUES
        (@CostCenter, @Nature, @Periode, @Budget, @Balance, @IDSection, @FileResource);`,
  );

  return null;
};

export const getValidDepartments = async (
  pool: ssms.ConnectionPool,
  fullPeriode: string | null,
  fileResource: string | null,
) => {
  const request = pool.request();

  request.input("fullPeriode", BudgetSSMSTypes.Periode, fullPeriode);
  request.input("fileResource", BudgetSSMSTypes.FileResource, fileResource);

  const result = await pool.query<ValidDepartment>(
    `SELECT DISTINCT
        Budget.IDSection AS Identifier,
        frm_PR_NoPR.Description,
        frm_PR_NoPR.Dept
      FROM Budget
      INNER JOIN frm_PR_NoPR
        ON frm_PR_NoPR.CostCenter = Budget.IDSection
      WHERE IDSection IS NOT NULL
      AND (@fullPeriode IS NULL OR Periode = @fullPeriode)
      AND (@fileResource IS NULL OR FileResource = @fileResource)
      ORDER BY IDSection;`,
  );

  const response: MsSqlResponse<ValidDepartment> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response.rowsReturned;
};

export const getValidCostCenters = async (
  pool: ssms.ConnectionPool,
  fullPeriode: string | null,
  fileResource: string | null,
  deptId: number | null,
) => {
  const request = pool.request();

  request.input("fullPeriode", BudgetSSMSTypes.Periode, fullPeriode);
  request.input("fileResource", BudgetSSMSTypes.FileResource, fileResource);
  request.input("deptId", BudgetSSMSTypes.IDSection, deptId);

  const result = await pool.query<ValidCostCenter>(
    `SELECT DISTINCT
        Budget.CostCenter AS Identifier,
        Description
      FROM Budget
      INNER JOIN frm_PR_NoPR
        ON frm_PR_NoPR.CostCenter = Budget.CostCenter
      WHERE IDSection IS NOT NULL
        AND (@fullPeriode IS NULL OR Periode = @fullPeriode)
        AND (@fileResource IS NULL OR FileResource = @fileResource)
        AND (@deptId IS NULL OR IDSection = @deptId)
      ORDER BY Budget.CostCenter;`,
  );

  const response: MsSqlResponse<ValidCostCenter> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response.rowsReturned;
};
