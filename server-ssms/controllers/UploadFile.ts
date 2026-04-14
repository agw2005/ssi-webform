import type {
  UploadFileMinimalInformation,
  UploadFileTable,
} from "../models/UploadFile.d.ts";
import ssms from "mssql";
import type { MsSqlResponse } from "@scope/server-ssms";
import { TraceSSMSTypes } from "./Trace.ts";

export const UploadFileSSMSTypes = {
  IDUpload: ssms.Int(),
  NoForm: ssms.VarChar(500),
  FormName: ssms.VarChar(500),
  Requestor: ssms.VarChar(500),
  Filename: ssms.VarChar(500),
  DateUpload: ssms.DateTime2(),
};

export const getMinimumFileInformation = async (
  pool: ssms.ConnectionPool,
  traceId: string,
): Promise<MsSqlResponse<UploadFileMinimalInformation>> => {
  const request = pool.request();

  request.input("traceId", TraceSSMSTypes.IDTrace, traceId);

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

  request.input("noForm", UploadFileSSMSTypes.NoForm, noForm);
  request.input("requestSubject", UploadFileSSMSTypes.FormName, requestSubject);
  request.input("requestorName", UploadFileSSMSTypes.Requestor, requestorName);
  request.input("filename", UploadFileSSMSTypes.Filename, filename);
  request.input("uploadDate", UploadFileSSMSTypes.DateUpload, uploadDate);

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

  request.input("noForm", UploadFileSSMSTypes.NoForm, noForm);

  await requestSource.request().query(
    `DELETE FROM UploadFile WHERE NoForm = @noForm`,
  );

  return null;
};
