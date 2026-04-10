import type { RowDataPacket } from "mysql2";

export interface TypeTable extends RowDataPacket {
  IDType: number;
  TypeName: string;
}
