import type {
  SectionId,
  SectionName,
  UserSection,
} from "../models/Section.d.ts";
import type { MsSqlResponse } from "@scope/server-ssms";
import ssms from "mssql";

const { Int, VarChar } = ssms;

export const SectionSSMSTypes = {
  IDSection: Int(),
  SectionName: VarChar(50),
  FileResource: VarChar(50),
};

export const sectionNames = async (
  pool: ssms.ConnectionPool,
): Promise<MsSqlResponse<SectionName>> => {
  const result = await pool.request().query<SectionName>(
    `SELECT IDSection, SectionName
      FROM Section`,
  );

  const response: MsSqlResponse<SectionName> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response;
};

export const userSectionMappings = async (
  pool: ssms.ConnectionPool,
): Promise<MsSqlResponse<UserSection>> => {
  const result = await pool.request().query<UserSection>(
    `SELECT Section.SectionName, UserMaster.NameUser
      FROM Section
      INNER JOIN UserMaster
        ON Section.IDSection = UserMaster.IDSection;`,
  );

  const response: MsSqlResponse<UserSection> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response;
};

export const getSectionIdByName = async (
  requestSource: ssms.Transaction,
  sectionName: string,
): Promise<number> => {
  const request = requestSource.request();

  request.input("monthLetter", SectionSSMSTypes.IDSection, sectionName);

  const result = await new ssms.Request(requestSource).query<SectionId>(
    `SELECT IDSection FROM Section WHERE SectionName LIKE @sectionName;`,
  );
  return result.recordset[0].IDSection;
};
