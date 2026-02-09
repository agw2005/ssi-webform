import { RowDataPacket } from "mysql2";

export interface FrmPRDTable extends RowDataPacket {
  IDItem: number;
  NoPR: string;
  AcctAssgCategory: string;
  CostCenter: string;
  Nature: string;
  Description: string;
  Qty: number;
  Measure: string;
  UnitPrice: number;
  Currency: string;
  EstimationDeliveryDate: string;
  Vendor: string;
  Reason: string;
  StatusItem: string;
  RejectedBy: string;
  Supplier: string;
  NetPrice: number;
  DeliveryDate: string;
  NoPO: string;
  Rate: number;
  IDBudget: string;
}
