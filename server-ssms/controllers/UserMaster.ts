import type {
  AuthInfo,
  UserIdByName,
  UserMasterName,
  UserMasterTable,
} from "../models/UserMaster.d.ts";
import type { MsSqlResponse } from "@scope/server-ssms";
import ssms from "mssql";

const { Int, VarChar } = ssms;

export const UserMasterSSMSTypes = {
  IDUser: Int(),
  UserName: VarChar(50),
  Password: VarChar(50),
  NameUser: VarChar(50),
  NRP: VarChar(50),
  IDSection: Int(),
  IDTitle: Int(),
  Email: VarChar(50),
  LastLogin: VarChar(50),
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

export const getUserInfoByNRP = async (
  pool: ssms.ConnectionPool,
  nrp: UserMasterTable["NRP"][],
): Promise<MsSqlResponse<UserMasterName>> => {
  const request = pool.request();

  const paramNames: UserMasterTable["NRP"][] = [];

  nrp.forEach((value, i) => {
    const paramName = `nrp${i}`;
    request.input(paramName, VarChar(50), value);
    paramNames.push(`@${paramName}`);
  });

  const params = paramNames.join(", ");

  const result = await pool.request().query<UserMasterName>(
    `SELECT NameUser, IDUser
    FROM UserMaster
    WHERE NRP IN (${params})
    ORDER BY IDUser DESC`,
  );

  const response: MsSqlResponse<UserMasterName> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response;
};

export const getUserIdByName = async (
  requestSource: ssms.Transaction,
  nameUser: UserMasterTable["NameUser"],
) => {
  const request = requestSource.request();

  request.input("nameUser", UserMasterSSMSTypes.NameUser, `%${nameUser}%`);

  const result = await request.query<UserIdByName>(
    `SELECT TOP 1 IDUser
      FROM UserMaster
      WHERE NameUser LIKE @nameUser
      ORDER BY LEN(NRP) DESC;`,
  );

  const userId = result.recordset[0].IDUser;

  return { rowsAffected: result.rowsAffected, userId };
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
  userId: UserMasterTable["IDUser"],
): Promise<number> => {
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

  const result = await request.query(
    `UPDATE UserMaster
      SET LastLogin = @now
      WHERE
        IDUser = @userId;`,
  );

  return result.rowsAffected[0];
};
