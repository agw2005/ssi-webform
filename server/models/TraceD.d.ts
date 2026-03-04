import type { RowDataPacket } from "mysql2";

export interface TraceDTable extends RowDataPacket {
  IDTrace: number;
  IDUser: number;
  Result: string;
  DateApprove: string;
  ApproverType: string;
  ApproverLevel: number;
}

export interface TraceApproverPath extends RowDataPacket {
  Result: string;
  ApproverType: string;
  DateApprove: string;
  NRP: string;
  NameUser: string;
}
