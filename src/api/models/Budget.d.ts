import { RowDataPacket } from "mysql2";

export interface BudgetTable extends RowDataPacket {
  CostCenter: string;
  Nature: string;
  Periode: string;
  Budget: number;
  Balance: number;
  IDSection: number;
  FileResource: number;
}
