import type { RowDataPacket } from "mysql2";

export interface NatureTable extends RowDataPacket {
  Nature: string;
  Description: string;
  DeptGroup: string;
}
