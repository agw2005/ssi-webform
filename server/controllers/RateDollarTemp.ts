import ssms from "mssql";
import type { DBForexResponse, MsSqlResponse } from "@scope/server";

const { VarChar, Decimal } = ssms;

const RateDollarTempTypes = {
  IDCur: VarChar(50),
  CurrencyName: VarChar(50),
  CurrencyValue: Decimal(18, 6),
};

export const patchRateDollarTemp = async (
  transaction: ssms.Transaction,
  currency: "IDR" | "JPY" | "SGD" | "USD",
  newValue: number,
): Promise<number> => {
  const request = transaction.request();

  request.input(
    "currency",
    RateDollarTempTypes.IDCur,
    currency === "JPY" ? "YEN" : currency,
  );
  request.input("newValue", RateDollarTempTypes.CurrencyValue, newValue);

  const result = await request.query<DBForexResponse>(`
    UPDATE RateDollarTemp
    SET
      CurrencyValue = @newValue
    WHERE IDCur = @currency;
    `);

  const rowsAffected = result.rowsAffected[0];

  return rowsAffected;
};

export const getCurrentRateDollarTemp = async (
  transaction: ssms.Transaction,
): Promise<MsSqlResponse<DBForexResponse>> => {
  const result = await transaction.request().query<DBForexResponse>(`
    SELECT
      IDCur AS Currency,
      CurrencyValue AS Valuation
    FROM RateDollarTemp;
    `);

  const response: MsSqlResponse<DBForexResponse> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response;
};
