import type {
  UploadFileMinimalInformation,
  UploadFileTable,
} from "../models/UploadFile.d.ts";
import type { MsSqlResponse, TraceTable } from "@scope/server";
import { TraceSSMSTypes } from "./Trace.ts";
import ssms from "mssql";

const { Int, VarChar, DateTime2 } = ssms;

export const UploadFileSSMSTypes = {
  IDUpload: Int(),
  NoForm: VarChar(500),
  FormName: VarChar(500),
  Requestor: VarChar(500),
  Filename: VarChar(500),
  DateUpload: DateTime2(),
};

export const getMinimumFileInformation = async (
  transaction: ssms.Transaction,
  traceId: TraceTable["IDTrace"],
): Promise<MsSqlResponse<UploadFileMinimalInformation>> => {
  const request = transaction.request();

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
  transaction: ssms.Transaction,
  noForm: UploadFileTable["NoForm"],
  requestSubject: UploadFileTable["FormName"],
  requestorName: UploadFileTable["Requestor"],
  filename: UploadFileTable["Filename"],
  uploadDate: UploadFileTable["DateUpload"],
) => {
  const request = transaction.request();

  request.input("noForm", UploadFileSSMSTypes.NoForm, noForm);
  request.input("requestSubject", UploadFileSSMSTypes.FormName, requestSubject);
  request.input("requestorName", UploadFileSSMSTypes.Requestor, requestorName);
  request.input("filename", UploadFileSSMSTypes.Filename, filename);
  request.input("uploadDate", UploadFileSSMSTypes.DateUpload, uploadDate);

  const result = await request.query<Pick<UploadFileTable, "IDUpload">>(
    `INSERT INTO UploadFile
        (NoForm, FormName, Requestor, Filename, DateUpload)
      OUTPUT INSERTED.IDUpload
      VALUES
        (@noForm , @requestSubject , @requestorName , @filename , @uploadDate)`,
  );
  const newUploadId = result.recordset[0].IDUpload;
  return { rowsAffected: result.rowsAffected, newUploadId };
};

export const deleteRequestFiles = async (
  transaction: ssms.Transaction,
  noForm: UploadFileTable["NoForm"],
) => {
  const request = transaction.request();

  request.input("noForm", UploadFileSSMSTypes.NoForm, noForm);

  const result = await request.query(
    `DELETE FROM UploadFile WHERE NoForm = @noForm`,
  );

  return result.rowsAffected[0];
};
