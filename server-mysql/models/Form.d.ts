import type { RowDataPacket } from "mysql2";

export interface FormTable extends RowDataPacket {
  IDForm: number;
  KodeForm: string;
  FormName: string;
  IDSection: number;
  IDType: number;
  ControlName: string;
  FormTable: string;
  TypeFill: string;
}
