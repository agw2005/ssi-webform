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

export interface NextApproverPath extends RowDataPacket {
  NextIDUser: number | null;
  NextApproverLevel: number | null;
}

export interface OtherApproverPathInfo extends RowDataPacket {
  Summed: number;
  Maxxed: number;
}
