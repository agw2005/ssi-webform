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
