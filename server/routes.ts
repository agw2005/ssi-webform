import {
  allFileResources,
  allPeriods,
  basicGet as BudgetGet,
  natureByCostCenter,
  patchRequestBudget,
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
  postUsage,
} from "./controllers/FrmPRD.ts";
import {
  basicGet as FrmPRHGet,
  getRequestItemForBudgetView,
  postRequestInformation,
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
  getSectionIdByName,
  basicGet as SectionGet,
  sectionNames,
  userSectionMappings,
} from "./controllers/Section.ts";
import { basicGet as TitleGet } from "./controllers/Title.ts";
import {
  homeRequests,
  homeRequestsCount,
  postRequestTrace,
  specificRequest,
  basicGet as TraceGet,
} from "./controllers/Trace.ts";
import {
  getApproverPathInformation,
  postRequestApproverPath,
  basicGet as TraceDGet,
} from "./controllers/TraceD.ts";
import { basicGet as TypeGet } from "./controllers/Type.ts";
import {
  getMinimumFileInformation,
  postRequestFiles,
  basicGet as UploadFileGet,
} from "./controllers/UploadFile.ts";
import {
  supervisorNames,
  basicGet as UserMasterGet,
  getUserIdByName,
  getAuthInfo,
} from "./controllers/UserMaster.ts";
import type { RouterContext } from "@oak/oak";
import databasePool from "./dbpool.ts";
import type {
  ForexAPIResponse,
  SubmitPayload,
  SubmitResponse,
} from "@scope/server";
import provisionFormNumber from "./helper/provisionFormNumber.ts";
import type { ForexRates } from "./models/FrmPRH.d.ts";
import addHours from "./helper/addHours.ts";

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

export const getSupervisorNames = async (
  ctx: RouterContext<"/usermaster/names">,
) => {
  const [rows, _metadata] = await supervisorNames(databasePool);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

// POST to table frm_PR_D
// PATCH to table Budget
// POST to table frm_PR_H
// POST to table Trace
// POST to table Trace_D
// POST to table UploadFile
export const submitRequest = async (ctx: RouterContext<"/submit">) => {
  const formDataRequest: FormData = await ctx.request.body.formData();
  const files: File[] = formDataRequest.getAll("files") as File[];
  const rawPayload = formDataRequest.get("payload");
  if (typeof rawPayload !== "string") {
    const failResponse: SubmitResponse = {
      message: "Invalid payload. Request submission denied.",
      noForm: "",
      noPR: "",
      traceId: "",
    };
    ctx.response.status = 400;
    ctx.response.body = failResponse;
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

  const FOREX_API_URL =
    "https://api.frankfurter.dev/v1/latest?symbols=IDR,JPY,SGD&base=USD";
  const forexResponse = await fetch(FOREX_API_URL);
  const forexData: ForexAPIResponse = await forexResponse.json();

  const indonesiaUtc = 7;
  const now = addHours(new Date(), indonesiaUtc);
  const submissionDate = now.toISOString().slice(0, 19).replace("T", " ");
  const emailDomain = "ssi.sharp-world.com";

  const noForm = provisionFormNumber();
  const [noPR, requestorSectionId] = await Promise.all([
    provisionPRNumber(databasePool, payload.firstStep.department),
    getSectionIdByName(databasePool, payload.firstStep.section),
  ]);

  let requestAmount = 0;
  let isRedLight = false;

  await Promise.all(
    payload.thirdStep.usages.map(async (usage) => {
      const currencyRate =
        usage.currency === "USD"
          ? Number(forexData.amount.toFixed(2))
          : Number(
              forexData.rates[usage.currency as keyof ForexRates].toFixed(2),
            );

      const budgetId = `${usage.periode}-${usage.costCenter}-${payload.firstStep.section}`;
      const quantity = Number(usage.quantity);
      const pricePerUnit = Number(usage.unitPrice);
      const netPriceByCurrencyRate = (quantity * pricePerUnit) / currencyRate;

      requestAmount += netPriceByCurrencyRate;

      await Promise.all([
        postUsage(
          databasePool,
          noPR,
          usage.costCenter,
          usage.budgetOrNature,
          usage.description,
          quantity,
          usage.measure,
          pricePerUnit,
          usage.currency,
          usage.estimatedDeliveryDate,
          usage.vendor,
          usage.reason,
          currencyRate,
          budgetId,
        ),
        patchRequestBudget(
          databasePool,
          netPriceByCurrencyRate,
          usage.costCenter,
          usage.budgetOrNature,
          usage.periode,
        ),
      ]);

      const [currentNatureInfo] = await singleBalance(
        databasePool,
        Number(usage.costCenter),
        usage.periode,
        usage.budgetOrNature,
      );
      const currentNatureBalance = Number(currentNatureInfo[0].Balance) || 0;
      if (!isRedLight && currentNatureBalance < netPriceByCurrencyRate) {
        isRedLight = true;
      }
    }),
  );

  const requestSubject = !isRedLight
    ? payload.secondStep.subject
    : `[RL] ${payload.secondStep.subject}`;

  const initialRemarks = !isRedLight ? "" : "[RL]";

  await postRequestInformation(
    databasePool,
    noForm,
    payload.firstStep.name,
    payload.firstStep.nrp,
    payload.firstStep.section,
    noPR,
    requestSubject,
    requestAmount,
    payload.secondStep.returnOnOutgoing,
    initialRemarks,
  );

  const supervisorNames = [
    ...payload.fourthStep.approver.map((name) => ({ name, type: "A" })),
    ...payload.fourthStep.releaser.map((name) => ({ name, type: "R" })),
    ...payload.fourthStep.administrator.map((name) => ({ name, type: "ADM" })),
  ];

  const initialSupervisorId = await getUserIdByName(
    databasePool,
    payload.fourthStep.approver[0],
  );

  const newTraceId = await postRequestTrace(
    databasePool,
    noForm,
    payload.firstStep.name,
    String(requestorSectionId),
    payload.firstStep.nrp,
    payload.firstStep.ext,
    `${payload.firstStep.email}@${emailDomain}`,
    submissionDate,
    initialSupervisorId,
    initialRemarks,
  );

  await Promise.all(
    supervisorNames.map(async (supervisorName, index) => {
      const supervisorId = await getUserIdByName(
        databasePool,
        supervisorName.name,
      );
      await postRequestApproverPath(
        databasePool,
        newTraceId,
        supervisorId,
        supervisorName.type,
        index + 1,
      );
    }),
  );

  await Promise.all(
    payload.fifthStep.files.map((file) =>
      postRequestFiles(
        databasePool,
        noForm,
        payload.secondStep.subject,
        payload.firstStep.name,
        file.name,
        submissionDate,
      ),
    ),
  );

  const successResponse: SubmitResponse = {
    message: "Your purchasing request has been filed successfully!",
    noForm: noForm,
    noPR: noPR,
    traceId: String(newTraceId),
  };

  ctx.response.status = 200;
  ctx.response.body = successResponse;
};

export const getAuthInformation = async (
  ctx: RouterContext<"/usermaster/auth">,
) => {
  const [rows, _metadata] = await getAuthInfo(databasePool);
  ctx.response.status = 200;
  ctx.response.body = rows;
};
