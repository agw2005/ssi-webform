import type { RowDataPacket } from "mysql2";

/**
 * Interface of the `frm_PR_NoPR` table.
 */
export interface FrmPRNoPRTable extends RowDataPacket {
  ID: number;
  CostCenter: string;
  Dept: string;
  Description: string;
}

/**
 * Interface for the `frm_PR_NoPR` table used to get the departments.
 */
export interface FrmPRNoPRDepartment extends RowDataPacket {
  CostCenter: string;
  Description: string;
  Dept: string;
}
