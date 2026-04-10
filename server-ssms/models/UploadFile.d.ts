import type { RowDataPacket } from "mysql2";

export interface UploadFileTable extends RowDataPacket {
  IDUpload: number;
  NoForm: string;
  FormName: string;
  Requestor: string;
  Filename: string;
  DateUpload: string;
}

export interface UploadFileMinimalInformation extends RowDataPacket {
  Filename: string;
  DateUpload: string;
}
