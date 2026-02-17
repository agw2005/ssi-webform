import type { RowDataPacket } from "mysql2";

export interface UploadFileTable extends RowDataPacket {
  IDUpload: number;
  NoForm: string;
  FormName: string;
  Requestor: string;
  Filename: string;
  DateUpload: string;
}
