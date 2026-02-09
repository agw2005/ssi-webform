import { RowDataPacket } from "mysql2";

export interface RateDollarTable extends RowDataPacket {
  IDCur: string;
  CurrencyName: string;
  CurrencyValue: number;
}
