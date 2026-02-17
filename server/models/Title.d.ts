import type { RowDataPacket } from "mysql2";

export interface TitleTable extends RowDataPacket {
  IDTitle: number;
  Title: string;
  LevelTitle: number;
}
