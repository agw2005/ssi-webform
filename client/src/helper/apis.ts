import getCurrentPeriod from "./getCurrentPeriod.ts";

const serverRoot = import.meta.env.VITE_SERVER_ROOT_ROUTE;

export const webformAPI = {
  Forex: `/${serverRoot}/forex`,
  ForexTemp: `/${serverRoot}/forextemp`,
  NewForex: `/${serverRoot}/admin/ratedollartemp`,
  SubmitBudget: `/${serverRoot}/admin/budget`,
  SubmitRequest: `/${serverRoot}/submit`,
  Template: `/${serverRoot}/admin/template`,
  Request: `/${serverRoot}/trace/requests`,
  RequestCount: `/${serverRoot}/trace/requests/count`,
  SupervisorNames: `/${serverRoot}/usermaster/names`,
  SupervisorNrp: `/${serverRoot}/usermaster`,
  DeleteRequest: (traceId: string | number) =>
    `/${serverRoot}/admin/${traceId}`,
  VerifyToken: `/${serverRoot}/jwt/verify`,
  Budget: `/${serverRoot}/budget`,
  Usages: `/${serverRoot}/frmprh`,
  Report: `/${serverRoot}/budget/report`,
  ApproversRequest: `/${serverRoot}/trace/approve`,
  ApproversRequestCount: `/${serverRoot}/trace/approve/count`,
  FileResources: `/${serverRoot}/budget/fileresources`,
  BudgetYears: `/${serverRoot}/budget/years`,
  BudgetPeriods: `/${serverRoot}/budget/periods`,
  SectionNames: `/${serverRoot}/section/names`,
  SectionUserMappings: `/${serverRoot}/section/users`,
  RequestToken: `/${serverRoot}/jwt/request`,
  RequestOverview: `/${serverRoot}/trace/request`,
  RequestItems: `/${serverRoot}/frmprd/request`,
  RequestAttachments: `/${serverRoot}/uploadfile`,
  ApproverPath: `/${serverRoot}/traced`,
  PatchRemarks: `/${serverRoot}/approve/remarks`,
  PostVerdict: (verdict: "accept" | "reject") =>
    `/${serverRoot}/approve/${verdict}`,
  Departments: (fileResource?: string) => {
    const url = new URL(
      `/${serverRoot}/budget/departments`,
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
      `/${serverRoot}/budget/costcenters`,
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
      `/${serverRoot}/budget/nature`,
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
      `/${serverRoot}/budget/balance`,
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
