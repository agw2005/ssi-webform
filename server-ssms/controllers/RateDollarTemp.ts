import ssms from "mssql";
import type { WebformDBForexResponse } from "@scope/server-ssms";

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
): Promise<null> => {
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

  const rowsAffected = result.rowsAffected;

  console.log(rowsAffected);

  return null;
};
