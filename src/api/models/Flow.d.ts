import { RowDataPacket } from "mysql2";

export interface FlowTable extends RowDataPacket {
  IDFlow: number;
  IDForm: number;
  IDSection: number;
  IDUser: number;
  ApproverType: string;
  ApproverLevel: number;
}
