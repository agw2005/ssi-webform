import { RowDataPacket } from "mysql2";

export interface SectionTable extends RowDataPacket {
  IDSection: number;
  SectionName: string;
  FileResource: string;
}
