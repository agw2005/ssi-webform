import type {
  AuthInfo,
  UserIdByName,
  UserMasterName,
} from "../models/UserMaster.d.ts";
import ssms from "mssql";
import type { MsSqlResponse } from "@scope/server-ssms";
import { SectionSSMSTypes } from "./Section.ts";

export const UserMasterSSMSTypes = {
  IDUser: ssms.Int(),
  UserName: ssms.VarChar(50),
  Password: ssms.VarChar(50),
  NameUser: ssms.VarChar(50),
  NRP: ssms.VarChar(50),
  IDSection: SectionSSMSTypes.IDSection,
  IDTitle: ssms.Int(),
  Email: ssms.VarChar(50),
  LastLogin: ssms.VarChar(50),
};

export const supervisorNames = async (
  pool: ssms.ConnectionPool,
): Promise<MsSqlResponse<UserMasterName>> => {
  const result = await pool.request().query<UserMasterName>(
    `SELECT NameUser, IDUser
    FROM UserMaster
    ORDER BY NameUser ASC`,
  );

  const response: MsSqlResponse<UserMasterName> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response;
};

export const getUserIdByName = async (
  requestSource: ssms.Transaction,
  nameUser: string,
): Promise<number> => {
  const request = requestSource.request();

  request.input("nameUser", UserMasterSSMSTypes.NameUser, `%${nameUser}%`);

  const result = await request.query<UserIdByName>(
    `SELECT TOP 1 IDUser
      FROM UserMaster
      WHERE NameUser LIKE @nameUser
      ORDER BY LEN(NRP) DESC;`,
  );

  const userId = result.recordset[0].IDUser;

  return userId;
};

export const getAuthInfo = async (
  pool: ssms.ConnectionPool,
): Promise<MsSqlResponse<AuthInfo>> => {
  const result = await pool.request().query<AuthInfo>(
    `SELECT 
        IDUser,
        UserName,
        Password,
        NameUser,
        NRP
      FROM UserMaster;`,
  );

  const response: MsSqlResponse<AuthInfo> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response;
};

export const patchNewLogin = async (
  pool: ssms.ConnectionPool,
  userId: number,
): Promise<null> => {
  const request = pool.request();

  const now = new Date();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const year = now.getFullYear();
  const hours = now.getHours() % 12 || 12;
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const cycle = now.getHours() >= 12 ? "PM" : "AM";

  const formattedNow =
    `${month}/${date}/${year} ${hours}:${minutes}:${seconds} ${cycle}`;

  request.input("now", UserMasterSSMSTypes.LastLogin, formattedNow);
  request.input("userId", UserMasterSSMSTypes.IDUser, userId);

  await request.query(
    `UPDATE UserMaster
      SET LastLogin = @now
      WHERE
        IDUser = @userId;`,
  );

  return null;
};
