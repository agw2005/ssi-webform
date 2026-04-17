import {
  allFileResources,
  availablePeriods,
  availableYears,
  getBudgetsByYear,
  getSpecificBudgetData,
  getValidCostCenters,
  getValidDepartments,
  getValidNatures,
  patchRequestBudget,
  patchSpecificBudgetNewBudget,
  postBudget,
  reportInformation,
  singleBalance,
} from "./controllers/Budget.ts";
import {
  deleteRequestItems,
  getAllRequestItems,
  patchFrmPRDVerdict,
  postUsage,
} from "./controllers/FrmPRD.ts";
import {
  deleteRequestInformation,
  getRequestItemForBudgetView,
  patchRemarksOfRequest,
  postRequestInformation,
  provisionPRNumber,
} from "./controllers/FrmPRH.ts";
import {
  getSectionIdByName,
  sectionNames,
  userSectionMappings,
} from "./controllers/Section.ts";
import {
  approveRequests,
  approveRequestsCount,
  deleteRequestTrace,
  getRequestIds,
  homeRequests,
  homeRequestsCount,
  patchRemarksOfTrace,
  patchTraceVerdict,
  postRequestTrace,
  specificRequest,
} from "./controllers/Trace.ts";
import {
  deleteRequestApproverPath,
  getApproverPathInformation,
  getNextApprover,
  getOtherApproverInfo,
  patchApproverToActiveApproving,
  patchTraceDVerdict,
  postRequestApproverPath,
} from "./controllers/TraceD.ts";
import {
  deleteRequestFiles,
  getMinimumFileInformation,
  postRequestFiles,
} from "./controllers/UploadFile.ts";
import {
  getAuthInfo,
  getUserIdByName,
  patchNewLogin,
  supervisorNames,
} from "./controllers/UserMaster.ts";
import type { RouterContext } from "@oak/oak";
import databasePool from "./dbpool.ts";
import type {
  BudgetTable,
  LoginPayload,
  LoginResponse,
  patchApprovalVerdict,
  PatchRemarksPayload,
  SubmitPayload,
  SubmitResponse,
} from "@scope/server-ssms";
import provisionFormNumber from "./helper/provisionFormNumber.ts";
import addHours from "./helper/addHours.ts";
import { create, getNumericDate } from "@zaubrik/djwt";
import type { Header, Payload } from "@zaubrik/djwt";
import getKey from "./auth/getKey.ts";
import type { AuthInfo } from "./models/UserMaster.d.ts";
import { onlyNumerics } from "./helper/onlyNumerics.ts";
import { jsDateToMySQLDatetime } from "./helper/jsDateToMySQLDatetime.ts";
import ssms from "mssql";
import type { ContextSendOptions } from "@oak/oak/context";
import {
  getCurrentRateDollar,
  renewRateDollar,
} from "./controllers/RateDollar.ts";
import {
  getCurrentRateDollarTemp,
  patchRateDollarTemp,
} from "./controllers/RateDollarTemp.ts";
import { getLogger } from "@logtape/logtape";
import { loggerDate } from "./helper/loggerDate.ts";

const logger = getLogger("webform-oak-server");

export const healthCheck = (ctx: RouterContext<"/">) => {
  logger.info(
    `${loggerDate()} : User accessed route "/"`,
  );
  ctx.response.status = 200;
  ctx.response.body = "Healthy";
};

export const getAllFileResources = async (
  ctx: RouterContext<"/fileresources">,
) => {
  logger.info(
    `${loggerDate()} : User accessed route "/budget/fileresources"`,
  );
  logger.trace(
    `${loggerDate()} : Running function allFileResources()`,
  );

  const { rowsReturned, rowsAffected } = await allFileResources(
    databasePool,
  );

  logger.trace(
    `${loggerDate()} : Finished running function allFileResources()`,
  );
  logger.debug(
    `${loggerDate()} : ${rowsAffected[0]} rows affected"`,
  );

  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getAvailableBudgetYears = async (
  ctx: RouterContext<"/years">,
) => {
  logger.info(
    `${loggerDate()} : User accessed route "/budget/years"`,
  );
  logger.trace(
    `${loggerDate()} : Running function availableYears()`,
  );

  const { rowsReturned, rowsAffected } = await availableYears(databasePool);

  logger.trace(
    `${loggerDate()} : Finished running function availableYears()`,
  );
  logger.debug(
    `${loggerDate()} : ${rowsAffected[0]} rows affected"`,
  );

  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getAvailableBudgetPeriods = async (
  ctx: RouterContext<"/periods">,
) => {
  logger.info(
    `${loggerDate()} : User accessed route "/budget/periods"`,
  );
  logger.trace(
    `${loggerDate()} : Running function availablePeriods()`,
  );

  const { rowsReturned, rowsAffected } = await availablePeriods(databasePool);

  logger.trace(
    `${loggerDate()} : Finished running function availablePeriods()`,
  );
  logger.debug(
    `${loggerDate()} : ${rowsAffected[0]} rows affected"`,
  );

  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getAllValidNatures = async (
  ctx: RouterContext<"/nature">,
) => {
  logger.info(
    `${loggerDate()} : User accessed route "/budget/nature"`,
  );

  logger.trace(
    `${loggerDate()} : Started searching route parameters`,
  );

  const params = ctx.request.url.searchParams;

  const fullPeriode = params.get("period") || null;
  const fileResource = params.get("fileresource") || null;
  const dept = Number(params.get("dept")) || null;
  const costCenter = params.get("costcenter") || null;

  logger.trace(
    `${loggerDate()} : Finished searching route parameters`,
  );

  logger.debug(
    `${loggerDate()} : Value of fullPeriode is ${fullPeriode}`,
  );
  logger.debug(
    `${loggerDate()} : Value of fileResource is ${fileResource}`,
  );
  logger.debug(
    `${loggerDate()} : Value of dept is ${dept}`,
  );
  logger.debug(
    `${loggerDate()} : Value of costCenter is ${costCenter}`,
  );

  logger.trace(
    `${loggerDate()} : Running function getValidNatures()`,
  );

  const { rowsReturned, rowsAffected } = await getValidNatures(
    databasePool,
    fullPeriode,
    fileResource,
    dept,
    costCenter,
  );

  logger.trace(
    `${loggerDate()} : Finished running function getValidNatures()`,
  );
  logger.debug(
    `${loggerDate()} : ${rowsAffected[0]} rows affected"`,
  );

  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getSingleBalance = async (
  ctx: RouterContext<"/balance">,
) => {
  logger.info(
    `${loggerDate()} : User accessed route "/budget/balance"`,
  );

  logger.trace(
    `${loggerDate()} : Started searching route parameters`,
  );

  const params = ctx.request.url.searchParams;

  logger.trace(
    `${loggerDate()} : Finished searching route parameters`,
  );

  const costCenter = params.get("costcenter") || null;
  const periode = params.get("period") || null;
  const nature = params.get("nature") || null;
  const fileResource = params.get("fileresource") || null;
  const dept = Number(params.get("dept")) || null;

  logger.debug(
    `${loggerDate()} : Value of costCenter is ${costCenter}`,
  );
  logger.debug(
    `${loggerDate()} : Value of periode is ${periode}`,
  );
  logger.debug(
    `${loggerDate()} : Value of nature is ${nature}`,
  );
  logger.debug(
    `${loggerDate()} : Value of fileResource is ${fileResource}`,
  );
  logger.debug(
    `${loggerDate()} : Value of dept is ${dept}`,
  );

  if (
    !costCenter ||
    !periode ||
    !nature ||
    !fileResource ||
    !dept
  ) {
    logger.info(
      `${loggerDate()} : At least 1 parameter was empty when all was required (400 Bad Request)`,
    );
    ctx.response.status = 400;
    return;
  }

  logger.trace(
    `${loggerDate()} : Running function singleBalance()`,
  );

  const { rowsReturned, rowsAffected } = await singleBalance(
    databasePool,
    costCenter,
    periode,
    nature,
    fileResource,
    dept,
  );

  logger.trace(
    `${loggerDate()} : Finished running function singleBalance()`,
  );
  logger.debug(
    `${loggerDate()} : ${rowsAffected[0]} rows affected"`,
  );

  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getBudgetViewInformation = async (
  ctx: RouterContext<"/">,
) => {
  logger.info(
    `${loggerDate()} : User accessed route "/budget/"`,
  );

  logger.trace(
    `${loggerDate()} : Started searching route parameters`,
  );

  const params = ctx.request.url.searchParams;

  logger.trace(
    `${loggerDate()} : Finished searching route parameters`,
  );

  const year = params.get("year") || null;
  const fileResource = params.get("fileresource") || null;

  logger.debug(
    `${loggerDate()} : Value of year is ${year}`,
  );
  logger.debug(
    `${loggerDate()} : Value of fileResource is ${fileResource}`,
  );

  logger.trace(
    `${loggerDate()} : Running function getBudgetsByYear()`,
  );

  const { rowsReturned, rowsAffected } = await getBudgetsByYear(
    databasePool,
    fileResource,
    year,
  );

  logger.trace(
    `${loggerDate()} : Finished running function getBudgetsByYear()`,
  );
  logger.debug(
    `${loggerDate()} : ${rowsAffected[0]} rows affected"`,
  );

  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getReportViewInformation = async (
  ctx: RouterContext<"/report">,
) => {
  logger.info(
    `${loggerDate()} : User accessed route "/budget/report"`,
  );

  logger.trace(
    `${loggerDate()} : Started searching route parameters`,
  );

  const params = ctx.request.url.searchParams;

  logger.trace(
    `${loggerDate()} : Finished searching route parameters`,
  );

  const periode = params.get("periode") || null;
  const fileResource = params.get("fileresource") || null;

  logger.debug(
    `${loggerDate()} : Value of periode is ${periode}`,
  );
  logger.debug(
    `${loggerDate()} : Value of fileResource is ${fileResource}`,
  );

  logger.trace(
    `${loggerDate()} : Running function reportInformation()`,
  );

  const { rowsReturned, rowsAffected } = await reportInformation(
    databasePool,
    periode,
    fileResource,
  );

  logger.trace(
    `${loggerDate()} : Finished running function reportInformation()`,
  );
  logger.debug(
    `${loggerDate()} : ${rowsAffected[0]} rows affected"`,
  );

  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getSpecificRequestItems = async (
  ctx: RouterContext<"/request/:traceId">,
) => {
  logger.info(
    `${loggerDate()} : User accessed route "/frmprd/request"`,
  );

  const traceId = Number(ctx.params.traceId);

  logger.debug(
    `${loggerDate()} : Value of traceId is ${traceId}`,
  );

  logger.trace(
    `${loggerDate()} : Running function getAllRequestItems()`,
  );

  const { rowsReturned, rowsAffected } = await getAllRequestItems(
    databasePool,
    traceId,
  );

  logger.trace(
    `${loggerDate()} : Finished running function getAllRequestItems()`,
  );
  logger.debug(
    `${loggerDate()} : ${rowsAffected[0]} rows affected"`,
  );

  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getRequestsAtBudgetView = async (
  ctx: RouterContext<"/">,
) => {
  logger.info(
    `${loggerDate()} : User accessed route "/frmprh/"`,
  );

  logger.trace(
    `${loggerDate()} : Started searching route parameters`,
  );

  const params = ctx.request.url.searchParams;

  logger.trace(
    `${loggerDate()} : Finished searching route parameters`,
  );

  const nature = params.get("nature") || null;
  const costCenter = params.get("costcenter") || null;
  const startDate = params.get("startdate") || null;
  const endDate = params.get("enddate") || null;

  logger.debug(
    `${loggerDate()} : Value of nature is ${nature}`,
  );
  logger.debug(
    `${loggerDate()} : Value of costCenter is ${costCenter}`,
  );
  logger.debug(
    `${loggerDate()} : Value of startDate is ${startDate}`,
  );
  logger.debug(
    `${loggerDate()} : Value of endDate is ${endDate}`,
  );

  logger.trace(
    `${loggerDate()} : Running function getRequestItemForBudgetView()`,
  );

  const { rowsReturned, rowsAffected } = await getRequestItemForBudgetView(
    databasePool,
    nature,
    costCenter,
    startDate,
    endDate,
  );

  logger.trace(
    `${loggerDate()} : Finished running function getRequestItemForBudgetView()`,
  );
  logger.debug(
    `${loggerDate()} : ${rowsAffected[0]} rows affected"`,
  );

  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getSectionNames = async (ctx: RouterContext<"/names">) => {
  const { rowsReturned, rowsAffected } = await sectionNames(databasePool);

  console.log(rowsAffected);
  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getSectionUsers = async (ctx: RouterContext<"/users">) => {
  logger.info(
    `${loggerDate()} : User accessed route "/section/users"`,
  );

  logger.trace(
    `${loggerDate()} : Running function userSectionMappings()`,
  );

  const { rowsReturned, rowsAffected } = await userSectionMappings(
    databasePool,
  );

  logger.trace(
    `${loggerDate()} : Finished running function userSectionMappings()`,
  );
  logger.debug(
    `${loggerDate()} : ${rowsAffected[0]} rows affected"`,
  );

  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getRequests = async (ctx: RouterContext<"/requests">) => {
  logger.info(
    `${loggerDate()} : User accessed route "/trace/requests"`,
  );

  logger.trace(
    `${loggerDate()} : Started searching route parameters`,
  );

  const params = ctx.request.url.searchParams;

  logger.trace(
    `${loggerDate()} : Finished searching route parameters`,
  );

  const requestorSectionId = params.has("requestorsectionid")
    ? params.get("requestorsectionid")
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

  logger.debug(
    `${loggerDate()} : Value of requestorSectionId is ${requestorSectionId}`,
  );
  logger.debug(
    `${loggerDate()} : Value of status is ${status}`,
  );
  logger.debug(
    `${loggerDate()} : Value of currentSupervisorId is ${currentSupervisorId}`,
  );
  logger.debug(
    `${loggerDate()} : Value of startDate is ${startDate}`,
  );
  logger.debug(
    `${loggerDate()} : Value of endDate is ${endDate}`,
  );
  logger.debug(
    `${loggerDate()} : Value of search is ${search}`,
  );
  logger.debug(
    `${loggerDate()} : Value of pagination is ${pagination}`,
  );
  logger.debug(
    `${loggerDate()} : Value of page is ${page}`,
  );

  logger.trace(
    `${loggerDate()} : Running function homeRequests()`,
  );

  const { rowsReturned, rowsAffected } = await homeRequests(
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

  logger.trace(
    `${loggerDate()} : Finished running function homeRequests()`,
  );
  logger.debug(
    `${loggerDate()} : ${rowsAffected[0]} rows affected"`,
  );

  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getRequestsCount = async (
  ctx: RouterContext<"/requests/count">,
) => {
  logger.info(
    `${loggerDate()} : User accessed route "/trace/requests/count"`,
  );

  logger.trace(
    `${loggerDate()} : Started searching route parameters`,
  );

  const params = ctx.request.url.searchParams;

  logger.trace(
    `${loggerDate()} : Finished searching route parameters`,
  );

  const requestorSectionId = params.has("requestorsectionid")
    ? params.get("requestorsectionid")
    : null;

  const status = params.get("status") || null;

  const currentSupervisorId = params.has("currentsupervisorid")
    ? Number(params.get("currentsupervisorid"))
    : null;

  const startDate = params.get("startdate") || null;

  const endDate = params.get("enddate") || null;

  const search = params.get("search") || null;

  logger.debug(
    `${loggerDate()} : Value of requestorSectionId is ${requestorSectionId}`,
  );
  logger.debug(
    `${loggerDate()} : Value of status is ${status}`,
  );
  logger.debug(
    `${loggerDate()} : Value of currentSupervisorId is ${currentSupervisorId}`,
  );
  logger.debug(
    `${loggerDate()} : Value of startDate is ${startDate}`,
  );
  logger.debug(
    `${loggerDate()} : Value of endDate is ${endDate}`,
  );
  logger.debug(
    `${loggerDate()} : Value of search is ${search}`,
  );

  logger.trace(
    `${loggerDate()} : Running function homeRequestsCount()`,
  );

  const { rowsReturned, rowsAffected } = await homeRequestsCount(
    databasePool,
    requestorSectionId,
    status,
    currentSupervisorId,
    startDate,
    endDate,
    search,
  );

  logger.trace(
    `${loggerDate()} : Finished running function homeRequestsCount()`,
  );
  logger.debug(
    `${loggerDate()} : ${rowsAffected[0]} rows affected"`,
  );

  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getSpecificRequest = async (
  ctx: RouterContext<"/request/:traceId">,
) => {
  logger.info(
    `${loggerDate()} : User accessed route "/trace/request"`,
  );

  const traceId = Number(ctx.params.traceId);

  logger.debug(
    `${loggerDate()} : Value of traceId is ${traceId}`,
  );

  logger.trace(
    `${loggerDate()} : Running function specificRequest()`,
  );

  const { rowsReturned, rowsAffected } = await specificRequest(
    databasePool,
    traceId,
  );

  logger.trace(
    `${loggerDate()} : Finished running function specificRequest()`,
  );
  logger.debug(
    `${loggerDate()} : ${rowsAffected[0]} rows affected"`,
  );

  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getApproverPath = async (
  ctx: RouterContext<"/:traceId">,
) => {
  logger.info(
    `${loggerDate()} : User accessed route "/traced"`,
  );

  const traceId = Number(ctx.params.traceId);

  logger.debug(
    `${loggerDate()} : Value of traceId is ${traceId}`,
  );

  logger.trace(
    `${loggerDate()} : Running function getApproverPathInformation()`,
  );

  const { rowsReturned, rowsAffected } = await getApproverPathInformation(
    databasePool,
    traceId,
  );

  logger.trace(
    `${loggerDate()} : Finished running function getApproverPathInformation()`,
  );
  logger.debug(
    `${loggerDate()} : ${rowsAffected[0]} rows affected"`,
  );

  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getUploadFiles = async (
  ctx: RouterContext<"/:traceId">,
) => {
  logger.info(
    `${loggerDate()} : User accessed route "/uploadfile"`,
  );

  const traceId = Number(ctx.params.traceId);

  logger.debug(
    `${loggerDate()} : Value of traceId is ${traceId}`,
  );

  logger.trace(
    `${loggerDate()} : Running function getMinimumFileInformation()`,
  );

  const { rowsReturned, rowsAffected } = await getMinimumFileInformation(
    databasePool,
    traceId,
  );

  logger.trace(
    `${loggerDate()} : Finished running function getMinimumFileInformation()`,
  );
  logger.debug(
    `${loggerDate()} : ${rowsAffected[0]} rows affected"`,
  );

  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getSupervisorNames = async (
  ctx: RouterContext<"/names">,
) => {
  logger.info(
    `${loggerDate()} : User accessed route "/usermaster/names"`,
  );

  logger.trace(
    `${loggerDate()} : Running function supervisorNames()`,
  );

  const { rowsReturned, rowsAffected } = await supervisorNames(databasePool);

  logger.trace(
    `${loggerDate()} : Finished running function supervisorNames()`,
  );
  logger.debug(
    `${loggerDate()} : ${rowsAffected[0]} rows affected"`,
  );

  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

// POST to table frm_PR_D
// PATCH to table Budget
// POST to table frm_PR_H
// POST to table Trace
// POST to table Trace_D
// POST to table UploadFile
export const submitRequest = async (ctx: RouterContext<"/submit">) => {
  logger.info(
    `${loggerDate()} : User accessed route "/submit"`,
  );

  const formDataRequest: FormData = await ctx.request.body.formData();

  logger.debug(
    `${loggerDate()} : User FormData = {value}`,
    { formDataRequest },
  );

  const files: File[] = formDataRequest.getAll("files") as File[];
  const rawPayload = formDataRequest.get("payload");
  if (typeof rawPayload !== "string") {
    logger.info(
      `${loggerDate()} : typeof rawPayload !== "string" evaluated to true`,
    );
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

  const indonesiaUtc = 7;
  const now = addHours(new Date(), indonesiaUtc);
  const submissionDate = jsDateToMySQLDatetime(now);
  const emailDomain = "ssi.sharp-world.com";

  logger.debug(
    `${loggerDate()} : Value of submissionDate is ${submissionDate}`,
  );

  const transaction = new ssms.Transaction(databasePool);

  transaction.on("error", (err) => {
    logger.error(
      `${loggerDate()} : Internal transaction error caught by listener = {value}`,
      { err },
    );
  });

  logger.trace(
    `${loggerDate()} : Running function getCurrentRateDollar()`,
  );
  const { rowsReturned: rates, rowsAffected: ratesRowAffected } =
    await getCurrentRateDollar(
      databasePool,
    );
  logger.trace(
    `${loggerDate()} : Finished running function getCurrentRateDollar()`,
  );
  logger.debug(
    `${loggerDate()} : ${ratesRowAffected[0]} rows affected"`,
  );

  logger.debug(
    `${loggerDate()} : Value of rates is ${rates}`,
  );

  logger.info(
    `${loggerDate()} : Beginning transaction`,
  );

  try {
    await transaction.begin();

    logger.trace(
      `${loggerDate()} : Running function provisionFormNumber()`,
    );
    const noForm = provisionFormNumber();
    logger.trace(
      `${loggerDate()} : Finished running function provisionFormNumber()`,
    );
    logger.debug(
      `${loggerDate()} : Value of noForm is ${noForm}`,
    );
    logger.trace(
      `${loggerDate()} : Running function provisionPRNumber()`,
    );
    const noPR = await provisionPRNumber(
      transaction,
      payload.firstStep.department,
    );
    logger.trace(
      `${loggerDate()} : Finished running function provisionPRNumber()`,
    );
    logger.debug(
      `${loggerDate()} : Value of noPR is ${noPR}`,
    );
    logger.trace(
      `${loggerDate()} : Running function getSectionIdByName()`,
    );
    const requestorSectionId = await getSectionIdByName(
      transaction,
      payload.firstStep.section,
    );
    logger.trace(
      `${loggerDate()} : Finished running function getSectionIdByName()`,
    );
    logger.debug(
      `${loggerDate()} : Value of requestorSectionId is ${requestorSectionId}`,
    );

    let requestAmount = 0;
    let isRedLight = false;

    logger.trace(
      `${loggerDate()} : Started looping "payload.thirdStep.usages"`,
    );
    for (const usage of payload.thirdStep.usages) {
      logger.debug(
        `${loggerDate()} : Current usage = {value}`,
        { usage },
      );
      const currencyRate = usage.currency === "JPY"
        ? rates.find((rate) => rate.Currency === "YEN")?.Valuation
        : rates.find((rate) => rate.Currency === usage.currency)?.Valuation;

      logger.debug(
        `${loggerDate()} : Value of currencyRate is ${currencyRate}`,
      );

      if (!currencyRate) {
        logger.error(
          `${loggerDate()} : currencyRate does not exist!`,
        );
        throw new Error("Unable to fetch RateDollar values");
      }

      const budgetId =
        `${usage.periode}-${usage.costCenter}-${payload.firstStep.section}`;
      logger.debug(
        `${loggerDate()} : Value of budgetId is ${budgetId}`,
      );
      const quantity = Number(usage.quantity);
      logger.debug(
        `${loggerDate()} : Value of quantity is ${quantity}`,
      );
      const pricePerUnit = Number(usage.unitPrice);
      logger.debug(
        `${loggerDate()} : Value of pricePerUnit is ${pricePerUnit}`,
      );
      const netPriceByCurrencyRate = (quantity * pricePerUnit) / currencyRate;
      logger.debug(
        `${loggerDate()} : Value of netPriceByCurrencyRate is ${netPriceByCurrencyRate}`,
      );

      requestAmount += netPriceByCurrencyRate;

      logger.trace(
        `${loggerDate()} : Running function postUsage()`,
      );

      const { rowsAffected: usageRowsAffected, newUsageId } = await postUsage(
        transaction,
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
      );

      logger.trace(
        `${loggerDate()} : Finished running function postUsage()`,
      );
      logger.debug(
        `${loggerDate()} : ${usageRowsAffected[0]} rows affected"`,
      );
      logger.debug(
        `${loggerDate()} : Value of newUsageId is ${newUsageId}`,
      );

      logger.trace(
        `${loggerDate()} : Running function patchRequestBudget()`,
      );
      const {
        rowsAffected: patchReqBudgetRowsAffected,
        rowsReturned: _patchReqBudgetRows,
      } = await patchRequestBudget(
        transaction,
        netPriceByCurrencyRate,
        usage.costCenter,
        usage.budgetOrNature,
        usage.periode,
        payload.firstStep.fileResource,
        Number(payload.firstStep.department),
      );
      logger.trace(
        `${loggerDate()} : Finished running function patchRequestBudget()`,
      );
      logger.debug(
        `${loggerDate()} : ${patchReqBudgetRowsAffected[0]} rows affected"`,
      );

      logger.trace(
        `${loggerDate()} : Running function singleBalance()`,
      );
      const {
        rowsReturned: natureBalance,
        rowsAffected: natureBalanceRowsAffected,
      } = await singleBalance(
        transaction,
        usage.costCenter,
        usage.periode,
        usage.budgetOrNature,
        payload.firstStep.fileResource,
        Number(payload.firstStep.department),
      );
      logger.trace(
        `${loggerDate()} : Finished running function singleBalance()`,
      );
      logger.debug(
        `${loggerDate()} : ${natureBalanceRowsAffected[0]} rows affected"`,
      );
      logger.debug(
        `${loggerDate()} : Value of natureBalance is {value}`,
        { natureBalance },
      );

      const currentNatureBalance = Number(natureBalance[0].Balance);
      logger.debug(
        `${loggerDate()} : Value of currentNatureBalance is ${currentNatureBalance}`,
      );

      if (!isRedLight && currentNatureBalance < netPriceByCurrencyRate) {
        isRedLight = true;
      }

      logger.debug(
        `${loggerDate()} : Value of isRedLight is ${isRedLight}`,
      );
    }
    logger.trace(
      `${loggerDate()} : Finished looping "payload.thirdStep.usages"`,
    );

    const requestSubject = !isRedLight
      ? payload.secondStep.subject
      : `[RL] ${payload.secondStep.subject}`;
    logger.debug(
      `${loggerDate()} : Value of requestSubject is ${requestSubject}`,
    );

    const initialRemarks = !isRedLight ? "" : "[RL]";
    logger.debug(
      `${loggerDate()} : Value of initialRemarks is ${initialRemarks}`,
    );

    logger.trace(
      `${loggerDate()} : Running function postRequestInformation()`,
    );
    const { rowsAffected: requestInfoRowAffected, newId: requestInfoId } =
      await postRequestInformation(
        transaction,
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

    logger.trace(
      `${loggerDate()} : Finished running function homeRequestsCount()`,
    );
    logger.debug(
      `${loggerDate()} : ${requestInfoRowAffected[0]} rows affected"`,
    );
    logger.debug(
      `${loggerDate()} : Value of requestInfoId is ${requestInfoId}`,
    );

    const supervisorNames = [
      ...payload.fourthStep.approver.map((name) => ({ name, type: "A" })),
      ...payload.fourthStep.releaser.map((name) => ({ name, type: "R" })),
      ...payload.fourthStep.administrator.map((name) => ({
        name,
        type: "ADM",
      })),
    ];
    logger.debug(
      `${loggerDate()} : Value of supervisorNames is ${supervisorNames}`,
    );

    logger.trace(
      `${loggerDate()} : Running function getUserIdByName()`,
    );
    const {
      rowsAffected: initialSupervisorIdRowsAffected,
      userId: initialSupervisorId,
    } = await getUserIdByName(
      transaction,
      payload.fourthStep.approver[0],
    );
    logger.trace(
      `${loggerDate()} : Finished running function getUserIdByName()`,
    );
    logger.debug(
      `${loggerDate()} : ${initialSupervisorIdRowsAffected[0]} rows affected"`,
    );
    logger.debug(
      `${loggerDate()} : Value of initialSupervisorId is ${initialSupervisorId}`,
    );

    logger.trace(
      `${loggerDate()} : Running function postRequestTrace()`,
    );
    const { rowsAffected: newTraceIdRowsAffected, newIDTrace: newTraceId } =
      await postRequestTrace(
        transaction,
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
    logger.trace(
      `${loggerDate()} : Finished running function postRequestTrace()`,
    );
    logger.debug(
      `${loggerDate()} : ${newTraceIdRowsAffected[0]} rows affected"`,
    );
    logger.debug(
      `${loggerDate()} : Value of newTraceId is ${newTraceId}`,
    );

    {
      logger.trace(
        `${loggerDate()} : Started looping "supervisorNames"`,
      );
      let approverStep = 0;
      for (const supervisorName of supervisorNames) {
        logger.debug(
          `${loggerDate()} : Value of supervisorName is ${supervisorName}`,
        );
        logger.trace(
          `${loggerDate()} : Running function getUserIdByName()`,
        );
        const {
          rowsAffected: currentSupervisorRowsAffected,
          userId: supervisorId,
        } = await getUserIdByName(
          transaction,
          supervisorName.name,
        );
        logger.trace(
          `${loggerDate()} : Finished running function getUserIdByName()`,
        );
        logger.debug(
          `${loggerDate()} : ${
            currentSupervisorRowsAffected[0]
          } rows affected"`,
        );
        logger.debug(
          `${loggerDate()} : Value of supervisorId is ${supervisorId}`,
        );

        logger.trace(
          `${loggerDate()} : Running function postRequestApproverPath()`,
        );
        const requestApproverPathRowsAffected = await postRequestApproverPath(
          transaction,
          newTraceId,
          supervisorId,
          supervisorName.type,
          approverStep + 1,
        );
        logger.debug(
          `${loggerDate()} : ${
            requestApproverPathRowsAffected[0]
          } rows affected"`,
        );

        approverStep += 1;
      }
      logger.trace(
        `${loggerDate()} : Finished looping "supervisorNames"`,
      );
    }

    logger.trace(
      `${loggerDate()} : Started looping "payload.fifthStep.files"`,
    );
    for (const file of payload.fifthStep.files) {
      logger.debug(
        `${loggerDate()} : Current file = {value}`,
        { file },
      );
      logger.trace(
        `${loggerDate()} : Running function postRequestFiles()`,
      );
      const { rowsAffected: newUploadRowsAffected, newUploadId } =
        await postRequestFiles(
          transaction,
          noForm,
          payload.secondStep.subject,
          payload.firstStep.name,
          file.name,
          submissionDate,
        );
      logger.trace(
        `${loggerDate()} : Finished running function getUserIdByName()`,
      );
      logger.debug(
        `${loggerDate()} : ${newUploadRowsAffected[0]} rows affected"`,
      );
      logger.debug(
        `${loggerDate()} : Value of newUploadId is ${newUploadId}`,
      );
    }
    logger.trace(
      `${loggerDate()} : Finished looping "payload.fifthStep.files"`,
    );

    logger.info(
      `${loggerDate()} : Comitting transaction`,
    );

    await transaction.commit();

    const successResponse: SubmitResponse = {
      message: "Your purchasing request has been filed successfully!",
      noForm: noForm,
      noPR: noPR,
      traceId: String(newTraceId),
    };

    ctx.response.status = 200;
    ctx.response.body = successResponse;
  } catch (err) {
    try {
      logger.error(
        `${loggerDate()} : Rolling back transaction. {value}`,
        { err },
      );
      const errMessage = err instanceof Error
        ? err.message
        : "Encountered an error. Rolling back...";
      await transaction.rollback();
      const failingResponse: SubmitResponse = {
        message: errMessage,
        noForm: "",
        noPR: "",
        traceId: "",
      };
      ctx.response.status = 500;
      ctx.response.body = failingResponse;
    } catch (rollbackErr) {
      logger.error(
        `${loggerDate()} : Failed rolling back transaction. {value}`,
        { rollbackErr },
      );
      const errMessage = rollbackErr instanceof Error
        ? rollbackErr.message
        : "Failed to rollback transaction completely.";
      const failingResponse: SubmitResponse = {
        message: errMessage,
        noForm: "",
        noPR: "",
        traceId: "",
      };
      ctx.response.status = 500;
      ctx.response.body = failingResponse;
    }
  }
};

export const getAuthInformation = async (
  ctx: RouterContext<"/auth">,
) => {
  logger.info(
    `${loggerDate()} : User accessed route "/usermaster/auth"`,
  );
  logger.trace(
    `${loggerDate()} : Running function getAuthInfo()`,
  );
  const { rowsReturned, rowsAffected } = await getAuthInfo(databasePool);

  logger.trace(
    `${loggerDate()} : Finished running function getAuthInfo()`,
  );
  logger.debug(
    `${loggerDate()} : ${rowsAffected[0]} rows affected"`,
  );

  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const requestJwt = async (ctx: RouterContext<"/request">) => {
  logger.info(
    `${loggerDate()} : User accessed route "/jwt/request"`,
  );

  const authorizedMessage = "Valid credentials";
  const unauthorizedMessage = "Invalid credentials";
  const generationErrMessage = "There was an error in generating the token";

  logger.trace(
    `${loggerDate()} : Running function getKey()`,
  );
  const jwtKey = await getKey();
  logger.trace(
    `${loggerDate()} : Finished running function getKey()`,
  );
  logger.debug(
    `${loggerDate()} : JWT ${jwtKey ? "Exist" : "is missing"}`,
  );
  const jwtHeader: Header = { alg: "HS512", type: "JWT" };
  const nineHourExpiration = getNumericDate(60 * 60 * 9);

  const request: LoginPayload = await ctx.request.body.json();
  logger.debug(
    `${loggerDate()} : Value of request is {value}`,
    { request },
  );

  logger.trace(
    `${loggerDate()} : Running function getAuthInfo()`,
  );
  const { rowsReturned: credentials, rowsAffected: authInfoRowsAffected } =
    await getAuthInfo(
      databasePool,
    );
  logger.trace(
    `${loggerDate()} : Finished running function getAuthInfo()`,
  );
  logger.debug(
    `${loggerDate()} : ${authInfoRowsAffected[0]} rows affected"`,
  );

  let validCredentials: AuthInfo | null = null;

  const isAdmin = request.nrp === "Admin" &&
    request.password ===
      credentials.filter((credential) => credential.IDUser === 1)[0].Password;

  logger.debug(
    `${loggerDate()} : Value of isAdmin is ${isAdmin}`,
  );

  if (isAdmin) {
    const adminCredentials = credentials.filter((credential) =>
      credential.IDUser === 1
    )[0];
    logger.debug(
      `${loggerDate()} : Value of adminCredentials is ${adminCredentials}`,
    );
    validCredentials = adminCredentials;
    logger.debug(
      `${loggerDate()} : Value of validCredentials is ${validCredentials}`,
    );
  } else {
    logger.info(`Started looping for "credentials"`);
    for (const credential of credentials) {
      const validNRP = credential.NRP === request.nrp;
      const validPassword = credential.Password === request.password;
      if (validNRP && validPassword) {
        validCredentials = credential;
        logger.debug(
          `${loggerDate()} : Value of validCredentials is ${validCredentials}`,
        );
        logger.info(`Finished looping early for "credentials"`);
        break;
      }
    }
    logger.info(`Finished looping for "credentials"`);
  }

  if (validCredentials !== null) {
    const jwtPayload: Payload = {
      iss: validCredentials.NRP,
      exp: nineHourExpiration,
      userId: validCredentials.IDUser,
      userName: validCredentials.UserName,
      nameUser: validCredentials.NameUser,
      nrp: validCredentials.NRP,
    };

    logger.debug(
      `${loggerDate()} : Value of jwtPayload is ${jwtPayload}`,
    );

    const jwt = await create(jwtHeader, jwtPayload, jwtKey);
    logger.debug(
      `${loggerDate()} : Value of jwt is ${jwt}`,
    );

    if (jwt) {
      const authorizedResponse: LoginResponse = {
        message: authorizedMessage,
        nrp: validCredentials.NRP,
        jwt: jwt,
      };
      logger.debug(
        `${loggerDate()} : Value of authorizedResponse is ${authorizedResponse}`,
      );

      logger.trace(
        `${loggerDate()} : Running function patchNewLogin()`,
      );
      const newLoginPatchRowsAffected = patchNewLogin(
        databasePool,
        validCredentials.IDUser,
      );

      logger.trace(
        `${loggerDate()} : Finished running function patchNewLogin()`,
      );
      logger.debug(
        `${loggerDate()} : ${newLoginPatchRowsAffected} rows affected"`,
      );
      ctx.response.status = 200;
      ctx.response.body = authorizedResponse;
    } else {
      logger.error(
        `${loggerDate()} : The value of "jwt" does not exist`,
      );
      const errResponse: LoginResponse = {
        message: generationErrMessage,
        nrp: validCredentials.NRP,
        jwt: "",
      };
      ctx.response.status = 500;
      ctx.response.body = errResponse;
    }
    return;
  }

  logger.warning(
    `${loggerDate()} : Incoming NRP and Password does not exist in database`,
  );
  const unauthorizedResponse: LoginResponse = {
    message: unauthorizedMessage,
    nrp: "",
    jwt: "",
  };

  ctx.response.status = 401;
  ctx.response.body = unauthorizedResponse;
};

export const getRequestsBySupervisorNrp = async (
  ctx: RouterContext<"/approve">,
) => {
  logger.info(
    `${loggerDate()} : User accessed route "/trace/approve"`,
  );

  logger.trace(
    `${loggerDate()} : Started searching route parameters`,
  );
  const params = ctx.request.url.searchParams;
  logger.trace(
    `${loggerDate()} : Finished searching route parameters`,
  );

  const startDate = params.get("startdate") || null;

  const endDate = params.get("enddate") || null;

  const search = params.get("search") || null;

  const status = params.get("status") || null;

  const supervisorNrp = params.get("nrp") || null;
  const formattedNrp = supervisorNrp && supervisorNrp !== "null"
    ? onlyNumerics(supervisorNrp)
    : null;

  const page = Number(params.get("page")) || 1;
  const pagination = Number(params.get("pagination")) || 50;

  logger.debug(
    `${loggerDate()} : Value of startDate is ${startDate}`,
  );
  logger.debug(
    `${loggerDate()} : Value of endDate is ${endDate}`,
  );
  logger.debug(
    `${loggerDate()} : Value of search is ${search}`,
  );
  logger.debug(
    `${loggerDate()} : Value of status is ${status}`,
  );
  logger.debug(
    `${loggerDate()} : Value of formattedNrp is ${formattedNrp}`,
  );
  logger.debug(
    `${loggerDate()} : Value of page is ${page}`,
  );
  logger.debug(
    `${loggerDate()} : Value of pagination is ${pagination}`,
  );

  logger.trace(
    `${loggerDate()} : Running function approveRequests()`,
  );
  const { rowsReturned, rowsAffected } = await approveRequests(
    databasePool,
    formattedNrp,
    page,
    pagination,
    status,
    startDate,
    endDate,
    search,
  );

  logger.trace(
    `${loggerDate()} : Finished running function approveRequests()`,
  );
  logger.debug(
    `${loggerDate()} : ${rowsAffected[0]} rows affected"`,
  );

  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getRequestsBySupervisorNrpCount = async (
  ctx: RouterContext<"/approve/count">,
) => {
  logger.info(
    `${loggerDate()} : User accessed route "/trace/approve/count"`,
  );

  logger.trace(
    `${loggerDate()} : Started searching route parameters`,
  );

  const params = ctx.request.url.searchParams;

  logger.trace(
    `${loggerDate()} : Finished searching route parameters`,
  );

  const startDate = params.get("startdate") || null;

  const endDate = params.get("enddate") || null;

  const search = params.get("search") || null;

  const status = params.get("status") || null;

  const supervisorNrp = params.get("nrp") || null;
  const formattedNrp = supervisorNrp && supervisorNrp !== "null"
    ? onlyNumerics(supervisorNrp)
    : null;

  logger.debug(
    `${loggerDate()} : Value of startDate is ${startDate}`,
  );
  logger.debug(
    `${loggerDate()} : Value of endDate is ${endDate}`,
  );
  logger.debug(
    `${loggerDate()} : Value of search is ${search}`,
  );
  logger.debug(
    `${loggerDate()} : Value of status is ${status}`,
  );
  logger.debug(
    `${loggerDate()} : Value of formattedNrp is ${formattedNrp}`,
  );

  logger.trace(
    `${loggerDate()} : Running function approveRequestsCount()`,
  );
  const { rowsReturned, rowsAffected } = await approveRequestsCount(
    databasePool,
    formattedNrp,
    status,
    startDate,
    endDate,
    search,
  );

  logger.trace(
    `${loggerDate()} : Finished running function approveRequestsCount()`,
  );
  logger.debug(
    `${loggerDate()} : ${rowsAffected[0]} rows affected"`,
  );

  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const patchRemarks = async (ctx: RouterContext<"/remarks">) => {
  logger.info(
    `${loggerDate()} : User accessed route "/approve/remarks"`,
  );

  const request: PatchRemarksPayload = await ctx.request.body.json();
  logger.debug(
    `${loggerDate()} : Value of request is {value}`,
    { request },
  );

  logger.trace(
    `${loggerDate()} : Running function patchRemarksOfTrace()`,
  );
  const patchTraceRowsAffected = await patchRemarksOfTrace(
    databasePool,
    request.newRemarks,
    request.noForm,
  );
  logger.trace(
    `${loggerDate()} : Finished running function patchRemarksOfTrace()`,
  );
  logger.debug(
    `${loggerDate()} : ${patchTraceRowsAffected} rows affected"`,
  );

  logger.trace(
    `${loggerDate()} : Running function patchRemarksOfRequest()`,
  );
  const patchRequestRowsAffected = await patchRemarksOfRequest(
    databasePool,
    request.newRemarks,
    request.noForm,
  );
  logger.trace(
    `${loggerDate()} : Finished running function patchRemarksOfRequest()`,
  );
  logger.debug(
    `${loggerDate()} : ${patchRequestRowsAffected} rows affected"`,
  );
  ctx.response.status = 200;
};

export const patchRejectRequest = async (
  ctx: RouterContext<"/reject">,
) => {
  logger.info(
    `${loggerDate()} : User accessed route "/approve/reject"`,
  );
  const request: patchApprovalVerdict = await ctx.request.body.json();

  logger.debug(
    `${loggerDate()} : Value of request is ${request}`,
  );

  const transaction = new ssms.Transaction(databasePool);

  logger.info(
    `${loggerDate()} : Beginning transaction`,
  );

  try {
    await transaction.begin();

    logger.trace(
      `${loggerDate()} : Running function provisionFormNumber()`,
    );
    const { formId, noForm, noPr, requestItems } = await getRequestIds(
      transaction,
      request.traceId,
    );
    logger.trace(
      `${loggerDate()} : Finished running function provisionFormNumber()`,
    );
    logger.debug(
      `${loggerDate()} : Value of formId is ${formId}`,
    );
    logger.debug(
      `${loggerDate()} : Value of noForm is ${noForm}`,
    );
    logger.debug(
      `${loggerDate()} : Value of noPr is ${noPr}`,
    );
    logger.debug(
      `${loggerDate()} : Value of requestItems is {value}`,
      { requestItems },
    );

    logger.trace(
      `${loggerDate()} : Running function patchTraceDVerdict()`,
    );
    const traceDPatchRowsAffected = await patchTraceDVerdict(
      transaction,
      "Rejected",
      request.traceId,
      request.supervisorLevel,
    );
    logger.trace(
      `${loggerDate()} : Finished running function patchTraceDVerdict()`,
    );
    logger.debug(
      `${loggerDate()} : ${traceDPatchRowsAffected} rows affected"`,
    );

    logger.trace(
      `${loggerDate()} : Running function getNextApprover()`,
    );
    const { nextUserId, nextApproverLevel } = await getNextApprover(
      transaction,
      request.traceId,
      request.supervisorId,
      request.supervisorLevel,
    );
    logger.trace(
      `${loggerDate()} : Finished running function getNextApprover()`,
    );
    logger.debug(
      `${loggerDate()} : Value of nextUserId is ${nextUserId}`,
    );
    logger.debug(
      `${loggerDate()} : Value of nextApproverLevel is ${nextApproverLevel}`,
    );

    logger.trace(
      `${loggerDate()} : Running function getOtherApproverInfo()`,
    );
    const { Maxxed: MaxApproverLevel, Summed: SumApproverLevel } =
      await getOtherApproverInfo(transaction, request.traceId);
    logger.trace(
      `${loggerDate()} : Finished running function getOtherApproverInfo()`,
    );
    logger.debug(
      `${loggerDate()} : Value of MaxApproverLevel is ${MaxApproverLevel}`,
    );
    logger.debug(
      `${loggerDate()} : Value of SumApproverLevel is ${SumApproverLevel}`,
    );

    logger.trace(
      `${loggerDate()} : Started looping "requestItems"`,
    );
    // Return requested budget (all items)
    await Promise.all(requestItems.map(async (item) => {
      logger.debug(
        `${loggerDate()} : Current requestItems = {value}`,
        { requestItems },
      );

      logger.trace(
        `${loggerDate()} : Running function patchRequestBudget()`,
      );
      const { rowsAffected: budgetPatchRowsAffeceted, rowsReturned: _ } =
        await patchRequestBudget(
          transaction,
          -item.NetPrice,
          item.CostCenter,
          item.Nature,
          item.Periode,
          item.FileResource,
          Number(item.Department),
        );
      logger.trace(
        `${loggerDate()} : Finished running function patchRequestBudget()`,
      );
      logger.debug(
        `${loggerDate()} : ${budgetPatchRowsAffeceted} rows affected"`,
      );
    }));
    logger.trace(
      `${loggerDate()} : Finished looping "requestItems"`,
    );

    logger.trace(
      `${loggerDate()} : Running function patchTraceVerdict()`,
    );
    const tracePatchRowsAffected = await patchTraceVerdict(
      transaction,
      "Rejected",
      request.traceId,
      MaxApproverLevel,
      SumApproverLevel,
      nextUserId,
      nextApproverLevel,
    );
    logger.trace(
      `${loggerDate()} : Finished running function patchTraceVerdict()`,
    );
    logger.debug(
      `${loggerDate()} : ${tracePatchRowsAffected} rows affected"`,
    );

    await Promise.all(
      request.rejectedItems.map(async (itemId) => {
        logger.trace(
          `${loggerDate()} : Running function patchFrmPRDVerdict()`,
        );
        const frmPrDRowPatchAffected = await patchFrmPRDVerdict(
          transaction,
          String(request.supervisorId),
          itemId,
        );
        logger.trace(
          `${loggerDate()} : Finished running function patchFrmPRDVerdict()`,
        );
        logger.debug(
          `${loggerDate()} : ${frmPrDRowPatchAffected} rows affected"`,
        );
      }),
    );

    logger.info(
      `${loggerDate()} : Comitting transaction`,
    );

    await transaction.commit();

    ctx.response.status = 200;
  } catch (err) {
    logger.error(
      `${loggerDate()} : Rolling back transaction. {value}`,
      { err },
    );
    if (transaction) await transaction.rollback();
    ctx.response.status = 500;
    console.error(err);
  }
};

export const patchAcceptRequest = async (
  ctx: RouterContext<"/accept">,
) => {
  logger.info(
    `${loggerDate()} : User accessed route "/approve/accept"`,
  );

  const request: patchApprovalVerdict = await ctx.request.body.json();

  logger.debug(
    `${loggerDate()} : Value of request is {value}`,
    { request },
  );

  logger.trace(
    `${loggerDate()} : Running function getNextApprover()`,
  );
  const { nextUserId, nextApproverLevel } = await getNextApprover(
    databasePool,
    request.traceId,
    request.supervisorId,
    request.supervisorLevel,
  );
  logger.trace(
    `${loggerDate()} : Finished running function getNextApprover()`,
  );

  logger.debug(
    `${loggerDate()} : Value of nextUserId is ${nextUserId}`,
  );
  logger.debug(
    `${loggerDate()} : Value of nextApproverLevel is ${nextApproverLevel}`,
  );

  logger.trace(
    `${loggerDate()} : Running function patchTraceDVerdict()`,
  );
  const traceDPatchRowsAffected = await patchTraceDVerdict(
    databasePool,
    "Approved",
    request.traceId,
    request.supervisorLevel,
  );
  logger.trace(
    `${loggerDate()} : Finished running function patchTraceDVerdict()`,
  );
  logger.debug(
    `${loggerDate()} : ${traceDPatchRowsAffected} rows affected"`,
  );

  if (nextUserId !== null && nextApproverLevel !== null) {
    logger.trace(
      `${loggerDate()} : Running function patchApproverToActiveApproving()`,
    );
    const toActiveApprovingRowsAffected = await patchApproverToActiveApproving(
      databasePool,
      request.traceId,
      nextApproverLevel,
    );
    logger.trace(
      `${loggerDate()} : Finished running function patchApproverToActiveApproving()`,
    );
    logger.debug(
      `${loggerDate()} : ${toActiveApprovingRowsAffected} rows affected"`,
    );
  }

  logger.trace(
    `${loggerDate()} : Running function getOtherApproverInfo()`,
  );
  const { Maxxed: MaxApproverLevel, Summed: SumApproverLevel } =
    await getOtherApproverInfo(databasePool, request.traceId);
  logger.trace(
    `${loggerDate()} : Finished running function getOtherApproverInfo()`,
  );
  logger.debug(
    `${loggerDate()} : Value of MaxApproverLevel is ${MaxApproverLevel}`,
  );
  logger.debug(
    `${loggerDate()} : Value of SumApproverLevel is ${SumApproverLevel}`,
  );

  logger.trace(
    `${loggerDate()} : Running function patchTraceVerdict()`,
  );

  const tracePatchRowsAffected = await patchTraceVerdict(
    databasePool,
    "Approved",
    request.traceId,
    MaxApproverLevel,
    SumApproverLevel,
    nextUserId,
    nextApproverLevel,
  );
  logger.trace(
    `${loggerDate()} : Finished running function patchTraceVerdict()`,
  );
  logger.debug(
    `${loggerDate()} : ${tracePatchRowsAffected} rows affected"`,
  );

  ctx.response.status = 200;
};

export const putBudgets = async (
  ctx: RouterContext<"/budget">,
) => {
  logger.info(
    `${loggerDate()} : User accessed route "/admin/budget"`,
  );

  const request: BudgetTable[] = await ctx.request.body.json();

  logger.debug(
    `${loggerDate()} : Value of request is {value}`,
    { request },
  );

  if (request.length < 1) {
    ctx.response.status = 400;
    ctx.response.body = "Request body was empty";
    return;
  }

  const transaction = new ssms.Transaction(databasePool);

  try {
    logger.info(
      `${loggerDate()} : Beginning transaction`,
    );
    await transaction.begin();

    logger.trace(
      `${loggerDate()} : Started looping "request"`,
    );
    for (const budgetData of request) {
      logger.debug(
        `${loggerDate()} : Current budgetData is ${budgetData}`,
      );

      const potentialDuplicate: BudgetTable = await getSpecificBudgetData(
        transaction,
        budgetData.CostCenter,
        budgetData.Nature,
        budgetData.Periode,
        budgetData.IDSection,
        budgetData.FileResource,
      );
      logger.debug(
        `${loggerDate()} : Value of potentialDuplicate is ${potentialDuplicate}`,
      );

      let payload: BudgetTable = {
        CostCenter: budgetData.CostCenter,
        Nature: budgetData.Nature,
        Periode: budgetData.Periode,
        Budget: budgetData.Budget,
        Balance: budgetData.Balance,
        IDSection: budgetData.IDSection,
        FileResource: budgetData.FileResource,
      };
      logger.debug(
        `${loggerDate()} : Value of payload is ${payload}`,
      );

      if (potentialDuplicate) {
        const newBudget = budgetData.Budget;
        logger.debug(
          `${loggerDate()} : Value of newBudget is ${newBudget}`,
        );
        const oldBudget = Number(potentialDuplicate.Budget);
        logger.debug(
          `${loggerDate()} : Value of oldBudget is ${oldBudget}`,
        );
        const difference = newBudget - oldBudget;
        logger.debug(
          `${loggerDate()} : Value of difference is ${difference}`,
        );

        payload = {
          ...payload,
          Budget: budgetData.Budget,
          Balance: Number(potentialDuplicate.Balance) + difference,
        };
        logger.debug(
          `${loggerDate()} : Value of payload is ${payload}`,
        );

        logger.trace(
          `${loggerDate()} : Running function patchSpecificBudgetNewBudget()`,
        );
        const newSpecificBudgetRowsAffected =
          await patchSpecificBudgetNewBudget(transaction, payload);
        logger.trace(
          `${loggerDate()} : Finished running function patchSpecificBudgetNewBudget()`,
        );
        logger.debug(
          `${loggerDate()} : ${newSpecificBudgetRowsAffected} rows affected"`,
        );
      } else {
        logger.trace(
          `${loggerDate()} : Running function postBudget()`,
        );
        const newBudgetRowsAffected = await postBudget(transaction, payload);
        logger.trace(
          `${loggerDate()} : Finished running function postBudget()`,
        );
        logger.debug(
          `${loggerDate()} : ${newBudgetRowsAffected} rows affected"`,
        );
      }
    }
    logger.trace(
      `${loggerDate()} : Finished looping "request"`,
    );

    logger.info(
      `${loggerDate()} : Comitting transaction`,
    );
    await transaction.commit();

    ctx.response.status = 200;
  } catch (err) {
    logger.error(
      `${loggerDate()} : Rolling back transaction. {value}`,
      { err },
    );
    await transaction.rollback();
    const errMessage = err instanceof Error ? err.message : "";
    ctx.response.status = 500;
    ctx.response.body = errMessage;
  }
};

export const deleteRequest = async (ctx: RouterContext<"/:traceId">) => {
  logger.info(
    `${loggerDate()} : User accessed route "/admin"`,
  );

  const traceId = Number(ctx.params.traceId);
  logger.debug(
    `${loggerDate()} : Value of traceId is ${traceId}`,
  );

  const transaction = new ssms.Transaction(databasePool);

  try {
    logger.info(
      `${loggerDate()} : Beginning transaction`,
    );
    await transaction.begin();

    const { formId, noForm, noPr, requestItems } = await getRequestIds(
      transaction,
      traceId,
    );
    logger.trace(
      `${loggerDate()} : Finished running function provisionFormNumber()`,
    );
    logger.debug(
      `${loggerDate()} : Value of formId is ${formId}`,
    );
    logger.debug(
      `${loggerDate()} : Value of noForm is ${noForm}`,
    );
    logger.debug(
      `${loggerDate()} : Value of noPr is ${noPr}`,
    );
    logger.debug(
      `${loggerDate()} : Value of requestItems is {value}`,
      { requestItems },
    );

    // POST to table UploadFile
    logger.trace(
      `${loggerDate()} : Running function deleteRequestFiles()`,
    );
    const deleteFilesRowsAffected = await deleteRequestFiles(
      transaction,
      noForm,
    );
    logger.trace(
      `${loggerDate()} : Finished running function deleteRequestFiles()`,
    );
    logger.debug(
      `${loggerDate()} : ${deleteFilesRowsAffected} rows affected"`,
    );

    // DELETE Trace_D
    logger.trace(
      `${loggerDate()} : Running function deleteRequestApproverPath()`,
    );
    const deleteApproverPathRowAffected = await deleteRequestApproverPath(
      transaction,
      traceId,
    );
    logger.trace(
      `${loggerDate()} : Finished running function deleteRequestApproverPath()`,
    );
    logger.debug(
      `${loggerDate()} : ${deleteApproverPathRowAffected} rows affected"`,
    );

    // DELETE Trace
    logger.trace(
      `${loggerDate()} : Running function deleteRequestTrace()`,
    );
    const deleteTraceRowsAffected = await deleteRequestTrace(
      transaction,
      noForm,
    );
    logger.trace(
      `${loggerDate()} : Finished running function deleteRequestTrace()`,
    );
    logger.debug(
      `${loggerDate()} : ${deleteTraceRowsAffected} rows affected"`,
    );

    // DELETE frm_PR_H
    logger.trace(
      `${loggerDate()} : Running function deleteRequestInformation()`,
    );
    const deleteReqInfoRowsAffected = await deleteRequestInformation(
      transaction,
      formId,
    );
    logger.trace(
      `${loggerDate()} : Finished running function deleteRequestInformation()`,
    );
    logger.debug(
      `${loggerDate()} : ${deleteReqInfoRowsAffected} rows affected"`,
    );

    // PATCH Budget
    logger.trace(
      `${loggerDate()} : Started looping "requestItems"`,
    );
    await Promise.all(requestItems.map(async (item) => {
      logger.debug(
        `${loggerDate()} : Current requestItems = {value}`,
        { requestItems },
      );

      logger.trace(
        `${loggerDate()} : Running function patchRequestBudget()`,
      );
      const { rowsAffected: budgetPatchRowsAffeceted, rowsReturned: _ } =
        await patchRequestBudget(
          transaction,
          -item.NetPrice,
          item.CostCenter,
          item.Nature,
          item.Periode,
          item.FileResource,
          Number(item.Department),
        );
      logger.trace(
        `${loggerDate()} : Finished running function patchRequestBudget()`,
      );
      logger.debug(
        `${loggerDate()} : ${budgetPatchRowsAffeceted} rows affected"`,
      );
    }));
    logger.trace(
      `${loggerDate()} : Finished looping "requestItems"`,
    );

    // DELETE frm_PR_D
    logger.trace(
      `${loggerDate()} : Running function deleteRequestItems()`,
    );
    const deleteItemsRowsAffected = await deleteRequestItems(transaction, noPr);
    logger.trace(
      `${loggerDate()} : Finished running function deleteRequestItems()`,
    );
    logger.debug(
      `${loggerDate()} : ${deleteItemsRowsAffected} rows affected"`,
    );

    logger.info(
      `${loggerDate()} : Comitting transaction`,
    );
    await transaction.commit();

    ctx.response.status = 200;
  } catch (err) {
    logger.error(
      `${loggerDate()} : Rolling back transaction. {value}`,
      { err },
    );
    await transaction.rollback();
    ctx.response.status = 500;
    console.error(err);
  }
};

export const getAllValidDepartments = async (
  ctx: RouterContext<"/departments">,
) => {
  logger.info(
    `${loggerDate()} : User accessed route "/budget/departments"`,
  );

  logger.trace(
    `${loggerDate()} : Started searching route parameters`,
  );
  const params = ctx.request.url.searchParams;
  logger.trace(
    `${loggerDate()} : Finished searching route parameters`,
  );

  const fullPeriode = params.get("period") || null;
  const fileResource = params.get("fileresource") || null;

  logger.debug(
    `${loggerDate()} : Value of fullPeriode is ${fullPeriode}`,
  );
  logger.debug(
    `${loggerDate()} : Value of fileResource is ${fileResource}`,
  );

  logger.trace(
    `${loggerDate()} : Running function getValidDepartments()`,
  );
  const { rowsReturned, rowsAffected } = await getValidDepartments(
    databasePool,
    fullPeriode,
    fileResource,
  );
  logger.trace(
    `${loggerDate()} : Finished running function getValidDepartments()`,
  );
  logger.debug(
    `${loggerDate()} : ${rowsAffected[0]} rows affected"`,
  );

  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getAllValidCostCenters = async (
  ctx: RouterContext<"/costcenters">,
) => {
  logger.info(
    `${loggerDate()} : User accessed route "/budget/costcenters"`,
  );

  logger.trace(
    `${loggerDate()} : Started searching route parameters`,
  );
  const params = ctx.request.url.searchParams;
  logger.trace(
    `${loggerDate()} : Finished searching route parameters`,
  );

  const fullPeriode = params.get("period") || null;
  const fileResource = params.get("fileresource") || null;
  const dept = Number(params.get("dept")) || null;

  logger.debug(
    `${loggerDate()} : Value of fullPeriode is ${fullPeriode}`,
  );
  logger.debug(
    `${loggerDate()} : Value of fileResource is ${fileResource}`,
  );
  logger.debug(
    `${loggerDate()} : Value of dept is ${dept}`,
  );

  logger.trace(
    `${loggerDate()} : Running function getValidCostCenters()`,
  );
  const { rowsReturned, rowsAffected } = await getValidCostCenters(
    databasePool,
    fullPeriode,
    fileResource,
    dept,
  );
  logger.trace(
    `${loggerDate()} : Finished running function getValidCostCenters()`,
  );
  logger.debug(
    `${loggerDate()} : ${rowsAffected[0]} rows affected"`,
  );

  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getUploadBudgetTemplate = async (
  ctx: RouterContext<"/template">,
) => {
  logger.info(
    `${loggerDate()} : User accessed route "/admin/template"`,
  );

  const filename = "upload_budget_template.xlsx";
  const options: ContextSendOptions = {
    root: `${Deno.cwd()}/public`,
    path: filename,
  };

  ctx.response.headers.set(
    "Content-Disposition",
    `attachment; filename="${filename}"`,
  );

  logger.trace(
    `${loggerDate()} : Sending template to an admin`,
  );

  await ctx.send(options);
};

export const getForex = async (
  ctx: RouterContext<"/forex">,
) => {
  logger.info(
    `${loggerDate()} : User accessed route "/forex"`,
  );

  logger.trace(
    `${loggerDate()} : Running function getCurrentRateDollar()`,
  );
  const { rowsReturned, rowsAffected } = await getCurrentRateDollar(
    databasePool,
  );
  logger.trace(
    `${loggerDate()} : Finished running function getCurrentRateDollar()`,
  );
  logger.debug(
    `${loggerDate()} : ${rowsAffected[0]} rows affected"`,
  );

  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const patchForex = async (
  ctx: RouterContext<"/ratedollartemp">,
) => {
  logger.info(
    `${loggerDate()} : User accessed route "/admin/ratedollartemp"`,
  );

  logger.trace(
    `${loggerDate()} : Started searching route parameters`,
  );
  const params = ctx.request.url.searchParams;
  logger.trace(
    `${loggerDate()} : Finished searching route parameters`,
  );

  const currency = params.get("currency");
  const newValue = params.get("value");

  logger.debug(
    `${loggerDate()} : Value of currency is ${currency}`,
  );
  logger.debug(
    `${loggerDate()} : Value of newValue is ${newValue}`,
  );

  if (currency === null || newValue === null) {
    logger.warning(
      `At least 1 parameter was empty when all of them are required`,
    );
    ctx.response.status = 400;
    ctx.response.body = "Invalid parameters!";
    return;
  }

  if (isNaN(Number(newValue))) {
    logger.warning(`A new value for a currency is not a valid number`);
    ctx.response.status = 400;
    ctx.response.body = "Invalid parameters!";
    return;
  }

  if (!["IDR", "JPY", "SGD", "USD"].includes(currency)) {
    logger.warning(`The input currency was not found in the database`);
    ctx.response.status = 400;
    ctx.response.body = "Invalid parameters!";
    return;
  }

  logger.trace(
    `${loggerDate()} : Running function patchRateDollarTemp()`,
  );
  const rateDollarTempPatchRowsAffected = await patchRateDollarTemp(
    databasePool,
    currency as "IDR" | "JPY" | "SGD" | "USD",
    Number(newValue),
  );
  logger.trace(
    `${loggerDate()} : Finished running function patchRateDollarTemp()`,
  );
  logger.debug(
    `${loggerDate()} : ${rateDollarTempPatchRowsAffected} rows affected"`,
  );

  ctx.response.status = 200;
};

export const getForexTemp = async (
  ctx: RouterContext<"/forextemp">,
) => {
  logger.info(
    `${loggerDate()} : User accessed route "/forextemp"`,
  );

  logger.trace(
    `${loggerDate()} : Running function getCurrentRateDollarTemp()`,
  );

  const { rowsReturned, rowsAffected } = await getCurrentRateDollarTemp(
    databasePool,
  );
  logger.trace(
    `${loggerDate()} : Finished running function getCurrentRateDollarTemp()`,
  );
  logger.debug(
    `${loggerDate()} : ${rowsAffected[0]} rows affected"`,
  );

  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const patchRateDollar = async () => {
  logger.trace(
    `${loggerDate()} : Running function renewRateDollar()`,
  );
  const rowsAffected = await renewRateDollar(databasePool);
  logger.trace(
    `${loggerDate()} : Finished running function renewRateDollar()`,
  );
  logger.debug(
    `${loggerDate()} : ${rowsAffected} rows affected"`,
  );
};
