export interface TraceDTable {
  IDTrace: number;
  IDUser: number;
  Result: string;
  DateApprove: string;
  ApproverType: string;
  ApproverLevel: number;
}

export interface TraceApproverPath {
  Result: string;
  ApproverType: string;
  DateApprove: string;
  NRP: string;
  NameUser: string;
}

export interface NextApproverPath {
  NextIDUser: number | null;
  NextApproverLevel: number | null;
}

export interface OtherApproverPathInfo {
  Summed: number;
  Maxxed: number;
}
