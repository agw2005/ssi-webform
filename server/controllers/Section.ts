import type {
  SectionId,
  SectionName,
  SectionTable,
  UserSection,
} from "../models/Section.d.ts";
import type { MsSqlResponse } from "@scope/server";
import ssms from "mssql";

const { Int, VarChar } = ssms;

export const SectionSSMSTypes = {
  IDSection: Int(),
  SectionName: VarChar(50),
  FileResource: VarChar(50),
};

export const sectionNames = async (
  transaction: ssms.Transaction,
): Promise<MsSqlResponse<SectionName>> => {
  const result = await transaction.request().query<SectionName>(
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
  transaction: ssms.Transaction,
): Promise<MsSqlResponse<UserSection>> => {
  const result = await transaction.request().query<UserSection>(
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
  transaction: ssms.Transaction,
  sectionName: SectionTable["SectionName"],
): Promise<number> => {
  const request = transaction.request();

  request.input("sectionName", SectionSSMSTypes.SectionName, sectionName);

  const result = await request.query<SectionId>(
    `SELECT IDSection FROM Section WHERE SectionName LIKE @sectionName;`,
  );

  const response: MsSqlResponse<SectionId> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response.rowsReturned[0].IDSection;
};
