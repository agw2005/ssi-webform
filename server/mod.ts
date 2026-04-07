import type { BudgetData } from "./models/Budget.d.ts";

export type { SectionName } from "./models/Section.d.ts";
export type { UserSection } from "./models/Section.d.ts";
export type { UserMasterName as SupervisorNames } from "./models/UserMaster.d.ts";
export type { BudgetFileResource as FileResource } from "./models/Budget.d.ts";
export type { BudgetViewInformation as BudgetViewAtYear } from "./models/Budget.d.ts";
export type { BudgetYear as Year } from "./models/Budget.d.ts";
export type { BudgetPeriod as Period } from "./models/Budget.d.ts";
export type { BudgetNature as Nature } from "./models/Budget.d.ts";
export type { BudgetBalance as Balance } from "./models/Budget.d.ts";
export type { ReportViewInformation as ReportResponse } from "./models/Budget.d.ts";
export type { FrmPRNoPRDepartment as Department } from "./models/FrmPRNoPR.d.ts";
export type { TraceRequests as FormRequest } from "./models/Trace.d.ts";
export type { TraceRequestOverview as RequestOverview } from "./models/Trace.d.ts";
export type { TraceApproveRequests } from "./models/Trace.d.ts";
export type { FrmPRDRequestItem as RequestItem } from "./models/FrmPRD.d.ts";
export type { UploadFileMinimalInformation as UploadedFile } from "./models/UploadFile.d.ts";
export type { TraceApproverPath as ApproverPath } from "./models/TraceD.d.ts";
export type { RequestItemsAtBudgetView as BudgetUsages } from "./models/FrmPRH.d.ts";
export type { ForexAPIResponse } from "./models/FrmPRH.d.ts";
export type { BudgetData } from "./models/Budget.d.ts";
export type {
  LoginPayload,
  LoginResponse,
  VerifyResponse,
} from "./auth/type.d.ts";
export { jwtRequestPayload } from "./auth/jwtRequestPayload.ts";
export { verifyJwtPayload } from "./auth/verifyJwtPayload.ts";
export type { TraceRequestsCount } from "./models/Trace.d.ts";
export { onlyNumerics } from "./helper/onlyNumerics.ts";

export interface FirstStepInputs {
  name: string;
  section: string;
  nrp: string;
  ext: string;
  email: string;
  fileResource: string;
  department: string;
  form: string;
}

export interface SecondStepInputs {
  formNumber: string;
  prNumber: string;
  subject: string;
  returnOnOutgoing: string;
}

export interface Usage {
  costCenter: string;
  budgetOrNature: string;
  periode: string;
  balance: string;
  description: string;
  quantity: string;
  unitPrice: string;
  measure: string;
  currency: string;
  vendor: string;
  reason: string;
  estimatedDeliveryDate: string;
}

export interface ThirdStepInputs {
  usages: Usage[];
}

export interface FourthStepInputs {
  approver: string[];
  releaser: string[];
  administrator: string[];
}

export interface FifthStepInputs {
  files: File[];
}

export interface SubmitPayload {
  firstStep: FirstStepInputs;
  secondStep: SecondStepInputs;
  thirdStep: ThirdStepInputs;
  fourthStep: FourthStepInputs;
  fifthStep: FifthStepInputs;
}

export const submitRequest = (requestPayload: SubmitPayload) => {
  const formData = new FormData();
  const { fifthStep, ...otherSteps } = requestPayload;
  formData.append("payload", JSON.stringify(otherSteps));
  fifthStep.files.forEach((file) => {
    formData.append("files", file);
  });

  const Request = {
    method: "POST",
    body: formData,
  };
  return Request;
};

export interface SubmitResponse {
  message: string;
  noForm: string;
  noPR: string;
  traceId: string;
}

export interface PatchRemarksPayload {
  noForm: string;
  newRemarks: string;
}

export interface patchApprovalVerdict {
  traceId: number;
  rejectedItems: number[];
  supervisorNrp: string;
  supervisorId: number;
  supervisorLevel: number;
}

export const putBudgets = (payload: BudgetData[]) => {
  const Request = {
    method: "PUT",
    body: JSON.stringify(payload),
  };
  return Request;
};
