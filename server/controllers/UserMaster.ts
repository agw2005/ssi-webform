import type mysql from "mysql2/promise";
import type {
  UserMasterAuthInformation,
  UserMasterName,
  UserMasterTable,
} from "../models/UserMaster.d.ts";

/**
 * A basic GET, affecting all attributes with pagination support.
 * @param pool An instance of mysql2 database pool
 * @param page The page of the GET
 * @param pagination The number of instances to GET
 * @returns An array of instances (all its attributes) and a metadata variable
 */
export const basicGet = async (
  pool: mysql.Pool,
  page: number,
  pagination: number = 50,
) => {
  const numRows = pagination;
  const [rows, metadata] = await pool.query<UserMasterTable[]>(
    `SELECT * 
    FROM UserMaster
    LIMIT ? , ?`,
    [(page - 1) * numRows, numRows],
  );
  return [rows, metadata];
};

/**
 * GET all instance NRP and password.
 * @param pool An instance of mysql2 database pool
 * @returns An array of usermaster, containing its NRP and password, and a metadata variable
 */
export const authInformation = async (
  pool: mysql.Pool,
  page: number,
  pagination: number = 50,
) => {
  const numRows = pagination;
  const [rows, metadata] = await pool.query<UserMasterAuthInformation[]>(
    `SELECT Password, NRP 
    FROM UserMaster
    LIMIT ? , ?`,
    [(page - 1) * numRows, numRows],
  );
  return [rows, metadata];
};

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
