import type { RowDataPacket } from "mysql2";

/**
 * Interface of the `UserMaster` table.
 */
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

/**
 * Interface for the `UserMaster` table used to get the user names.
 */
export interface UserMasterName extends RowDataPacket {
  NameUser: string;
  IDUser: number;
}

export interface UserIdByName extends RowDataPacket {
  IDUser: number;
}

export interface AuthInfo extends RowDataPacket {
  IDUser: number;
  UserName: string;
  Password: string;
  NameUser: string;
  NRP: string;
}
