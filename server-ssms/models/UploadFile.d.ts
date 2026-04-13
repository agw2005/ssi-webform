export interface UploadFileTable {
  IDUpload: number;
  NoForm: string;
  FormName: string;
  Requestor: string;
  Filename: string;
  DateUpload: string;
}

export interface UploadFileMinimalInformation {
  Filename: string;
  DateUpload: string;
}
