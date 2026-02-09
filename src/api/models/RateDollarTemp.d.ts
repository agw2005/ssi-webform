import { RowDataPacket } from "mysql2";

export interface RateDollarTempTable extends RowDataPacket {
  IDCur: string;
  CurrencyName: string;
  CurrencyValue: number;
}
