import ssms from "mssql";
import type { DBForexResponse, MsSqlResponse } from "@scope/server";

const { VarChar, Decimal } = ssms;

const _RateDollarTypes = {
  IDCur: VarChar(50),
  CurrencyName: VarChar(50),
  CurrencyValue: Decimal(18, 6),
};

export const getCurrentRateDollar = async (
  transaction: ssms.Transaction,
): Promise<MsSqlResponse<DBForexResponse>> => {
  const result = await transaction.request().query<DBForexResponse>(`
    SELECT
      IDCur AS Currency,
      CurrencyValue AS Valuation
    FROM RateDollar;
    `);

  const response: MsSqlResponse<DBForexResponse> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response;
};

export const renewRateDollar = async (
  transaction: ssms.Transaction,
): Promise<number> => {
  const result = await transaction.request().query(`
    UPDATE RateDollar
    SET
      RateDollar.CurrencyValue = RateDollarTemp.CurrencyValue
    FROM RateDollar
    INNER JOIN RateDollarTemp
      ON RateDollar.IDCur = RateDollarTemp.IDCur;
    `);

  return result.rowsAffected[0];
};
