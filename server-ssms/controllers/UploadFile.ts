import type {
  UploadFileMinimalInformation,
  UploadFileTable,
} from "../models/UploadFile.d.ts";
import ssms from "mssql";
import type { MsSqlResponse } from "@scope/server-ssms";

export const getMinimumFileInformation = async (
  pool: ssms.ConnectionPool,
  traceId: string,
): Promise<MsSqlResponse<UploadFileMinimalInformation>> => {
  const request = pool.request();

  request.input("traceId", ssms.Int, traceId);

  const result = await request.query<UploadFileMinimalInformation>(
    `SELECT Filename,DateUpload
    FROM UploadFile
    INNER JOIN Trace
      ON Trace.NoForm = UploadFile.NoForm
    WHERE Trace.IDTrace = @traceId`,
  );

  const response: MsSqlResponse<UploadFileMinimalInformation> = {
    rowsReturned: result.recordset,
    rowsAffected: result.rowsAffected,
  };

  return response;
};

export const postRequestFiles = async (
  requestSource: ssms.Transaction,
  noForm: string,
  requestSubject: string,
  requestorName: string,
  filename: string,
  uploadDate: string,
): Promise<number> => {
  const request = requestSource.request();

  request.input("noForm", ssms.VarChar, noForm);
  request.input("requestSubject", ssms.VarChar, requestSubject);
  request.input("requestorName", ssms.VarChar, requestorName);
  request.input("filename", ssms.VarChar, filename);
  request.input("uploadDate", ssms.VarChar, uploadDate);

  const result = await request.query<Pick<UploadFileTable, "IDUpload">>(
    `INSERT INTO UploadFile
        (NoForm, FormName, Requestor, Filename, DateUpload)
      VALUES
        (@noForm , @requestSubject , @requestorName , @filename , @uploadDate)`,
  );
  const newUploadId = result.recordset[0].IDUpload;
  return newUploadId;
};

export const deleteRequestFiles = async (
  requestSource: ssms.Transaction,
  noForm: string,
) => {
  const request = requestSource.request();

  request.input("noForm", ssms.VarChar, noForm);

  await requestSource.request().query(
    `DELETE FROM UploadFile WHERE NoForm = @noForm`,
  );

  return null;
};
