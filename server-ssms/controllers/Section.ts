import type mysql from "mysql2/promise";
import type {
  SectionId,
  SectionName,
  UserSection,
} from "../models/Section.d.ts";

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

export const getSectionIdByName = async (
  pool: mysql.PoolConnection,
  sectionName: string,
): Promise<number> => {
  const [rows, _metadata] = await pool.query<SectionId[]>(
    `SELECT IDSection FROM Section WHERE SectionName LIKE ?;`,
    [sectionName],
  );
  return rows[0].IDSection;
};
