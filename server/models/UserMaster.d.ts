import type { RowDataPacket } from "mysql2";

export interface UserMasterTable extends RowDataPacket {
  IDUser: number;
  UserName: string;
  Password: string;
  NameUser: string;
  NRP: string;
  IDSection: number;
  IDTitle: number;
  Email: string;
  LastLogin: string;
}

export interface UserMasterAuthInformation extends RowDataPacket {
  Password: string;
  NRP: string;
}
