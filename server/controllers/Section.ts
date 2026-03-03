import type mysql from "mysql2/promise";
import type {
  SectionName,
  SectionTable,
  UserSection,
} from "../models/Section.d.ts";

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
  const [rows, metadata] = await pool.query<SectionTable[]>(
    `SELECT * 
    FROM Section
    LIMIT ? , ?`,
    [(page - 1) * numRows, numRows],
  );
  return [rows, metadata];
};

/**
 * GET all instance names and its identifier.
 * @param pool An instance of mysql2 database pool
 * @returns An array of section, containing its section name and identifier, and a metadata variable
 */
export const sectionNames = async (pool: mysql.Pool) => {
  const [rows, metadata] = await pool.query<SectionName[]>(
    `SELECT IDSection, SectionName
    FROM Section`,
  );
  return [rows, metadata];
};

/**
 * GET all instance of section name and the user name.
 * @param pool An instance of mysql2 database pool
 * @returns An array of section, containing its section name and the user name, and a metadata variable
 */
export const userSectionMappings = async (pool: mysql.Pool) => {
  const [rows, metadata] = await pool.query<UserSection[]>(
    `SELECT Section.SectionName, UserMaster.NameUser
    FROM Section
    INNER JOIN UserMaster
    ON Section.IDSection = UserMaster.IDSection;`,
  );
  return [rows, metadata];
};
