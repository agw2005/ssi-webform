import { RowDataPacket } from "mysql2";

export interface FrmPRNoPRTable extends RowDataPacket {
  ID: number;
  CostCenter: string;
  Dept: string;
  Description: string;
}
