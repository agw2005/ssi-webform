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
  getUserInfoByNRP,
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
} from "@scope/server";
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
import { runParameterizedQuery } from "./helper/runParameterizedQuery.ts";
import { runSimpleQuery } from "./helper/runSimpleQuery.ts";
import type { FinalApprovalPayload } from "@scope/server";

const logger = getLogger("webform-oak-server");

export const healthCheck = (ctx: RouterContext<"/">) => {
  logger.info(
    `User accessed route "/"`,
  );
  ctx.response.status = 200;
  ctx.response.body = "Healthy";
};

export const getAllFileResources = async (
  ctx: RouterContext<"/fileresources">,
) =>
  await runSimpleQuery(
    ctx,
    "/budget/fileresources",
    allFileResources,
    "allFileResources",
  );

export const getAvailableBudgetYears = async (
  ctx: RouterContext<"/years">,
) =>
  await runSimpleQuery(ctx, "/budget/years", availableYears, "availableYears");

export const getAvailableBudgetPeriods = async (
  ctx: RouterContext<"/periods">,
) =>
  await runSimpleQuery(
    ctx,
    "/budget/periods",
    availablePeriods,
    "availablePeriods",
  );

export const getAllValidNatures = async (
  ctx: RouterContext<"/nature">,
) => {
  const route = "/budget/nature";
  logger.info(
    `User accessed route "${route}"`,
  );
  logger.trace(
    `Started searching route parameters`,
  );

  const params = ctx.request.url.searchParams;
  const fullPeriode = params.get("period") || null;
  const fileResource = params.get("fileresource") || null;
  const dept = Number(params.get("dept")) || null;
  const costCenter = params.get("costcenter") || null;

  logger.trace(
    `Finished searching route parameters`,
  );

  logger.debug(
    `Value of fullPeriode is ${fullPeriode}`,
  );
  logger.debug(
    `Value of fileResource is ${fileResource}`,
  );
  logger.debug(
    `Value of dept is ${dept}`,
  );
  logger.debug(
    `Value of costCenter is ${costCenter}`,
  );

  await runParameterizedQuery(
    ctx,
    route,
    "getValidNatures",
    (transaction) =>
      getValidNatures(transaction, fullPeriode, fileResource, dept, costCenter),
  );
};

export const getSingleBalance = async (
  ctx: RouterContext<"/balance">,
) => {
  const route = "/budget/balance";
  logger.info(
    `User accessed route "${route}"`,
  );
  logger.trace(
    `Started searching route parameters`,
  );

  const params = ctx.request.url.searchParams;

  logger.trace(
    `Finished searching route parameters`,
  );

  const costCenter = params.get("costcenter") || null;
  const periode = params.get("period") || null;
  const nature = params.get("nature") || null;
  const fileResource = params.get("fileresource") || null;
  const dept = Number(params.get("dept")) || null;

  logger.debug(
    `Value of costCenter is ${costCenter}`,
  );
  logger.debug(
    `Value of periode is ${periode}`,
  );
  logger.debug(
    `Value of nature is ${nature}`,
  );
  logger.debug(
    `Value of fileResource is ${fileResource}`,
  );
  logger.debug(
    `Value of dept is ${dept}`,
  );

  if (
    !costCenter ||
    !periode ||
    !nature ||
    !fileResource ||
    !dept
  ) {
    logger.info(
      `At least 1 parameter was empty when all was required (400 Bad Request)`,
    );
    ctx.response.status = 400;
    return;
  }

  await runParameterizedQuery(
    ctx,
    route,
    "singleBalance",
    (transaction) =>
      singleBalance(
        transaction,
        costCenter,
        periode,
        nature,
        fileResource,
        dept,
      ),
  );
};

export const getBudgetViewInformation = async (
  ctx: RouterContext<"/">,
) => {
  const route = "/budget/";
  logger.info(
    `User accessed route "${route}"`,
  );

  logger.trace(
    `Started searching route parameters`,
  );

  const params = ctx.request.url.searchParams;

  logger.trace(
    `Finished searching route parameters`,
  );

  const year = params.get("year") || null;
  const fileResource = params.get("fileresource") || null;

  logger.debug(
    `Value of year is ${year}`,
  );
  logger.debug(
    `Value of fileResource is ${fileResource}`,
  );

  await runParameterizedQuery(
    ctx,
    route,
    "getBudgetsByYear",
    (transaction) => getBudgetsByYear(transaction, fileResource, year),
  );
};

export const getReportViewInformation = async (
  ctx: RouterContext<"/report">,
) => {
  const route = "/budget/report";
  logger.info(
    `User accessed route "${route}"`,
  );

  logger.trace(
    `Started searching route parameters`,
  );

  const params = ctx.request.url.searchParams;

  logger.trace(
    `Finished searching route parameters`,
  );

  const periode = params.get("periode") || null;
  const fileResource = params.get("fileresource") || null;

  logger.debug(
    `Value of periode is ${periode}`,
  );
  logger.debug(
    `Value of fileResource is ${fileResource}`,
  );

  await runParameterizedQuery(
    ctx,
    route,
    "reportInformation",
    (transaction) =>
      reportInformation(
        transaction,
        periode,
        fileResource,
      ),
  );
};

export const getSpecificRequestItems = async (
  ctx: RouterContext<"/request/:traceId">,
) => {
  const route = "/frmprd/request";
  logger.info(
    `User accessed route "${route}"`,
  );

  const traceId = Number(ctx.params.traceId);

  logger.debug(
    `Value of traceId is ${traceId}`,
  );

  await runParameterizedQuery(
    ctx,
    route,
    "getAllRequestItems",
    (transaction) =>
      getAllRequestItems(
        transaction,
        traceId,
      ),
  );
};

export const getRequestsAtBudgetView = async (
  ctx: RouterContext<"/">,
) => {
  const route = "/frmprh/";
  logger.info(
    `User accessed route "${route}"`,
  );

  logger.trace(
    `Started searching route parameters`,
  );

  const params = ctx.request.url.searchParams;

  logger.trace(
    `Finished searching route parameters`,
  );

  const nature = params.get("nature") || null;
  const costCenter = params.get("costcenter") || null;
  const startDate = params.get("startdate") || null;
  const endDate = params.get("enddate") || null;

  logger.debug(
    `Value of nature is ${nature}`,
  );
  logger.debug(
    `Value of costCenter is ${costCenter}`,
  );
  logger.debug(
    `Value of startDate is ${startDate}`,
  );
  logger.debug(
    `Value of endDate is ${endDate}`,
  );

  await runParameterizedQuery(
    ctx,
    route,
    "getRequestItemForBudgetView",
    (transaction) =>
      getRequestItemForBudgetView(
        transaction,
        nature,
        costCenter,
        startDate,
        endDate,
      ),
  );
};

export const getSectionNames = async (ctx: RouterContext<"/names">) =>
  await runSimpleQuery(ctx, "/section/names", sectionNames, "sectionNames");

export const getSectionUsers = async (ctx: RouterContext<"/users">) =>
  await runSimpleQuery(
    ctx,
    "/section/users",
    userSectionMappings,
    "userSectionMappings",
  );

export const getRequests = async (ctx: RouterContext<"/requests">) => {
  const route = "/trace/requests";
  logger.info(
    `User accessed route "${route}"`,
  );
  logger.trace(
    `Started searching route parameters`,
  );

  const params = ctx.request.url.searchParams;
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

  logger.trace(
    `Finished searching route parameters`,
  );

  logger.debug(
    `Value of requestorSectionId is ${requestorSectionId}`,
  );
  logger.debug(
    `Value of status is ${status}`,
  );
  logger.debug(
    `Value of currentSupervisorId is ${currentSupervisorId}`,
  );
  logger.debug(
    `Value of startDate is ${startDate}`,
  );
  logger.debug(
    `Value of endDate is ${endDate}`,
  );
  logger.debug(
    `Value of search is ${search}`,
  );
  logger.debug(
    `Value of pagination is ${pagination}`,
  );
  logger.debug(
    `Value of page is ${page}`,
  );

  await runParameterizedQuery(
    ctx,
    route,
    "homeRequests",
    (transaction) =>
      homeRequests(
        transaction,
        page,
        pagination,
        requestorSectionId,
        status,
        currentSupervisorId,
        startDate,
        endDate,
        search,
      ),
  );
};

export const getRequestsCount = async (
  ctx: RouterContext<"/requests/count">,
) => {
  const route = "/trace/requests/count";
  logger.info(
    `User accessed route "${route}"`,
  );

  logger.trace(
    `Started searching route parameters`,
  );

  const params = ctx.request.url.searchParams;

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

  logger.trace(
    `Finished searching route parameters`,
  );

  logger.debug(
    `Value of requestorSectionId is ${requestorSectionId}`,
  );
  logger.debug(
    `Value of status is ${status}`,
  );
  logger.debug(
    `Value of currentSupervisorId is ${currentSupervisorId}`,
  );
  logger.debug(
    `Value of startDate is ${startDate}`,
  );
  logger.debug(
    `Value of endDate is ${endDate}`,
  );
  logger.debug(
    `Value of search is ${search}`,
  );

  await runParameterizedQuery(
    ctx,
    route,
    "homeRequestsCount",
    (transaction) =>
      homeRequestsCount(
        transaction,
        requestorSectionId,
        status,
        currentSupervisorId,
        startDate,
        endDate,
        search,
      ),
  );
};

export const getSpecificRequest = async (
  ctx: RouterContext<"/request/:traceId">,
) => {
  const route = "/trace/request";
  logger.info(
    `User accessed route "${route}"`,
  );

  const traceId = Number(ctx.params.traceId);

  logger.debug(
    `Value of traceId is ${traceId}`,
  );

  await runParameterizedQuery(
    ctx,
    route,
    "specificRequest",
    (transaction) =>
      specificRequest(
        transaction,
        traceId,
      ),
  );
};

export const getApproverPath = async (
  ctx: RouterContext<"/:traceId">,
) => {
  const route = "/traced";
  logger.info(
    `User accessed route "${route}"`,
  );

  const traceId = Number(ctx.params.traceId);

  logger.debug(
    `Value of traceId is ${traceId}`,
  );

  await runParameterizedQuery(
    ctx,
    route,
    "getApproverPathInformation",
    (transaction) =>
      getApproverPathInformation(
        transaction,
        traceId,
      ),
  );
};

export const getUploadFiles = async (
  ctx: RouterContext<"/:traceId">,
) => {
  const route = "/uploadfile";
  logger.info(
    `User accessed route "${route}"`,
  );

  const traceId = Number(ctx.params.traceId);

  logger.debug(
    `Value of traceId is ${traceId}`,
  );

  await runParameterizedQuery(
    ctx,
    route,
    "getMinimumFileInformation",
    (transaction) =>
      getMinimumFileInformation(
        transaction,
        traceId,
      ),
  );
};

export const getSupervisorNames = async (
  ctx: RouterContext<"/names">,
) =>
  await runSimpleQuery(
    ctx,
    "/usermaster/names",
    supervisorNames,
    "supervisorNames",
  );

export const getUserByNRP = async (
  ctx: RouterContext<"/:nrp">,
) => {
  const route = "/nrp";
  logger.info(
    `User accessed route "${route}"`,
  );

  const nrp = ctx.params.nrp;

  logger.debug(`Value of nrp is ${nrp}`);

  await runParameterizedQuery(
    ctx,
    route,
    "getUserInfoByNRP",
    (transaction) =>
      getUserInfoByNRP(
        transaction,
        nrp,
      ),
  );
};

// POST to table frm_PR_D (NoPR)
// PATCH to table Budget
// POST to table frm_PR_H (NoForm, NoPR)
// POST to table Trace (NoForm, IDTrace)
// POST to table Trace_D (IDTrace)
// POST to table UploadFile (NoForm)
export const submitRequest = async (ctx: RouterContext<"/submit">) => {
  const route = "/submit";
  logger.info(
    `User accessed route "${route}"`,
  );

  const formDataRequest: FormData = await ctx.request.body.formData();

  console.log(formDataRequest);

  logger.debug(
    `User FormData = {value}`,
    { formDataRequest },
  );

  const files: File[] = formDataRequest.getAll("files") as File[];
  const rawPayload = formDataRequest.get("payload");
  if (typeof rawPayload !== "string") {
    logger.info(
      `typeof rawPayload !== "string" evaluated to true`,
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
    `Value of submissionDate is ${submissionDate}`,
  );

  const transaction = new ssms.Transaction(databasePool);

  transaction.on("error", (err) => {
    logger.error(
      `Internal transaction error caught by listener = {value}`,
      { err },
    );
  });

  logger.info(
    `Beginning transaction`,
  );

  try {
    await transaction.begin();

    logger.trace(
      `Running function getCurrentRateDollar()`,
    );
    const { rowsReturned: rates, rowsAffected: ratesRowAffected } =
      await getCurrentRateDollar(
        transaction,
      );
    logger.trace(
      `Finished running function getCurrentRateDollar()`,
    );
    logger.debug(
      `${ratesRowAffected[0]} rows affected`,
    );

    logger.debug(
      `Value of rates is ${rates}`,
    );

    logger.trace(
      `Running function provisionFormNumber()`,
    );
    const noForm = provisionFormNumber();
    logger.trace(
      `Finished running function provisionFormNumber()`,
    );
    logger.debug(
      `Value of noForm is ${noForm}`,
    );
    logger.trace(
      `Running function provisionPRNumber()`,
    );
    const noPR = await provisionPRNumber(
      transaction,
      payload.firstStep.department,
    );
    logger.trace(
      `Finished running function provisionPRNumber()`,
    );
    logger.debug(
      `Value of noPR is ${noPR}`,
    );
    logger.trace(
      `Running function getSectionIdByName()`,
    );
    const requestorSectionId = await getSectionIdByName(
      transaction,
      payload.firstStep.section,
    );
    logger.trace(
      `Finished running function getSectionIdByName()`,
    );
    logger.debug(
      `Value of requestorSectionId is ${requestorSectionId}`,
    );

    let requestAmount = 0;
    let isRedLight = false;

    logger.trace(
      `Started looping "payload.thirdStep.usages"`,
    );
    for (const usage of payload.thirdStep.usages) {
      logger.debug(
        `Current usage = {value}`,
        { usage },
      );
      const currencyRate = usage.currency === "JPY"
        ? rates.find((rate) => rate.Currency === "YEN")?.Valuation
        : rates.find((rate) => rate.Currency === usage.currency)?.Valuation;

      logger.debug(
        `Value of currencyRate is ${currencyRate}`,
      );

      if (!currencyRate) {
        logger.error(
          `currencyRate does not exist!`,
        );
        throw new Error("Unable to fetch RateDollar values");
      }

      const budgetId =
        `${usage.periode}-${usage.costCenter}-${payload.firstStep.fileResource}`;
      logger.debug(
        `Value of budgetId is ${budgetId}`,
      );
      const quantity = Number(usage.quantity);
      logger.debug(
        `Value of quantity is ${quantity}`,
      );
      const pricePerUnit = Number(usage.unitPrice);
      logger.debug(
        `Value of pricePerUnit is ${pricePerUnit}`,
      );
      const netPriceByCurrencyRate = (quantity * pricePerUnit) / currencyRate;
      logger.debug(
        `Value of netPriceByCurrencyRate is ${netPriceByCurrencyRate}`,
      );

      requestAmount += netPriceByCurrencyRate;

      logger.trace(
        `Running function postUsage()`,
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
        `Finished running function postUsage()`,
      );
      logger.debug(
        `${usageRowsAffected[0]} rows affected`,
      );
      logger.debug(
        `Value of newUsageId is ${newUsageId}`,
      );

      logger.trace(
        `Running function patchRequestBudget()`,
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
        `Finished running function patchRequestBudget()`,
      );
      logger.debug(
        `${patchReqBudgetRowsAffected[0]} rows affected`,
      );

      logger.trace(
        `Running function singleBalance()`,
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
        `Finished running function singleBalance()`,
      );
      logger.debug(
        `${natureBalanceRowsAffected[0]} rows affected`,
      );
      logger.debug(`Value of natureBalance is ${natureBalance[0].Balance}`);

      const currentNatureBalance = Number(natureBalance[0].Balance);
      logger.debug(
        `Value of currentNatureBalance is ${currentNatureBalance}`,
      );

      if (!isRedLight && currentNatureBalance < netPriceByCurrencyRate) {
        isRedLight = true;
      }

      logger.debug(
        `Value of isRedLight is ${isRedLight}`,
      );
    }
    logger.trace(
      `Finished looping "payload.thirdStep.usages"`,
    );

    const requestSubject = !isRedLight
      ? payload.secondStep.subject
      : `[RL] ${payload.secondStep.subject}`;
    logger.debug(
      `Value of requestSubject is ${requestSubject}`,
    );

    const initialRemarks = !isRedLight ? "" : "[RL]";
    logger.debug(
      `Value of initialRemarks is ${initialRemarks}`,
    );

    logger.trace(
      `Running function postRequestInformation()`,
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
      `Finished running function homeRequestsCount()`,
    );
    logger.debug(
      `${requestInfoRowAffected[0]} rows affected`,
    );
    logger.debug(
      `Value of requestInfoId is ${requestInfoId}`,
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
      `Value of supervisorNames is ${supervisorNames}`,
    );

    logger.trace(
      `Running function getUserIdByName()`,
    );
    const {
      rowsAffected: initialSupervisorIdRowsAffected,
      userId: initialSupervisorId,
    } = await getUserIdByName(
      transaction,
      payload.fourthStep.approver[0],
    );
    logger.trace(
      `Finished running function getUserIdByName()`,
    );
    logger.debug(
      `${initialSupervisorIdRowsAffected[0]} rows affected`,
    );
    logger.debug(
      `Value of initialSupervisorId is ${initialSupervisorId}`,
    );

    logger.trace(
      `Running function postRequestTrace()`,
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
      `Finished running function postRequestTrace()`,
    );
    logger.debug(
      `${newTraceIdRowsAffected[0]} rows affected`,
    );
    logger.debug(
      `Value of newTraceId is ${newTraceId}`,
    );

    {
      logger.trace(
        `Started looping "supervisorNames"`,
      );
      let approverStep = 0;
      for (const supervisorName of supervisorNames) {
        logger.debug(
          `Value of supervisorName is ${supervisorName}`,
        );
        logger.trace(
          `Running function getUserIdByName()`,
        );
        const {
          rowsAffected: currentSupervisorRowsAffected,
          userId: supervisorId,
        } = await getUserIdByName(
          transaction,
          supervisorName.name,
        );
        logger.trace(
          `Finished running function getUserIdByName()`,
        );
        logger.debug(
          `${currentSupervisorRowsAffected[0]} rows affected`,
        );
        logger.debug(
          `Value of supervisorId is ${supervisorId}`,
        );

        logger.trace(
          `Running function postRequestApproverPath()`,
        );
        const requestApproverPathRowsAffected = await postRequestApproverPath(
          transaction,
          newTraceId,
          supervisorId,
          supervisorName.type,
          approverStep + 1,
        );
        logger.debug(
          `${requestApproverPathRowsAffected[0]} rows affected`,
        );

        approverStep += 1;
      }
      logger.trace(
        `Finished looping "supervisorNames"`,
      );
    }

    logger.trace(
      `Started looping "payload.fifthStep.files"`,
    );
    for (const file of payload.fifthStep.files) {
      logger.debug(
        `Current file = {value}`,
        { file },
      );
      logger.trace(
        `Running function postRequestFiles()`,
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
        `Finished running function getUserIdByName()`,
      );
      logger.debug(
        `${newUploadRowsAffected[0]} rows affected`,
      );
      logger.debug(
        `Value of newUploadId is ${newUploadId}`,
      );
    }
    logger.trace(
      `Finished looping "payload.fifthStep.files"`,
    );

    const successResponse: SubmitResponse = {
      message: "Your purchasing request has been filed successfully!",
      noForm: noForm,
      noPR: noPR,
      traceId: String(newTraceId),
    };

    logger.info(
      `Comitting transaction`,
    );

    await transaction.commit();

    ctx.response.status = 200;
    ctx.response.body = successResponse;
  } catch (err) {
    try {
      logger.error(
        `Rolling back transaction. {value}`,
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
        `Failed rolling back transaction. {value}`,
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
) => await runSimpleQuery(ctx, "/usermaster/auth", getAuthInfo, "getAuthInfo");

export const requestJwt = async (ctx: RouterContext<"/request">) => {
  const route = "/jwt/request";
  logger.info(`User accessed route "${route}"`);

  const authorizedMessage = "Valid credentials";
  const unauthorizedMessage = "Invalid credentials";
  const generationErrMessage = "There was an error in generating the token";

  const transaction = new ssms.Transaction(databasePool);

  transaction.on("error", (err) => {
    logger.error(
      `Internal transaction error caught by listener = {value}`,
      { err },
    );
  });

  logger.info(`Beginning transaction`);

  try {
    await transaction.begin();
    logger.trace(`Running function getKey()`);
    const jwtKey = await getKey();
    logger.trace(`Finished running function getKey()`);
    logger.debug(`JWT ${jwtKey ? "Exist" : "is missing"}`);

    const jwtHeader: Header = { alg: "HS512", type: "JWT" };
    const nineHourExpiration = getNumericDate(60 * 60 * 9);
    const request: LoginPayload = await ctx.request.body.json();
    logger.debug(`Value of request is {value}`, { request });

    logger.trace(`Running function getAuthInfo()`);
    const { rowsReturned: credentials, rowsAffected: authInfoRowsAffected } =
      await getAuthInfo(transaction);
    logger.trace(`Finished running function getAuthInfo()`);
    logger.debug(`${authInfoRowsAffected[0]} rows affected`);

    let validCredentials: AuthInfo | null = null;
    const isAdmin = request.nrp === "Admin" &&
      request.password ===
        credentials.filter((credential) => credential.IDUser === 1)[0].Password;
    logger.debug(`Value of isAdmin is ${isAdmin}`);

    if (isAdmin) {
      const adminCredentials = credentials.filter((credential) =>
        credential.IDUser === 1
      )[0];
      logger.debug(`Value of adminCredentials is ${adminCredentials}`);
      validCredentials = adminCredentials;
      logger.debug(`Value of validCredentials is ${validCredentials}`);
    } else {
      logger.info(`Started looping for "credentials"`);
      for (const credential of credentials) {
        const validNRP = credential.NRP === request.nrp;
        const validPassword = credential.Password === request.password;
        if (validNRP && validPassword) {
          validCredentials = credential;
          logger.debug(`Value of validCredentials is ${validCredentials}`);
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
      logger.debug(`Value of jwtPayload is ${jwtPayload}`);
      const jwt = await create(jwtHeader, jwtPayload, jwtKey);
      logger.debug(`Value of jwt is ${jwt}`);

      if (jwt) {
        const authorizedResponse: LoginResponse = {
          message: authorizedMessage,
          nrp: validCredentials.NRP,
          jwt: jwt,
        };
        logger.debug(`Value of authorizedResponse is ${authorizedResponse}`);
        logger.trace(`Running function patchNewLogin()`);
        const newLoginPatchRowsAffected = await patchNewLogin(
          transaction,
          validCredentials.IDUser,
        );
        logger.trace(`Finished running function patchNewLogin()`);
        logger.debug(`${newLoginPatchRowsAffected} rows affected`);

        logger.info(`Comitting transaction`);

        await transaction.commit();

        ctx.response.status = 200;
        ctx.response.body = authorizedResponse;
      } else {
        logger.error(`The value of "jwt" does not exist`);
        const errResponse: LoginResponse = {
          message: generationErrMessage,
          nrp: validCredentials.NRP,
          jwt: "",
        };

        logger.warn(
          `Transaction failed for route "${route}". JWT value does not exist`,
        );

        await transaction.rollback();

        ctx.response.status = 500;
        ctx.response.body = errResponse;
      }
      return;
    }

    logger.warning(`Incoming NRP and Password does not exist in database`);
    const unauthorizedResponse: LoginResponse = {
      message: unauthorizedMessage,
      nrp: "",
      jwt: "",
    };

    logger.warn(
      `Transaction failed for route "${route}". Unauthorized`,
    );

    await transaction.rollback();

    ctx.response.status = 401;
    ctx.response.body = unauthorizedResponse;
  } catch (err) {
    logger.error(`Transaction failed for route "${route}". {value}`, { err });
    ctx.response.status = 500;
    try {
      await transaction.rollback();
    } catch (rollbackErr) {
      logger.error(`Failed rolling back transaction. {value}`, { rollbackErr });
    }
  }
};

export const getRequestsBySupervisorNrp = async (
  ctx: RouterContext<"/approve">,
) => {
  const route = "/trace/approve";
  logger.info(
    `User accessed route "${route}"`,
  );

  logger.trace(
    `Started searching route parameters`,
  );
  const params = ctx.request.url.searchParams;
  logger.trace(
    `Finished searching route parameters`,
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
    `Value of startDate is ${startDate}`,
  );
  logger.debug(
    `Value of endDate is ${endDate}`,
  );
  logger.debug(
    `Value of search is ${search}`,
  );
  logger.debug(
    `Value of status is ${status}`,
  );
  logger.debug(
    `Value of formattedNrp is ${formattedNrp}`,
  );
  logger.debug(
    `Value of page is ${page}`,
  );
  logger.debug(
    `Value of pagination is ${pagination}`,
  );

  await runParameterizedQuery(
    ctx,
    route,
    "approveRequests",
    (transaction) =>
      approveRequests(
        transaction,
        formattedNrp,
        page,
        pagination,
        status,
        startDate,
        endDate,
        search,
      ),
  );
};

export const getRequestsBySupervisorNrpCount = async (
  ctx: RouterContext<"/approve/count">,
) => {
  const route = "/trace/approve/count";
  logger.info(
    `User accessed route "/trace/approve/count"`,
  );

  logger.trace(
    `Started searching route parameters`,
  );

  const params = ctx.request.url.searchParams;

  const startDate = params.get("startdate") || null;
  const endDate = params.get("enddate") || null;
  const search = params.get("search") || null;
  const status = params.get("status") || null;
  const supervisorNrp = params.get("nrp") || null;
  const formattedNrp = supervisorNrp && supervisorNrp !== "null"
    ? onlyNumerics(supervisorNrp)
    : null;

  logger.trace(
    `Finished searching route parameters`,
  );

  logger.debug(
    `Value of startDate is ${startDate}`,
  );
  logger.debug(
    `Value of endDate is ${endDate}`,
  );
  logger.debug(
    `Value of search is ${search}`,
  );
  logger.debug(
    `Value of status is ${status}`,
  );
  logger.debug(
    `Value of formattedNrp is ${formattedNrp}`,
  );

  await runParameterizedQuery(
    ctx,
    route,
    "approveRequestsCount",
    (transaction) =>
      approveRequestsCount(
        transaction,
        formattedNrp,
        status,
        startDate,
        endDate,
        search,
      ),
  );
};

export const patchRemarks = async (ctx: RouterContext<"/remarks">) => {
  const route = "/approve/remarks";
  logger.info(`User accessed route "${route}"`);

  const request: PatchRemarksPayload = await ctx.request.body.json();
  logger.debug(`Value of request is {value}`, { request });
  const transaction = new ssms.Transaction(databasePool);

  transaction.on("error", (err: unknown) => {
    logger.error(
      `Internal transaction error caught by listener = {value}`,
      { err },
    );
  });

  logger.info(`Beginning transaction`);

  try {
    await transaction.begin();

    logger.trace(`Running function patchRemarksOfTrace()`);
    const patchTraceRowsAffected = await patchRemarksOfTrace(
      transaction,
      request.newRemarks,
      request.noForm,
    );
    logger.trace(`Finished running function patchRemarksOfTrace()`);
    logger.debug(`${patchTraceRowsAffected} rows affected`);

    logger.trace(`Running function patchRemarksOfRequest()`);
    const patchRequestRowsAffected = await patchRemarksOfRequest(
      transaction,
      request.newRemarks,
      request.noForm,
    );
    logger.trace(`Finished running function patchRemarksOfRequest()`);
    logger.debug(`${patchRequestRowsAffected} rows affected`);

    logger.info(`Comitting transaction`);

    await transaction.commit();

    ctx.response.status = 200;
  } catch (err) {
    logger.error(`Transaction failed for route "${route}". {value}`, { err });
    ctx.response.status = 500;
    try {
      await transaction.rollback();
    } catch (rollbackErr) {
      logger.error(`Failed rolling back transaction. {value}`, { rollbackErr });
    }
  }
};

export const patchRejectRequest = async (
  ctx: RouterContext<"/reject">,
) => {
  const route = "/approve/reject";
  logger.info(
    `User accessed route "${route}"`,
  );
  const request: patchApprovalVerdict = await ctx.request.body.json();

  logger.debug(
    `Value of request is ${request}`,
  );

  const transaction = new ssms.Transaction(databasePool);

  logger.info(
    `Beginning transaction`,
  );

  try {
    await transaction.begin();

    logger.trace(
      `Running function provisionFormNumber()`,
    );
    const { formId, noForm, noPr, requestItems } = await getRequestIds(
      transaction,
      request.traceId,
    );
    logger.trace(
      `Finished running function provisionFormNumber()`,
    );
    logger.debug(
      `Value of formId is ${formId}`,
    );
    logger.debug(
      `Value of noForm is ${noForm}`,
    );
    logger.debug(
      `Value of noPr is ${noPr}`,
    );
    logger.debug(
      `Value of requestItems is {value}`,
      { requestItems },
    );

    logger.trace(
      `Running function patchTraceDVerdict()`,
    );
    const traceDPatchRowsAffected = await patchTraceDVerdict(
      transaction,
      "Rejected",
      request.traceId,
      request.supervisorId,
      request.supervisorLevel,
    );
    logger.trace(
      `Finished running function patchTraceDVerdict()`,
    );
    logger.debug(
      `${traceDPatchRowsAffected} rows affected`,
    );

    logger.trace(
      `Running function getNextApprover()`,
    );
    const { nextUserId, nextApproverLevel } = await getNextApprover(
      transaction,
      request.traceId,
      request.supervisorId,
      request.supervisorLevel,
    );
    logger.trace(
      `Finished running function getNextApprover()`,
    );
    logger.debug(
      `Value of nextUserId is ${nextUserId}`,
    );
    logger.debug(
      `Value of nextApproverLevel is ${nextApproverLevel}`,
    );

    logger.trace(
      `Running function getOtherApproverInfo()`,
    );
    const { Maxxed: MaxApproverLevel, Summed: SumApproverLevel } =
      await getOtherApproverInfo(transaction, request.traceId);
    logger.trace(
      `Finished running function getOtherApproverInfo()`,
    );
    logger.debug(
      `Value of MaxApproverLevel is ${MaxApproverLevel}`,
    );
    logger.debug(
      `Value of SumApproverLevel is ${SumApproverLevel}`,
    );

    logger.trace(
      `Started looping "requestItems"`,
    );
    // Return requested budget (all items)
    await Promise.all(requestItems.map(async (item) => {
      logger.debug(
        `Current requestItems = {value}`,
        { requestItems },
      );

      logger.trace(
        `Running function patchRequestBudget()`,
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
        `Finished running function patchRequestBudget()`,
      );
      logger.debug(
        `${budgetPatchRowsAffeceted} rows affected`,
      );
    }));
    logger.trace(
      `Finished looping "requestItems"`,
    );

    logger.trace(
      `Running function patchTraceVerdict()`,
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
      `Finished running function patchTraceVerdict()`,
    );
    logger.debug(
      `${tracePatchRowsAffected} rows affected`,
    );

    await Promise.all(
      request.rejectedItems.map(async (itemId) => {
        logger.trace(
          `Running function patchFrmPRDVerdict()`,
        );
        const frmPrDRowPatchAffected = await patchFrmPRDVerdict(
          transaction,
          String(request.supervisorId),
          itemId,
        );
        logger.trace(
          `Finished running function patchFrmPRDVerdict()`,
        );
        logger.debug(
          `${frmPrDRowPatchAffected} rows affected`,
        );
      }),
    );

    logger.info(
      `Comitting transaction`,
    );

    await transaction.commit();

    ctx.response.status = 200;
  } catch (err) {
    logger.error(
      `Transaction failed for route "${route}". {value}`,
      { err },
    );
    ctx.response.status = 500;
    try {
      await transaction.rollback();
    } catch (rollbackErr) {
      logger.error(
        `Failed rolling back transaction. {value}`,
        { rollbackErr },
      );
    }
  }
};

export const patchAcceptRequest = async (
  ctx: RouterContext<"/accept">,
) => {
  const route = "/approve/accept";
  logger.info(
    `User accessed route "${route}"`,
  );

  const request: patchApprovalVerdict = await ctx.request.body.json();

  logger.debug(
    `Value of request is {value}`,
    { request },
  );

  const transaction = new ssms.Transaction(databasePool);

  logger.info(
    `Beginning transaction`,
  );

  try {
    await transaction.begin();

    logger.trace(
      `Running function getNextApprover()`,
    );
    const { nextUserId, nextApproverLevel } = await getNextApprover(
      transaction,
      request.traceId,
      request.supervisorId,
      request.supervisorLevel,
    );
    logger.trace(
      `Finished running function getNextApprover()`,
    );

    logger.debug(
      `Value of nextUserId is ${nextUserId}`,
    );
    logger.debug(
      `Value of nextApproverLevel is ${nextApproverLevel}`,
    );

    logger.trace(
      `Running function patchTraceDVerdict()`,
    );
    const traceDPatchRowsAffected = await patchTraceDVerdict(
      transaction,
      "Approved",
      request.traceId,
      request.supervisorId,
      request.supervisorLevel,
    );
    logger.trace(
      `Finished running function patchTraceDVerdict()`,
    );
    logger.debug(
      `${traceDPatchRowsAffected} rows affected`,
    );

    const isLastSupervisor = nextApproverLevel === null &&
      nextUserId === null;

    if (nextUserId !== null && nextApproverLevel !== null) {
      logger.trace(
        `Running function patchApproverToActiveApproving()`,
      );
      const toActiveApprovingRowsAffected =
        await patchApproverToActiveApproving(
          transaction,
          request.traceId,
          nextApproverLevel,
        );
      logger.trace(
        `Finished running function patchApproverToActiveApproving()`,
      );
      logger.debug(
        `${toActiveApprovingRowsAffected} rows affected`,
      );
    }

    logger.trace(
      `Running function getOtherApproverInfo()`,
    );
    const { Maxxed: MaxApproverLevel, Summed: SumApproverLevel } =
      await getOtherApproverInfo(transaction, request.traceId);
    logger.trace(
      `Finished running function getOtherApproverInfo()`,
    );
    logger.debug(
      `Value of MaxApproverLevel is ${MaxApproverLevel}`,
    );
    logger.debug(
      `Value of SumApproverLevel is ${SumApproverLevel}`,
    );

    logger.trace(
      `Running function patchTraceVerdict()`,
    );

    const tracePatchRowsAffected = await patchTraceVerdict(
      transaction,
      "Approved",
      request.traceId,
      MaxApproverLevel,
      SumApproverLevel,
      nextUserId,
      nextApproverLevel,
    );
    logger.trace(
      `Finished running function patchTraceVerdict()`,
    );
    logger.debug(
      `${tracePatchRowsAffected} rows affected`,
    );

    if (isLastSupervisor) {
      logger.trace(
        `Last supervisor for request of ID Trace ${request.traceId} is approved. Firing final approved API.`,
      );

      logger.trace(
        `Running function getAllRequestItems()`,
      );
      const {
        rowsReturned: requestItems,
        rowsAffected: requestItemsRowsAffected,
      } = await getAllRequestItems(
        transaction,
        request.traceId,
      );
      logger.trace(
        `Finished running function getAllRequestItems()`,
      );
      logger.debug(
        `${requestItemsRowsAffected[0]} rows affected`,
      );

      logger.trace(
        `Running function specificRequest()`,
      );
      const {
        rowsReturned: requestOverview,
        rowsAffected: reqOverviewRowsAffected,
      } = await specificRequest(
        transaction,
        request.traceId,
      );
      logger.trace(
        `Finished running function specificRequest()`,
      );
      logger.debug(
        `${reqOverviewRowsAffected[0]} rows affected`,
      );

      const processedItems = requestItems.map((item) => ({
        Id: item.IDItem,
        CostCenter: item.CostCenter,
        Nature: item.Nature,
        Description: item.Description,
        Quantity: item.Qty,
        Measure: item.Measure,
        PricePerMeasure: item.UnitPrice,
        Currency: item.Currency,
        EstimatedDeliveryDate: item.EstimatedDelivery,
        Vendor: item.Vendor,
        PurchaseReason: item.Reason,
        IsRejected: item.StatusItem === "True" ? true : false,
        RejectedBy: item.StatusItem === "True" ? item.RejectedBy : null,
      }));

      logger.trace(
        `Running function getApproverPathInformation()`,
      );
      const {
        rowsReturned: requestSupervisors,
        rowsAffected: requestSupervisorsRowsAffected,
      } = await getApproverPathInformation(
        transaction,
        request.traceId,
      );
      logger.trace(
        `Finished running function getApproverPathInformation()`,
      );
      logger.debug(
        `${requestSupervisorsRowsAffected[0]} rows affected`,
      );

      logger.trace(
        `Running function getMinimumFileInformation()`,
      );
      const {
        rowsReturned: requestFiles,
        rowsAffected: requestFilesRowsAffected,
      } = await getMinimumFileInformation(
        transaction,
        request.traceId,
      );
      logger.trace(
        `Finished running function getMinimumFileInformation()`,
      );
      logger.debug(
        `${requestFilesRowsAffected[0]} rows affected`,
      );

      const payload: FinalApprovalPayload = {
        Id: requestOverview[0].FormID,
        NoForm: requestOverview[0].NoForm,
        NoPR: requestOverview[0].NoPR,
        Requestor: requestOverview[0].Requestor,
        RequestorNRP: requestOverview[0].RequestorNRP,
        RequestorSection: requestOverview[0].RequestorSection,
        Subject: requestOverview[0].Subject,
        Amount: requestOverview[0].Amount,
        ReturnOnOutgoing: requestOverview[0].ReturnOnOutgoing,
        Remarks: requestOverview[0].Remarks,
        RequestItems: processedItems,
        RequestSupervisors: {
          Approvers: requestSupervisors.filter((supervisor) =>
            supervisor.ApproverType === "A"
          ).map((supervisor) => ({
            Name: supervisor.NameUser,
            NRP: supervisor.NRP,
            ApprovalDate: supervisor.DateApprove,
          })),
          Releasers: requestSupervisors.filter((supervisor) =>
            supervisor.ApproverType === "R"
          ).map((supervisor) => ({
            Name: supervisor.NameUser,
            NRP: supervisor.NRP,
            ApprovalDate: supervisor.DateApprove,
          })),
          Administrators: requestSupervisors.filter((supervisor) =>
            supervisor.ApproverType === "ADM"
          ).map((supervisor) => ({
            Name: supervisor.NameUser,
            NRP: supervisor.NRP,
            ApprovalDate: supervisor.DateApprove,
          })),
        },
        Files: requestFiles.map((file) => ({
          Filename: file.Filename,
          UploadDate: file.DateUpload,
        })),
      };

      ctx.response.status = 200;
      ctx.response.body = payload;
    } else {
      ctx.response.status = 204;
    }

    logger.info(
      `Comitting transaction`,
    );

    await transaction.commit();
  } catch (err) {
    logger.error(
      `Transaction failed for route "${route}". {value}`,
      { err },
    );
    ctx.response.status = 500;
    try {
      await transaction.rollback();
    } catch (rollbackErr) {
      logger.error(
        `Failed rolling back transaction. {value}`,
        { rollbackErr },
      );
    }
  }
};

export const putBudgets = async (
  ctx: RouterContext<"/budget">,
) => {
  const route = "/admin/budget";
  logger.info(
    `User accessed route "${route}"`,
  );

  const request: (Omit<BudgetTable, "Budget" | "Balance"> & {
    Budget: number | null;
    Balance: number | null;
  })[] = await ctx
    .request
    .body.json();

  logger.debug(
    `Value of request is {value}`,
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
      `Beginning transaction`,
    );
    await transaction.begin();

    logger.trace(
      `Started looping "request"`,
    );
    for (const budgetData of request) {
      if (budgetData.Budget === null || budgetData.Balance === null) continue;

      logger.debug(
        `Current budgetData is ${budgetData}`,
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
        `Value of potentialDuplicate is ${potentialDuplicate}`,
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
        `Value of payload is ${payload}`,
      );

      if (potentialDuplicate) {
        const newBudget = budgetData.Budget;
        logger.debug(
          `Value of newBudget is ${newBudget}`,
        );
        const oldBudget = Number(potentialDuplicate.Budget);
        logger.debug(
          `Value of oldBudget is ${oldBudget}`,
        );
        const difference = newBudget - oldBudget;
        logger.debug(
          `Value of difference is ${difference}`,
        );

        payload = {
          ...payload,
          Budget: budgetData.Budget,
          Balance: Number(potentialDuplicate.Balance) + difference,
        };
        logger.debug(
          `Value of payload is ${payload}`,
        );

        logger.trace(
          `Running function patchSpecificBudgetNewBudget()`,
        );
        const newSpecificBudgetRowsAffected =
          await patchSpecificBudgetNewBudget(transaction, payload);
        logger.trace(
          `Finished running function patchSpecificBudgetNewBudget()`,
        );
        logger.debug(
          `${newSpecificBudgetRowsAffected} rows affected`,
        );
      } else {
        logger.trace(
          `Running function postBudget()`,
        );
        const newBudgetRowsAffected = await postBudget(transaction, payload);
        logger.trace(
          `Finished running function postBudget()`,
        );
        logger.debug(
          `${newBudgetRowsAffected} rows affected`,
        );
      }
    }
    logger.trace(
      `Finished looping "request"`,
    );

    logger.info(
      `Comitting transaction`,
    );
    await transaction.commit();

    ctx.response.status = 200;
  } catch (err) {
    logger.error(
      `Transaction failed for route "${route}". {value}`,
      { err },
    );
    ctx.response.status = 500;
    try {
      await transaction.rollback();
    } catch (rollbackErr) {
      logger.error(
        `Failed rolling back transaction. {value}`,
        { rollbackErr },
      );
    }
  }
};

export const deleteRequest = async (ctx: RouterContext<"/:traceId">) => {
  const route = "/admin";
  logger.info(
    `User accessed route "${route}"`,
  );

  const traceId = Number(ctx.params.traceId);
  logger.debug(
    `Value of traceId is ${traceId}`,
  );

  const transaction = new ssms.Transaction(databasePool);

  try {
    logger.info(
      `Beginning transaction`,
    );
    await transaction.begin();

    const { formId, noForm, noPr, requestItems } = await getRequestIds(
      transaction,
      traceId,
    );
    logger.trace(
      `Finished running function provisionFormNumber()`,
    );
    logger.debug(
      `Value of formId is ${formId}`,
    );
    logger.debug(
      `Value of noForm is ${noForm}`,
    );
    logger.debug(
      `Value of noPr is ${noPr}`,
    );
    logger.debug(
      `Value of requestItems is {value}`,
      { requestItems },
    );

    // POST to table UploadFile
    logger.trace(
      `Running function deleteRequestFiles()`,
    );
    const deleteFilesRowsAffected = await deleteRequestFiles(
      transaction,
      noForm,
    );
    logger.trace(
      `Finished running function deleteRequestFiles()`,
    );
    logger.debug(
      `${deleteFilesRowsAffected} rows affected`,
    );

    // DELETE Trace_D
    logger.trace(
      `Running function deleteRequestApproverPath()`,
    );
    const deleteApproverPathRowAffected = await deleteRequestApproverPath(
      transaction,
      traceId,
    );
    logger.trace(
      `Finished running function deleteRequestApproverPath()`,
    );
    logger.debug(
      `${deleteApproverPathRowAffected} rows affected`,
    );
    if (deleteApproverPathRowAffected === 0) {
      throw new Error(`No approver path was deleted. Aborting request.`);
    }

    // DELETE Trace
    logger.trace(
      `Running function deleteRequestTrace()`,
    );
    const deleteTraceRowsAffected = await deleteRequestTrace(
      transaction,
      noForm,
    );
    logger.trace(
      `Finished running function deleteRequestTrace()`,
    );
    logger.debug(
      `${deleteTraceRowsAffected} rows affected`,
    );
    if (deleteTraceRowsAffected === 0) {
      throw new Error(`No request trace was deleted. Aborting request.`);
    }

    // DELETE frm_PR_H
    logger.trace(
      `Running function deleteRequestInformation()`,
    );
    const deleteReqInfoRowsAffected = await deleteRequestInformation(
      transaction,
      formId,
    );
    logger.trace(
      `Finished running function deleteRequestInformation()`,
    );
    logger.debug(
      `${deleteReqInfoRowsAffected} rows affected`,
    );
    if (deleteReqInfoRowsAffected === 0) {
      throw new Error(`No request info was deleted. Aborting request.`);
    }

    // PATCH Budget
    logger.trace(
      `Started looping "requestItems"`,
    );
    await Promise.all(requestItems.map(async (item) => {
      logger.debug(`Current requestItems : `);
      logger.debug(`Value of CostCenter is ${item.CostCenter}`);
      logger.debug(`Value of Department is ${item.Department}`);
      logger.debug(`Value of FileResource is ${item.FileResource}`);
      logger.debug(`Value of Nature is ${item.Nature}`);
      logger.debug(`Value of NetPrice is ${-item.NetPrice}`);
      logger.debug(`Value of Periode is ${item.Periode}`);

      logger.trace(`Running function patchRequestBudget()`);
      const { rowsAffected: budgetPatchRowsAffected, rowsReturned: _ } =
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
        `Finished running function patchRequestBudget()`,
      );
      logger.debug(
        `${budgetPatchRowsAffected[0]} rows affected`,
      );
      if (budgetPatchRowsAffected[0] === 0) {
        throw new Error(`No budget was modified. Aborting request.`);
      }
    }));
    logger.trace(
      `Finished looping "requestItems"`,
    );

    // DELETE frm_PR_D
    logger.trace(
      `Running function deleteRequestItems()`,
    );
    const deleteItemsRowsAffected = await deleteRequestItems(transaction, noPr);
    logger.trace(
      `Finished running function deleteRequestItems()`,
    );
    logger.debug(
      `${deleteItemsRowsAffected} rows affected`,
    );
    if (deleteItemsRowsAffected === 0) {
      throw new Error(`No request items were deleted. Aborting request.`);
    }

    logger.info(
      `Comitting transaction`,
    );
    await transaction.commit();

    ctx.response.status = 200;
  } catch (err) {
    logger.error(
      `Transaction failed for route "${route}". {value}`,
      { err },
    );
    ctx.response.status = 500;
    try {
      await transaction.rollback();
    } catch (rollbackErr) {
      logger.error(
        `Failed rolling back transaction. {value}`,
        { rollbackErr },
      );
    }
  }
};

export const getAllValidDepartments = async (
  ctx: RouterContext<"/departments">,
) => {
  const route = "/budget/departments";
  logger.info(
    `User accessed route "${route}"`,
  );

  logger.trace(
    `Started searching route parameters`,
  );
  const params = ctx.request.url.searchParams;
  logger.trace(
    `Finished searching route parameters`,
  );

  const fullPeriode = params.get("period") || null;
  const fileResource = params.get("fileresource") || null;

  logger.debug(
    `Value of fullPeriode is ${fullPeriode}`,
  );
  logger.debug(
    `Value of fileResource is ${fileResource}`,
  );

  await runParameterizedQuery(
    ctx,
    route,
    "getValidDepartments",
    (transaction) =>
      getValidDepartments(
        transaction,
        fullPeriode,
        fileResource,
      ),
  );
};

export const getAllValidCostCenters = async (
  ctx: RouterContext<"/costcenters">,
) => {
  const route = "/budget/costcenters";
  logger.info(
    `User accessed route "${route}"`,
  );

  logger.trace(
    `Started searching route parameters`,
  );
  const params = ctx.request.url.searchParams;
  logger.trace(
    `Finished searching route parameters`,
  );

  const fullPeriode = params.get("period") || null;
  const fileResource = params.get("fileresource") || null;
  const dept = Number(params.get("dept")) || null;

  logger.debug(
    `Value of fullPeriode is ${fullPeriode}`,
  );
  logger.debug(
    `Value of fileResource is ${fileResource}`,
  );
  logger.debug(
    `Value of dept is ${dept}`,
  );

  await runParameterizedQuery(
    ctx,
    route,
    "getValidCostCenters",
    (transaction) =>
      getValidCostCenters(
        transaction,
        fullPeriode,
        fileResource,
        dept,
      ),
  );
};

export const getUploadBudgetTemplate = async (
  ctx: RouterContext<"/template">,
) => {
  const route = "/admin/template";
  logger.info(
    `User accessed route "${route}"`,
  );

  try {
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
      `Sending template to an admin`,
    );

    await ctx.send(options);
  } catch (err) {
    logger.error(
      `Download failed on route "${route}". {value}`,
      { err },
    );
    ctx.response.status = 500;
  }
};

export const getForex = async (
  ctx: RouterContext<"/forex">,
) =>
  await runSimpleQuery(
    ctx,
    "/forex",
    getCurrentRateDollar,
    "getCurrentRateDollar",
  );

export const patchForex = async (
  ctx: RouterContext<"/ratedollartemp">,
) => {
  const route = "/admin/ratedollartemp";
  logger.info(
    `User accessed route "${route}"`,
  );

  logger.trace(
    `Started searching route parameters`,
  );
  const params = ctx.request.url.searchParams;
  logger.trace(
    `Finished searching route parameters`,
  );

  const currency = params.get("currency");
  const newValue = params.get("value");

  logger.debug(
    `Value of currency is ${currency}`,
  );
  logger.debug(
    `Value of newValue is ${newValue}`,
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

  const transaction = new ssms.Transaction(databasePool);

  transaction.on("error", (err) => {
    logger.error(
      `Internal transaction error caught by listener = {value}`,
      { err },
    );
  });

  logger.info(
    `Beginning transaction`,
  );

  try {
    await transaction.begin();

    logger.trace(
      `Running function patchRateDollarTemp()`,
    );
    const rateDollarTempPatchRowsAffected = await patchRateDollarTemp(
      transaction,
      currency as "IDR" | "JPY" | "SGD" | "USD",
      Number(newValue),
    );
    logger.trace(
      `Finished running function patchRateDollarTemp()`,
    );
    logger.debug(
      `${rateDollarTempPatchRowsAffected} rows affected`,
    );

    logger.info(
      `Comitting transaction`,
    );

    await transaction.commit();

    ctx.response.status = 200;
  } catch (err) {
    logger.error(
      `Transaction failed for route "${route}". {value}`,
      { err },
    );
    ctx.response.status = 500;
    try {
      await transaction.rollback();
    } catch (rollbackErr) {
      logger.error(
        `Failed rolling back transaction. {value}`,
        { rollbackErr },
      );
    }
  }
};

export const getForexTemp = async (
  ctx: RouterContext<"/forextemp">,
) =>
  await runSimpleQuery(
    ctx,
    "/forextemp",
    getCurrentRateDollarTemp,
    "getCurrentRateDollarTemp",
  );

export const patchRateDollar = async () => {
  const transaction = new ssms.Transaction(databasePool);

  transaction.on("error", (err) => {
    logger.error(
      `Internal transaction error caught by listener = {value}`,
      { err },
    );
  });

  logger.info(
    `Beginning transaction`,
  );

  try {
    await transaction.begin();

    logger.trace(
      `Running function ${renewRateDollar.name}()`,
    );
    const rowsAffected = await renewRateDollar(transaction);
    logger.trace(
      `Finished running function ${renewRateDollar.name}()`,
    );
    logger.debug(
      `${rowsAffected} rows affected`,
    );

    logger.info(
      `Comitting transaction`,
    );

    await transaction.commit();
  } catch (err) {
    logger.error(
      `Failed running ${renewRateDollar.name}(). {value}`,
      { err },
    );
    try {
      await transaction.rollback();
    } catch (rollbackErr) {
      logger.error(
        `Failed rolling back transaction. {value}`,
        { rollbackErr },
      );
    }
  }
};
