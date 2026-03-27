import type mysql from "mysql2/promise";
import type {
  UserMasterName,
  UserIdByName,
  AuthInfo,
} from "../models/UserMaster.d.ts";
import type { FieldPacket } from "mysql2/promise.js";

/**
 * GET all instance NRP and password.
 * @param pool An instance of mysql2 database pool
 * @returns An array of usermaster, containing its NRP and password, and a metadata variable
 */
export const supervisorNames = async (pool: mysql.Pool) => {
  const [rows, metadata] = await pool.query<UserMasterName[]>(
    `SELECT NameUser, IDUser
    FROM UserMaster
    ORDER BY NameUser ASC`,
  );
  return [rows, metadata];
};

export const getUserIdByName = async (
  pool: mysql.Pool,
  nameUser: string,
): Promise<number> => {
  const [rows] = await pool.query<UserIdByName[]>(
    `SELECT IDUser
    FROM UserMaster
    WHERE NameUser LIKE ?
    ORDER BY LENGTH(NRP) DESC
    LIMIT 1;`,
    [`%${nameUser}%`],
  );
  const userId = rows[0].IDUser || 0;

  return userId;
};

export const getAuthInfo = async (
  pool: mysql.Pool,
): Promise<[AuthInfo[], FieldPacket[]]> => {
  const [rows, metadata] = await pool.query<AuthInfo[]>(
    `SELECT 
        IDUser,
        UserName,
        Password,
        NameUser,
        NRP
      FROM UserMaster;`,
    [],
  );

  return [rows, metadata];
};

export const patchNewLogin = async (
  pool: mysql.Pool,
  userId: number,
): Promise<null> => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const year = now.getFullYear();
  const hours = now.getHours() % 12 || 12;
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const cycle = now.getHours() >= 12 ? "PM" : "AM";

  const formattedNow = `${month}/${date}/${year} ${hours}:${minutes}:${seconds} ${cycle}`;

  await pool.query(
    `UPDATE UserMaster
      SET LastLogin = ?
      WHERE
        IDUser = ?;`,
    [formattedNow, userId],
  );

  return null;
};
