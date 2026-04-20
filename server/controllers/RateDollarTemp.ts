import ssms from "mssql";
import type { MsSqlResponse, WebformDBForexResponse } from "@scope/server";

const { VarChar, Decimal } = ssms;

const RateDollarTempTypes = {
  IDCur: VarChar(50),
  CurrencyName: VarChar(50),
  CurrencyValue: Decimal(18, 6),
};

export const patchRateDollarTemp = async (
  pool: ssms.ConnectionPool,
  currency: "IDR" | "JPY" | "SGD" | "USD",
  newValue: number,
): Promise<number> => {
  const request = pool.request();

  request.input(
    "currency",
    RateDollarTempTypes.IDCur,
    currency === "JPY" ? "YEN" : currency,
  );
  request.input("newValue", RateDollarTempTypes.CurrencyValue, newValue);

  const result = await request.query<WebformDBForexResponse>(`
    UPDATE RateDollarTemp
    SET
      CurrencyValue = @newValue
    WHERE IDCur = @currency;
    `);

  const rowsAffected = result.rowsAffected[0];

  return rowsAffected;
};

export const getCurrentRateDollarTemp = async (
  pool: ssms.ConnectionPool,
): Promise<MsSqlResponse<WebformDBForexResponse>> => {
  const result = await pool.request().query<WebformDBForexResponse>(`
    SELECT
      IDCur AS Currency,
      CurrencyValue AS Valuation
    FROM RateDollarTemp;
    `);

  const response: MsSqlResponse<WebformDBForexResponse> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response;
};
