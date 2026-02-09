import { RowDataPacket } from "mysql2";

export interface TraceDTable extends RowDataPacket {
  IDTrace: number;
  IDUser: number;
  Result: string;
  DateApprove: string;
  ApproverType: string;
  ApproverLevel: number;
}
