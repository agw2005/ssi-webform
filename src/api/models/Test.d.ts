import { RowDataPacket } from "mysql2";

export interface TestTable extends RowDataPacket {
  first_word: string;
  second_word: string;
}
