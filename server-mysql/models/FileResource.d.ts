import type { RowDataPacket } from "mysql2";

export interface FileResourceTable extends RowDataPacket {
  FileResource: string;
  Description: string;
}
