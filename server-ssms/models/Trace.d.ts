export interface TraceTable {
  IDTrace: number;
  IDForm: number;
  FormTable: string;
  NoForm: string;
  Requestor: string;
  IDSection: string;
  NRP: string;
  Ext: string;
  EmailReq: string;
  Status: string;
  SubmitDate: string;
  ProcessedBy: string;
  ProcessedLevel: string;
  LevelProgress: string;
  Remarks: string;
}

export interface TraceRequests {
  IDTrace: number;
  Subject: string;
  Amount: number;
  Requestor: string;
  RequestorSection: string;
  RequestorSectionId: number;
  Status: string;
  CurrentSupervisor: string;
  CurrentSupervisorId: number;
  SubmitDate: string;
  Remarks: string;
}

export interface TraceRequestsCount {
  Count: number;
}

export interface TraceRequestOverview {
  FormID: string;
  NoForm: string;
  Requestor: string;
  RequestorNRP: string;
  RequestorSection: string;
  NoPR: string;
  Subject: string;
  Amount: number;
  ReturnOnOutgoing: string;
  Remarks: string;
  CostCenter: string;
  Nature: string;
  IDBudget: string;
  Rate: number;
}

export interface TraceApproveRequests {
  IDTrace: number;
  Subject: string;
  Amount: number;
  Requestor: string;
  RequestorSection: string;
  RequesterSectionId: number;
  Result: string;
  CurrentSupervisor: string;
  CurrentSupervisorId: number;
  SubmitDate: string;
  Remarks: string;
  SupervisorStep: number;
  SupervisorType: string;
}

export interface PurchasingRequestIds {
  FormID: number;
  NoForm: string;
  NoPR: string;
  CostCenter: string;
  Nature: string;
  IDBudget: string;
  NetPrice: number;
  FileResource: string;
}

export interface PurchasingRequestItemsInformation {
  CostCenter: string;
  Nature: string;
  Periode: string;
  NetPrice: number;
  FileResource: string;
  Department: string;
}
