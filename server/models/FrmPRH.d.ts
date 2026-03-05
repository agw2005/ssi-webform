import type { RowDataPacket } from "mysql2";

export interface FrmPRHTable extends RowDataPacket {
  ID: number;
  NoForm: string;
  Requestor: string;
  NRP: string;
  Section: string;
  NoPR: string;
  Subject: string;
  Amount: number;
  ReturnOnOutgoing: string;
  Remarks: string;
}

export interface RequestItemsAtBudgetView extends RowDataPacket {
  IDTrace: string;
  ItemId: string;
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
  NetPrice: string;
  DeliveryDate: string;
  NoPO: string;
  Rate: number;
  IDBudget: string;
  SubmitDate: string;
}
