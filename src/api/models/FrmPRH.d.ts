import { RowDataPacket } from "mysql2";

export interface FrmPRHTable extends RowDataPacket {
  ID: number;
  NoForm: string;
  Requestor: string;
  NRP: string;
  Section: string;
  NoPR: string;
  Subject: string;
  Amount: number;
  ReturnOnOutgoing: string;
  Remarks: string;
}
