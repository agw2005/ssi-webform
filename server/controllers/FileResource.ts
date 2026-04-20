import ssms from "mssql";

const { NVarChar } = ssms;

export const FileResourceSSMSTypes = {
  FileResource: NVarChar(50),
  Description: NVarChar(50),
};
