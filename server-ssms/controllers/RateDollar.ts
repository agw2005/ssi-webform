import ssms from "mssql";
import type { MsSqlResponse, WebformDBForexResponse } from "@scope/server-ssms";

const { VarChar, Decimal } = ssms;

const _RateDollarTypes = {
  IDCur: VarChar(50),
  CurrencyName: VarChar(50),
  CurrencyValue: Decimal(18, 6),
};

export const getCurrentRateDollar = async (
  pool: ssms.ConnectionPool,
): Promise<MsSqlResponse<WebformDBForexResponse>> => {
  const result = await pool.request().query<WebformDBForexResponse>(`
    SELECT
      IDCur AS Currency,
      CurrencyValue AS Valuation
    FROM RateDollar;
    `);

  const response: MsSqlResponse<WebformDBForexResponse> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response;
};

export const renewRateDollar = async (
  pool: ssms.ConnectionPool,
): Promise<number> => {
  const result = await pool.request().query(`
    UPDATE RateDollar
    SET
      RateDollar.CurrencyValue = RateDollarTemp.CurrencyValue
    FROM RateDollar
    INNER JOIN RateDollarTemp
      ON RateDollar.IDCur = RateDollarTemp.IDCur;
    `);

  return result.rowsAffected[0];
};
