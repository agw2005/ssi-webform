import getCurrentPeriod from "./getCurrentPeriod.ts";

const prefix = "webform-api";

export const webformAPI = {
  Forex: `/${prefix}/forex`,
  ForexTemp: `/${prefix}/forextemp`,
  NewForex: `/${prefix}/admin/ratedollartemp`,
  SubmitBudget: `/${prefix}/admin/budget`,
  SubmitRequest: `/${prefix}/submit`,
  Template: `/${prefix}/admin/template`,
  Request: `/${prefix}/trace/requests`,
  RequestCount: `/${prefix}/trace/requests/count`,
  SupervisorNames: `/${prefix}/usermaster/names`,
  SupervisorNrp: `/${prefix}/usermaster/nrp`,
  DeleteRequest: (traceId: string | number) => `/${prefix}/admin/${traceId}`,
  VerifyToken: `/${prefix}/jwt/verify`,
  Budget: `/${prefix}/budget`,
  Usages: `/${prefix}/frmprh`,
  Report: `/${prefix}/budget/report`,
  ApproversRequest: `/${prefix}/trace/approve`,
  ApproversRequestCount: `/${prefix}/trace/approve/count`,
  FileResources: `/${prefix}/budget/fileresources`,
  BudgetYears: `/${prefix}/budget/years`,
  BudgetPeriods: `/${prefix}/budget/periods`,
  SectionNames: `/${prefix}/section/names`,
  SectionUserMappings: `/${prefix}/section/users`,
  RequestToken: `/${prefix}/jwt/request`,
  RequestOverview: `/${prefix}/trace/request`,
  RequestItems: `/${prefix}/frmprd/request`,
  RequestAttachments: `/${prefix}/uploadfile`,
  ApproverPath: `/${prefix}/traced`,
  PatchRemarks: `/${prefix}/approve/remarks`,
  PostVerdict: (verdict: "accept" | "reject") =>
    `/${prefix}/approve/${verdict}`,
  Departments: (fileResource?: string) => {
    const url = new URL(
      `/${prefix}/budget/departments`,
      globalThis.location.origin,
    );

    const params = new URLSearchParams({ period: getCurrentPeriod() });

    if (fileResource) params.append("fileresource", fileResource);

    url.search = params.toString();

    return url.toString();
  },
  CostCenters: (
    fileResource?: string,
    deptId?: number | null,
  ) => {
    const url = new URL(
      `/${prefix}/budget/costcenters`,
      globalThis.location.origin,
    );

    const params = new URLSearchParams({ period: getCurrentPeriod() });

    if (fileResource) params.append("fileresource", fileResource);

    if (deptId) params.append("dept", String(deptId));

    url.search = params.toString();

    return url.toString();
  },
  Natures: (
    fileResource?: string,
    deptId?: number | null,
    costCenter?: string | null,
  ) => {
    const url = new URL(
      `/${prefix}/budget/nature`,
      globalThis.location.origin,
    );

    const params = new URLSearchParams({ period: getCurrentPeriod() });

    if (fileResource) params.append("fileresource", fileResource);

    if (deptId) params.append("dept", String(deptId));

    if (costCenter) params.append("costcenter", costCenter);

    url.search = params.toString();

    return url.toString();
  },
  Balance: (
    fileResource?: string,
    deptId?: number | null,
    costCenter?: string | null,
    nature?: string,
    period?: string,
  ) => {
    const url = new URL(
      `/${prefix}/budget/balance`,
      globalThis.location.origin,
    );

    const params = new URLSearchParams({ period: getCurrentPeriod() });

    if (fileResource) params.append("fileresource", fileResource);

    if (deptId) params.append("dept", String(deptId));

    if (costCenter) params.append("costcenter", costCenter);

    if (nature) params.append("nature", nature);

    if (period) params.append("period", period);

    url.search = params.toString();

    return url.toString();
  },
};
