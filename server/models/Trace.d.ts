import type { RowDataPacket } from "mysql2";

export interface TraceTable extends RowDataPacket {
  IDTrace: number;
  IDForm: number;
  FormTable: string;
  NoForm: string;
  Requestor: string;
  IDSection: string;
  NRP: string;
  Ext: string;
  EmailReq: string;
  Status: string;
  SubmitDate: string;
  ProcessedBy: string;
  ProcessedLevel: string;
  LevelProgress: string;
  Remarks: string;
}
