export interface FrmPRDTable {
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

export interface FrmPRDRequestItem {
  IDItem: number;
  Description: string;
  Qty: number;
  Measure: string;
  UnitPrice: number;
  Currency: string;
  EstimatedDelivery: string;
  Vendor: string;
  Reason: string;
  StatusItem: string;
  RejectedBy: string;
  CostCenter: string;
  Nature: string;
}
