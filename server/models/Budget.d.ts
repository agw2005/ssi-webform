import type { RowDataPacket } from "mysql2";

/**
 * Interface of the `Budget` table.
 */
export interface BudgetTable extends RowDataPacket {
  CostCenter: string;
  Nature: string;
  Periode: string;
  Budget: number;
  Balance: number;
  IDSection: number;
  FileResource: number;
}

/**
 * Interface for the `Budget` table used to get the file resources.
 */
export interface BudgetFileResource extends RowDataPacket {
  FileResource: string;
}

/**
 * Interface for the `Budget` table used to get the natures.
 */
export interface BudgetNature extends RowDataPacket {
  Nature: string;
}

/**
 * Interface for the `Budget` table used to get the balance.
 */
export interface BudgetBalance extends RowDataPacket {
  Balance: string;
}

/**
 * Interface for the `Budget` table used to get the balance.
 */
export interface BudgetViewInformation extends RowDataPacket {
  DatabasePeriod: string;
  MonthIndex: number;
  PeriodYear: number;
  FileResource: string;
  Department: number;
  CostCenter: string;
  Nature: string;
  Description: string;
  Budget: number;
  Balance: number;
}

/**
 * Interface for the `Budget` table used for the report view of the Budget page.
 */
export interface ReportViewInformation extends RowDataPacket {
  Periode: string;
  FileResource: string;
  ResourceName: string;
  Department: number;
  DepartmentGroup: string;
  CostCenter: string;
  Nature: string;
  Description: string;
  Budget: number;
  Balance: number;
}

export interface BudgetYear extends RowDataPacket {
  Year: string;
}

export interface BudgetPeriod extends RowDataPacket {
  Period: string;
}
