import {
  allFileResources,
  allPeriods,
  basicGet as BudgetGet,
  natureByCostCenter,
  reportInformation,
  singleBalance,
  viewInformation,
} from "./controllers/Budget.ts";
import { basicGet as FileResourceGet } from "./controllers/FileResource.ts";
import { basicGet as FlowGet } from "./controllers/Flow.ts";
import { basicGet as FormGet } from "./controllers/Form.ts";
import {
  basicGet as FrmPRDGet,
  getAllRequestItems,
  postRequestSubmission,
} from "./controllers/FrmPRD.ts";
import {
  basicGet as FrmPRHGet,
  getRequestItemForBudgetView,
  provisionPRNumber,
} from "./controllers/FrmPRH.ts";
import {
  allDepartments,
  basicGet as FrmPRNoPRGet,
} from "./controllers/FrmPRNoPR.ts";
import { basicGet as NatureGet } from "./controllers/Nature.ts";
import { basicGet as RateDollarGet } from "./controllers/RateDollar.ts";
import { basicGet as RateDollarTempGet } from "./controllers/RateDollarTemp.ts";
import {
  basicGet as SectionGet,
  sectionNames,
  userSectionMappings,
} from "./controllers/Section.ts";
import { basicGet as TitleGet } from "./controllers/Title.ts";
import {
  homeRequests,
  homeRequestsCount,
  specificRequest,
  basicGet as TraceGet,
} from "./controllers/Trace.ts";
import {
  getApproverPathInformation,
  basicGet as TraceDGet,
} from "./controllers/TraceD.ts";
import { basicGet as TypeGet } from "./controllers/Type.ts";
import {
  getMinimumFileInformation,
  basicGet as UploadFileGet,
} from "./controllers/UploadFile.ts";
import {
  authInformation,
  supervisorNames,
  basicGet as UserMasterGet,
} from "./controllers/UserMaster.ts";
import type { RouterContext } from "@oak/oak";
import databasePool from "./dbpool.ts";
import type { ForexAPIResponse, SubmitPayload } from "@scope/server";
import provisionFormNumber from "./helper/provisionFormNumber.ts";
import type { ForexRates } from "./models/FrmPRH.d.ts";

export const healthCheck = (ctx: RouterContext<"/">) => {
  ctx.response.status = 200;
  ctx.response.body = "Healthy";
};

export const getBudgetsPaginated = async (
  ctx: RouterContext<"/budget/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await BudgetGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getAllFileResources = async (
  ctx: RouterContext<"/budget/fileresources">,
) => {
  const [rows, _metadata] = await allFileResources(databasePool);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getAllPeriods = async (ctx: RouterContext<"/budget/periods">) => {
  const [rows, _metadata] = await allPeriods(databasePool);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getNaturesOfCostCenter = async (
  ctx: RouterContext<"/budget/nature/:costcenter">,
) => {
  const costcenter = Number(ctx.params.costcenter);
  const [rows, _metadata] = await natureByCostCenter(databasePool, costcenter);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getSingleBalance = async (
  ctx: RouterContext<"/budget/nature/:costcenter/:periode/:nature">,
) => {
  const costcenter = Number(ctx.params.costcenter);
  const periode = String(ctx.params.periode);
  const nature = String(ctx.params.nature);
  const [rows, _metadata] = await singleBalance(
    databasePool,
    costcenter,
    periode,
    nature,
  );
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getBudgetViewInformation = async (
  ctx: RouterContext<"/budget">,
) => {
  const params = ctx.request.url.searchParams;
  const periode = params.get("periode") || null;
  const fileResource = params.get("fileresource") || null;
  const [rows, _metadata] = await viewInformation(
    databasePool,
    periode,
    fileResource,
  );
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getReportViewInformation = async (
  ctx: RouterContext<"/budget/report">,
) => {
  const params = ctx.request.url.searchParams;
  const periode = params.get("periode") || null;
  const fileResource = params.get("fileresource") || null;
  const [rows, _metadata] = await reportInformation(
    databasePool,
    periode,
    fileResource,
  );
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getFileResourcesPaginated = async (
  ctx: RouterContext<"/fileresource/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await FileResourceGet(
    databasePool,
    page,
    pagination,
  );
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getFlowsPaginated = async (
  ctx: RouterContext<"/flow/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await FlowGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getFormsPaginated = async (
  ctx: RouterContext<"/form/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await FormGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getFrmPRDsPaginated = async (
  ctx: RouterContext<"/frmprd/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await FrmPRDGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getSpecificRequestItems = async (
  ctx: RouterContext<"/frmprd/request/:traceId">,
) => {
  const traceId = Number(ctx.params.traceId);
  const [rows, _metadata] = await getAllRequestItems(databasePool, traceId);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getFrmPRHsPaginated = async (
  ctx: RouterContext<"/frmprh/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await FrmPRHGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getRequestsAtBudgetView = async (
  ctx: RouterContext<"/frmprh">,
) => {
  const params = ctx.request.url.searchParams;
  const nature = params.get("nature") || null;
  const costCenter = params.get("costcenter") || null;
  const startDate = params.get("startdate") || null;
  const endDate = params.get("enddate") || null;

  const [rows, _metadata] = await getRequestItemForBudgetView(
    databasePool,
    nature,
    costCenter,
    startDate,
    endDate,
  );
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getFrmNoPRsPaginated = async (
  ctx: RouterContext<"/frmprnopr/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await FrmPRNoPRGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getAllDepartments = async (
  ctx: RouterContext<"/frmprnopr/departments">,
) => {
  const [rows, _metadata] = await allDepartments(databasePool);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getNaturesPaginated = async (
  ctx: RouterContext<"/nature/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await NatureGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getRateDollarsPaginated = async (
  ctx: RouterContext<"/ratedollar/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await RateDollarGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getRateDollarTempsPaginated = async (
  ctx: RouterContext<"/ratedollartemp/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await RateDollarTempGet(
    databasePool,
    page,
    pagination,
  );
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getSectionsPaginated = async (
  ctx: RouterContext<"/section/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await SectionGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getSectionNames = async (ctx: RouterContext<"/section/names">) => {
  const [rows, _metadata] = await sectionNames(databasePool);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getSectionUsers = async (ctx: RouterContext<"/section/users">) => {
  const [rows, _metadata] = await userSectionMappings(databasePool);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getTitlesPaginated = async (
  ctx: RouterContext<"/title/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await TitleGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getTracesPaginated = async (
  ctx: RouterContext<"/trace/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await TraceGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getRequests = async (ctx: RouterContext<"/trace/requests">) => {
  const params = ctx.request.url.searchParams;

  const requestorSectionId = params.has("requestorsectionid")
    ? Number(params.get("requestorsectionid"))
    : null;

  const status = params.get("status") || null;

  const currentSupervisorId = params.has("currentsupervisorid")
    ? Number(params.get("currentsupervisorid"))
    : null;

  const startDate = params.get("startdate") || null;

  const endDate = params.get("enddate") || null;

  const search = params.get("search") || null;

  const pagination = Number(params.get("pagination")) || 50;
  const page = Number(params.get("page")) || 1;

  const [rows, _metadata] = await homeRequests(
    databasePool,
    page,
    pagination,
    requestorSectionId,
    status,
    currentSupervisorId,
    startDate,
    endDate,
    search,
  );
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getRequestsCount = async (
  ctx: RouterContext<"/trace/requests/count">,
) => {
  const params = ctx.request.url.searchParams;

  const requestorSectionId = params.has("requestorsectionid")
    ? Number(params.get("requestorsectionid"))
    : null;

  const status = params.get("status") || null;

  const currentSupervisorId = params.has("currentsupervisorid")
    ? Number(params.get("currentsupervisorid"))
    : null;

  const startDate = params.get("startdate") || null;

  const endDate = params.get("enddate") || null;

  const search = params.get("search") || null;

  const [rows, _metadata] = await homeRequestsCount(
    databasePool,
    requestorSectionId,
    status,
    currentSupervisorId,
    startDate,
    endDate,
    search,
  );
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getSpecificRequest = async (
  ctx: RouterContext<"/trace/request/:traceId">,
) => {
  const traceId = ctx.params.traceId;

  const [rows, _metadata] = await specificRequest(
    databasePool,
    Number(traceId),
  );
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getTraceDsPaginated = async (
  ctx: RouterContext<"/traced/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await TraceDGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getApproverPath = async (
  ctx: RouterContext<"/traced/:traceId">,
) => {
  const traceId = Number(ctx.params.traceId);

  const [rows, _metadata] = await getApproverPathInformation(
    databasePool,
    traceId,
  );
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getTypesPaginated = async (
  ctx: RouterContext<"/type/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await TypeGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getUploadFilesPaginated = async (
  ctx: RouterContext<"/uploadfile/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await UploadFileGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getUploadFiles = async (
  ctx: RouterContext<"/uploadfile/:traceId">,
) => {
  const traceId = ctx.params.traceId;
  const [rows, _metadata] = await getMinimumFileInformation(
    databasePool,
    traceId,
  );
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getUserMastersPaginated = async (
  ctx: RouterContext<"/usermaster/:pagination/:page">,
) => {
  const pagination = Number(ctx.params.pagination);
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await UserMasterGet(databasePool, page, pagination);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getUserAuthInfo = async (
  ctx: RouterContext<"/authInfo/:page">,
) => {
  const pagination = 50;
  const page = Number(ctx.params.page);
  const [rows, _metadata] = await authInformation(
    databasePool,
    page,
    pagination,
  );
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getSupervisorNames = async (
  ctx: RouterContext<"/usermaster/names">,
) => {
  const [rows, _metadata] = await supervisorNames(databasePool);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const authenticate = (ctx: RouterContext<"/auth">) => {
  ctx.response.status = 200;
  ctx.response.body = {
    message: "Authentication success",
    verdict: true,
  };
};

export const submitRequest = async (ctx: RouterContext<"/submit">) => {
  const FOREX_API_URL =
    "https://api.frankfurter.dev/v1/latest?symbols=IDR,JPY,SGD&base=USD";

  const formDataRequest: FormData = await ctx.request.body.formData();
  const files: File[] = formDataRequest.getAll("files") as File[];
  const rawPayload = formDataRequest.get("payload");

  if (typeof rawPayload !== "string") {
    ctx.response.status = 400;
    ctx.response.body = "Invalid payload";
    return;
  }

  const parsedPayload = JSON.parse(rawPayload) as Omit<
    SubmitPayload,
    "fifthStep"
  >;

  const payload: SubmitPayload = {
    ...parsedPayload,
    fifthStep: {
      files: files,
    },
  };

  const forexResponse = await fetch(FOREX_API_URL);
  const forexData: ForexAPIResponse = await forexResponse.json();

  // POST to frm_PR_D - DONE
  //
  // FOR EVERY USAGES ITEM
  //
  // IDItem = Automatically inceremented, no need to set it
  // NoPR = {noPR}
  // AcctAssgCategory = '', always
  // CostCenter = {usage.costCenter}
  // Nature = {usage.budgetOrNature}
  // Description = {usage.description}
  // Qty = {usage.quantity}
  // Measure = {usage.measure}
  // UnitPrice = {usage.unitPrice}
  // Currency = {usage.currency}
  // EstimationDeliveryDate = {usage.estimatedDeliveryDate}
  // Vendor = {usage.vendor}
  // Reason = {usage.reason}
  // StatusItem = if the item is rejected 'False' / 'True', 'False' at the start
  // RejectedBy = User Name of who rejected the item, '' at the start
  // Supplier = Always ''
  // NetPrice = {usage.unitPrice * usage.quantity, converted to USD}
  // DeliveryDate = null at the start
  // NoPO = '' at the start
  // Rate = (PLEASE HANDLE EXCEPTION FOR CURRENCY=USD) {forexData.rates[payload.thirdStep.usage.currency as keyof ForexRates]}
  // IDBudget = {usage.periode}-{usage.costCenter}-{payload.firstStep.section}

  // POST to frm_PR_H
  //
  // ID = Automatically inceremented, no need to set it
  // NoForm = {noForm}
  // Requestor = {payload.firstStep.name}
  // NRP = {payload.firstStep.nrp}
  // Section = {payload.firstStep.section}
  // NoPR = See frm_PR_D
  // Subject = {payload.secondStep.subject}
  // Amount = Sum of frm_PR_D.NetPrice of the previous declaration converted to USD
  // ReturnOnOutgoing = {payload.secondStep.returnOnOutgoing}
  // Remarks = ''

  // POST to Trace
  //
  // IDTrace = IDTrace is inceremented, no need to set it
  // IDForm = IDForm will always be '8'
  // FormTable = FormTable will always be 'frm_PR_H'
  // NoForm = {noForm}
  // Requestor = {payload.firstStep.name}
  // IDSection = (not a real query) Trace.IDSection = SELECT IDSection FROM Section WHERE SectionName LIKE {payload.firstStep.section};
  // NRP = {payload.firstStep.nrp}
  // Ext = {payload.firstStep.ext}
  // EmailReq = {payload.firstStep.email}'@ssi.sharp-world.com'
  // Status = 'In Progress'
  // SubmitDate = {submissionDate}
  // ProcessedBy = The User ID of the supervisor that last approved the form, 0 at the start
  // ProcessedLevel = Sum of `ApproverLevel` from Trace_D of that IDTrace where `Trace_D.Result` is `In Progress` or `Approved`, 0 at the start
  // LevelProgress = Which step of the supervisor the form is on, 1 at the start
  // Remarks = '' at the start

  // POST to Trace_D
  //
  // FOR EVERY SUPERVISOR
  //
  // IDTrace = See Trace
  // IDUser = {getUserIdByName(databasePool, supervisorName)}
  // Result = '' at the start
  // DateApprove = null at the start
  // ApproverType = Based on usage field, either 'A', 'R', or 'ADM'
  // ApproverLevel = 1-based index of all the supervisor from approver to administrator

  // POST to UploadFile
  //
  // FOR EVERY FILE
  //
  // IDUpload = auto inceremented, no need to set it
  // NoForm = {noForm}
  // FormName = {payload.secondStep.subject}
  // Requestor = {payload.firstStep.name}
  // Filename = {file.name}
  // DateUpload = {now}

  // PATCH to Budget
  //
  // FOR EVERY USAGES ITEM
  //
  // CostCenter = Unchanged
  // Nature = Unchanged
  // Periode = Unchanged
  // Budget = Unchanged
  // Balance = Change => UPDATE Budget SET Balance = Balance -{usage.unitPrice * usage.quantity, converted to USD} WHERE CostCenter = {usage.costCenter} AND Nature = {usage.budgetOrNature} AND Periode = {usage.periode};
  // IDSection = Unchanged
  // FileResource = Unchanged

  const now = new Date();
  const submissionDate = now.toISOString().slice(0, 19).replace("T", " ");
  const noForm = provisionFormNumber();
  const noPR = await provisionPRNumber(
    databasePool,
    payload.firstStep.department,
  );

  console.log(`Requestor Name : ${payload.firstStep.name}`);
  console.log(`Requestor Section : ${payload.firstStep.section}`);
  console.log(`Requestor NRP : ${payload.firstStep.nrp}`);
  console.log(`Requestor Extension Number : ${payload.firstStep.ext}`);
  console.log(`Requestor Email : ${payload.firstStep.email}`);
  console.log(`Requestor Department : ${payload.firstStep.department}`);
  console.log(`Request File Resource : ${payload.firstStep.fileResource}`);
  console.log(`Request Form Type : ${payload.firstStep.form}`);
  console.log(`Request Subject : ${payload.secondStep.subject}`);
  console.log(
    `Request Return On Outgoing : ${payload.secondStep.returnOnOutgoing}`,
  );
  payload.thirdStep.usages.map((usage, index) => {
    const currencyRate =
      usage.currency === "USD"
        ? forexData.amount
        : forexData.rates[usage.currency as keyof ForexRates];
    const currentBudgetId = `${usage.periode}-${usage.costCenter}-${payload.firstStep.section}`;
    postRequestSubmission(
      databasePool,
      noPR,
      usage.costCenter,
      usage.budgetOrNature,
      usage.description,
      Number(usage.quantity),
      usage.measure,
      Number(usage.unitPrice),
      usage.currency,
      usage.estimatedDeliveryDate,
      usage.vendor,
      usage.reason,
      currencyRate,
      currentBudgetId,
    );
    console.log(`Usage ${index + 1} Cost Center : ${usage.costCenter}`);
    console.log(`Usage ${index + 1} Nature : ${usage.budgetOrNature}`);
    console.log(`Usage ${index + 1} Period : ${usage.periode}`);
    console.log(`Usage ${index + 1} Balance : ${usage.balance}`);
    console.log(`Usage ${index + 1} Description : ${usage.description}`);
    console.log(`Usage ${index + 1} Quantity : ${Number(usage.quantity)}`);
    console.log(`Usage ${index + 1} Unit Price : ${Number(usage.unitPrice)}`);
    console.log(`Usage ${index + 1} Measure : ${usage.measure}`);
    console.log(`Usage ${index + 1} Currency : ${usage.currency}`);
    console.log(`Usage ${index + 1} Vendor : ${usage.vendor}`);
    console.log(`Usage ${index + 1} Reason : ${usage.reason}`);
    console.log(
      `Usage ${index + 1} Estimated Delivery Date : ${usage.estimatedDeliveryDate}`,
    );
  });
  payload.fourthStep.approver.map((approverName, index) => {
    console.log(`Approver ${index + 1} : ${approverName}`);
  });
  payload.fourthStep.releaser.map((releaserName, index) => {
    console.log(`Releaser ${index + 1} : ${releaserName}`);
  });
  payload.fourthStep.administrator.map((administratorName, index) => {
    console.log(`Administrator ${index + 1} : ${administratorName}`);
  });
  payload.fifthStep.files.map((file, index) => {
    console.log(`File ${index + 1} : ${file.name}`);
  });

  ctx.response.status = 200;
  ctx.response.body = "Success";
};
