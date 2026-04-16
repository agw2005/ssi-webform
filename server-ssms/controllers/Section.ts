import type {
  SectionId,
  SectionName,
  SectionTable,
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
  sectionName: SectionTable["SectionName"],
): Promise<number> => {
  const request = requestSource.request();

  request.input("sectionName", SectionSSMSTypes.IDSection, sectionName);

  const result = await request.query<SectionId>(
    `SELECT IDSection FROM Section WHERE SectionName LIKE @sectionName;`,
  );

  const response: MsSqlResponse<SectionId> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response.rowsReturned[0].IDSection;
};
