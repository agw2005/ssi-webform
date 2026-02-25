import type { RowDataPacket } from "mysql2";

/**
 * Interface of the `Section` table.
 */
export interface SectionTable extends RowDataPacket {
  IDSection: number;
  SectionName: string;
  FileResource: string;
}

/**
 * Interface for the `Section` table used to get the section names.
 */
export interface SectionNames extends RowDataPacket {
  IDSection: number;
  SectionName: string;
}
