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
  ForexAPIResponse,
  LoginPayload,
  LoginResponse,
  patchApprovalVerdict,
  PatchRemarksPayload,
  SubmitPayload,
  SubmitResponse,
} from "@scope/server-ssms";
import provisionFormNumber from "./helper/provisionFormNumber.ts";
import type { ForexRates } from "./models/FrmPRH.d.ts";
import addHours from "./helper/addHours.ts";
import { create, getNumericDate } from "@zaubrik/djwt";
import type { Header, Payload } from "@zaubrik/djwt";
import getKey from "./auth/getKey.ts";
import type { AuthInfo } from "./models/UserMaster.d.ts";
import { onlyNumerics } from "./helper/onlyNumerics.ts";
import { jsDateToMySQLDatetime } from "./helper/jsDateToMySQLDatetime.ts";
import ssms from "mssql";
import type { ContextSendOptions } from "@oak/oak/context";

export const healthCheck = (ctx: RouterContext<"/">) => {
  ctx.response.status = 200;
  ctx.response.body = "Healthy";
};

export const getAllFileResources = async (
  ctx: RouterContext<"/fileresources">,
) => {
  const { rowsReturned, rowsAffected } = await allFileResources(
    databasePool,
  );

  console.log(rowsAffected);
  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getAvailableBudgetYears = async (
  ctx: RouterContext<"/years">,
) => {
  const { rowsReturned, rowsAffected } = await availableYears(databasePool);

  console.log(rowsAffected);
  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getAvailableBudgetPeriods = async (
  ctx: RouterContext<"/periods">,
) => {
  const { rowsReturned, rowsAffected } = await availablePeriods(databasePool);

  console.log(rowsAffected);
  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getAllValidNatures = async (
  ctx: RouterContext<"/nature">,
) => {
  const params = ctx.request.url.searchParams;

  const fullPeriode = params.get("period") || null;
  const fileResource = params.get("fileresource") || null;
  const dept = Number(params.get("dept")) || null;
  const costCenter = params.get("costcenter") || null;

  const { rowsReturned, rowsAffected } = await getValidNatures(
    databasePool,
    fullPeriode,
    fileResource,
    dept,
    costCenter,
  );

  console.log(rowsAffected);
  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getSingleBalance = async (
  ctx: RouterContext<"/balance">,
) => {
  const params = ctx.request.url.searchParams;

  const costCenter = Number(params.get("costcenter")) || null;
  const periode = params.get("period") || null;
  const nature = params.get("nature") || null;
  const fileResource = params.get("fileresource") || null;
  const dept = Number(params.get("dept")) || null;

  if (
    !costCenter ||
    !periode ||
    !nature ||
    !fileResource ||
    !dept
  ) {
    ctx.response.status = 400;
    return;
  }

  const { rowsReturned, rowsAffected } = await singleBalance(
    databasePool,
    costCenter,
    periode,
    nature,
    fileResource,
    dept,
  );

  console.log(rowsAffected);
  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getBudgetViewInformation = async (
  ctx: RouterContext<"/">,
) => {
  const params = ctx.request.url.searchParams;
  const year = params.get("year") || null;
  const fileResource = params.get("fileresource") || null;
  const { rowsReturned, rowsAffected } = await getBudgetsByYear(
    databasePool,
    fileResource,
    year,
  );

  console.log(rowsAffected);
  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getReportViewInformation = async (
  ctx: RouterContext<"/report">,
) => {
  const params = ctx.request.url.searchParams;
  const periode = params.get("periode") || null;
  const fileResource = params.get("fileresource") || null;
  const { rowsReturned, rowsAffected } = await reportInformation(
    databasePool,
    periode,
    fileResource,
  );

  console.log(rowsAffected);
  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getSpecificRequestItems = async (
  ctx: RouterContext<"/request/:traceId">,
) => {
  const traceId = Number(ctx.params.traceId);
  const { rowsReturned, rowsAffected } = await getAllRequestItems(
    databasePool,
    traceId,
  );

  console.log(rowsAffected);
  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getRequestsAtBudgetView = async (
  ctx: RouterContext<"/">,
) => {
  const params = ctx.request.url.searchParams;
  const nature = params.get("nature") || null;
  const costCenter = params.get("costcenter") || null;
  const startDate = params.get("startdate") || null;
  const endDate = params.get("enddate") || null;

  const { rowsReturned, rowsAffected } = await getRequestItemForBudgetView(
    databasePool,
    nature,
    costCenter,
    startDate,
    endDate,
  );

  console.log(rowsAffected);
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
  const { rowsReturned, rowsAffected } = await userSectionMappings(
    databasePool,
  );

  console.log(rowsAffected);
  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getRequests = async (ctx: RouterContext<"/requests">) => {
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

  console.log(rowsAffected);
  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getRequestsCount = async (
  ctx: RouterContext<"/requests/count">,
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

  const { rowsReturned, rowsAffected } = await homeRequestsCount(
    databasePool,
    requestorSectionId,
    status,
    currentSupervisorId,
    startDate,
    endDate,
    search,
  );

  console.log(rowsAffected);
  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getSpecificRequest = async (
  ctx: RouterContext<"/request/:traceId">,
) => {
  const traceId = ctx.params.traceId;

  const { rowsReturned, rowsAffected } = await specificRequest(
    databasePool,
    Number(traceId),
  );

  console.log(rowsAffected);
  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getApproverPath = async (
  ctx: RouterContext<"/:traceId">,
) => {
  const traceId = Number(ctx.params.traceId);

  const { rowsReturned, rowsAffected } = await getApproverPathInformation(
    databasePool,
    traceId,
  );

  console.log(rowsAffected);
  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getUploadFiles = async (
  ctx: RouterContext<"/:traceId">,
) => {
  const traceId = ctx.params.traceId;
  const { rowsReturned, rowsAffected } = await getMinimumFileInformation(
    databasePool,
    traceId,
  );

  console.log(rowsAffected);
  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getSupervisorNames = async (
  ctx: RouterContext<"/names">,
) => {
  const { rowsReturned, rowsAffected } = await supervisorNames(databasePool);

  console.log(rowsAffected);
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
  const submissionDate = jsDateToMySQLDatetime(now);
  const emailDomain = "ssi.sharp-world.com";

  const transaction = new ssms.Transaction(databasePool);

  try {
    await transaction.begin();

    const noForm = provisionFormNumber();
    const [noPR, requestorSectionId] = await Promise.all([
      provisionPRNumber(transaction, payload.firstStep.department),
      getSectionIdByName(transaction, payload.firstStep.section),
    ]);

    let requestAmount = 0;
    let isRedLight = false;

    for (const usage of payload.thirdStep.usages) {
      const currencyRate = usage.currency === "USD"
        ? Number(forexData.amount.toFixed(2))
        : Number(
          forexData.rates[usage.currency as keyof ForexRates].toFixed(2),
        );

      const budgetId =
        `${usage.periode}-${usage.costCenter}-${payload.firstStep.section}`;
      const quantity = Number(usage.quantity);
      const pricePerUnit = Number(usage.unitPrice);
      const netPriceByCurrencyRate = (quantity * pricePerUnit) / currencyRate;

      requestAmount += netPriceByCurrencyRate;

      await postUsage(
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

      patchRequestBudget(
        transaction,
        netPriceByCurrencyRate,
        usage.costCenter,
        usage.budgetOrNature,
        usage.periode,
        payload.firstStep.fileResource,
        payload.firstStep.department,
      );

      const { rowsReturned: natureBalance, rowsAffected } = await singleBalance(
        transaction,
        Number(usage.costCenter),
        usage.periode,
        usage.budgetOrNature,
        payload.firstStep.fileResource,
        Number(payload.firstStep.department),
      );

      console.log(rowsAffected);

      const currentNatureBalance = Number(natureBalance[0].Balance) || 0;

      if (!isRedLight && currentNatureBalance < netPriceByCurrencyRate) {
        isRedLight = true;
      }
    }

    const requestSubject = !isRedLight
      ? payload.secondStep.subject
      : `[RL] ${payload.secondStep.subject}`;

    const initialRemarks = !isRedLight ? "" : "[RL]";

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

    const supervisorNames = [
      ...payload.fourthStep.approver.map((name) => ({ name, type: "A" })),
      ...payload.fourthStep.releaser.map((name) => ({ name, type: "R" })),
      ...payload.fourthStep.administrator.map((name) => ({
        name,
        type: "ADM",
      })),
    ];

    const initialSupervisorId = await getUserIdByName(
      transaction,
      payload.fourthStep.approver[0],
    );

    const newTraceId = await postRequestTrace(
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

    await Promise.all(
      supervisorNames.map(async (supervisorName, index) => {
        const supervisorId = await getUserIdByName(
          transaction,
          supervisorName.name,
        );
        await postRequestApproverPath(
          transaction,
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
          transaction,
          noForm,
          payload.secondStep.subject,
          payload.firstStep.name,
          file.name,
          submissionDate,
        )
      ),
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
    const errMessage = err instanceof Error ? err.message : "";
    const failingResponse: SubmitResponse = {
      message: errMessage,
      noForm: "",
      noPR: "",
      traceId: "",
    };
    if (transaction) await transaction.rollback();
    ctx.response.status = 500;
    ctx.response.body = failingResponse;
  }
};

export const getAuthInformation = async (
  ctx: RouterContext<"/auth">,
) => {
  const { rowsReturned, rowsAffected } = await getAuthInfo(databasePool);

  console.log(rowsAffected);
  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const requestJwt = async (ctx: RouterContext<"/request">) => {
  const authorizedMessage = "Valid credentials";
  const unauthorizedMessage = "Invalid credentials";
  const generationErrMessage = "There was an error in generating the token";

  const jwtKey = await getKey();
  const jwtHeader: Header = { alg: "HS512", type: "JWT" };
  const nineHourExpiration = getNumericDate(60 * 60 * 9);

  const request: LoginPayload = await ctx.request.body.json();

  const { rowsReturned: credentials, rowsAffected: _ } = await getAuthInfo(
    databasePool,
  );

  let validCredentials: AuthInfo | null = null;

  const isAdmin = request.nrp === "Admin" &&
    request.password ===
      credentials.filter((credential) => credential.IDUser === 1)[0].Password;

  if (isAdmin) {
    const adminCredentials = credentials.filter((credential) =>
      credential.IDUser === 1
    )[0];
    validCredentials = adminCredentials;
  } else {
    for (const credential of credentials) {
      const validNRP = credential.NRP === request.nrp;
      const validPassword = credential.Password === request.password;
      if (validNRP && validPassword) {
        validCredentials = credential;
        break;
      }
    }
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

    const jwt = await create(jwtHeader, jwtPayload, jwtKey);

    if (jwt) {
      const authorizedResponse: LoginResponse = {
        message: authorizedMessage,
        nrp: validCredentials.NRP,
        jwt: jwt,
      };
      patchNewLogin(databasePool, validCredentials.IDUser);
      ctx.response.status = 200;
      ctx.response.body = authorizedResponse;
    } else {
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
  const params = ctx.request.url.searchParams;

  const startDate = params.get("startdate") || null;

  const endDate = params.get("enddate") || null;

  const search = params.get("search") || null;

  const status = params.get("status") || null;

  const supervisorNrp = params.get("nrp") || null;
  const formattedNrp = supervisorNrp ? onlyNumerics(supervisorNrp) : null;

  const page = Number(params.get("page")) || 1;
  const pagination = Number(params.get("pagination")) || 50;

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

  console.log(rowsAffected);
  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getRequestsBySupervisorNrpCount = async (
  ctx: RouterContext<"/approve/count">,
) => {
  const params = ctx.request.url.searchParams;

  const startDate = params.get("startdate") || null;

  const endDate = params.get("enddate") || null;

  const search = params.get("search") || null;

  const status = params.get("status") || null;

  const supervisorNrp = params.get("nrp") || null;
  const formattedNrp = supervisorNrp ? onlyNumerics(supervisorNrp) : null;

  const { rowsReturned, rowsAffected } = await approveRequestsCount(
    databasePool,
    formattedNrp,
    status,
    startDate,
    endDate,
    search,
  );

  console.log(rowsAffected);
  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const patchRemarks = async (ctx: RouterContext<"/remarks">) => {
  const request: PatchRemarksPayload = await ctx.request.body.json();
  await patchRemarksOfTrace(databasePool, request.newRemarks, request.noForm);
  await patchRemarksOfRequest(databasePool, request.newRemarks, request.noForm);
  ctx.response.status = 200;
};

export const patchRejectRequest = async (
  ctx: RouterContext<"/reject">,
) => {
  const request: patchApprovalVerdict = await ctx.request.body.json();

  const transaction = new ssms.Transaction(databasePool);

  try {
    await transaction.begin();

    const { formId: _formId, noForm: _noForm, noPr: _noPr, requestItems } =
      await getRequestIds(
        transaction,
        request.traceId,
      );

    await patchTraceDVerdict(
      transaction,
      "Rejected",
      request.traceId,
      request.supervisorLevel,
    );

    const { nextUserId, nextApproverLevel } = await getNextApprover(
      transaction,
      request.traceId,
      request.supervisorId,
      request.supervisorLevel,
    );

    const { Maxxed: MaxApproverLevel, Summed: SumApproverLevel } =
      await getOtherApproverInfo(transaction, request.traceId);

    // Return requested budget (all items)
    await Promise.all(requestItems.map(async (item) => {
      await patchRequestBudget(
        transaction,
        -item.NetPrice,
        item.CostCenter,
        item.Nature,
        item.Periode,
        item.FileResource,
        item.Department,
      );
    }));

    await patchTraceVerdict(
      transaction,
      "Rejected",
      request.traceId,
      MaxApproverLevel,
      SumApproverLevel,
      nextUserId,
      nextApproverLevel,
    );

    await Promise.all(
      request.rejectedItems.map(async (itemId) => {
        await patchFrmPRDVerdict(transaction, request.supervisorId, itemId);
      }),
    );

    await transaction.commit();

    ctx.response.status = 200;
  } catch (err) {
    if (transaction) await transaction.rollback();
    ctx.response.status = 500;
    console.error(err);
  }
};

export const patchAcceptRequest = async (
  ctx: RouterContext<"/accept">,
) => {
  const request: patchApprovalVerdict = await ctx.request.body.json();

  const { nextUserId, nextApproverLevel } = await getNextApprover(
    databasePool,
    request.traceId,
    request.supervisorId,
    request.supervisorLevel,
  );

  await patchTraceDVerdict(
    databasePool,
    "Approved",
    request.traceId,
    request.supervisorLevel,
  );

  if (nextUserId !== null && nextApproverLevel !== null) {
    await patchApproverToActiveApproving(
      databasePool,
      request.traceId,
      nextApproverLevel,
    );
  }

  const { Maxxed: MaxApproverLevel, Summed: SumApproverLevel } =
    await getOtherApproverInfo(databasePool, request.traceId);

  await patchTraceVerdict(
    databasePool,
    "Approved",
    request.traceId,
    MaxApproverLevel,
    SumApproverLevel,
    nextUserId,
    nextApproverLevel,
  );

  ctx.response.status = 200;
};

export const putBudgets = async (
  ctx: RouterContext<"/budget">,
) => {
  const request: BudgetTable[] = await ctx.request.body.json();

  if (request.length < 1) {
    ctx.response.status = 400;
    ctx.response.body = "Request body was empty";
    return;
  }

  const transaction = new ssms.Transaction(databasePool);

  try {
    await transaction.begin();

    for (const budgetData of request) {
      const potentialDuplicate: BudgetTable = await getSpecificBudgetData(
        transaction,
        budgetData.CostCenter,
        budgetData.Nature,
        budgetData.Periode,
        budgetData.IDSection,
        budgetData.FileResource,
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

      if (potentialDuplicate) {
        const newBudget = budgetData.Budget;
        const oldBudget = Number(potentialDuplicate.Budget);
        const difference = newBudget - oldBudget;

        payload = {
          ...payload,
          Budget: budgetData.Budget,
          Balance: Number(potentialDuplicate.Balance) + difference,
        };

        await patchSpecificBudgetNewBudget(transaction, payload);
      } else {
        await postBudget(transaction, payload);
      }
    }

    await transaction.commit();
    ctx.response.status = 200;
  } catch (err) {
    await transaction.rollback();
    const errMessage = err instanceof Error ? err.message : "";
    ctx.response.status = 500;
    ctx.response.body = errMessage;
  }
};

export const deleteRequest = async (ctx: RouterContext<"/:traceId">) => {
  const traceId = Number(ctx.params.traceId);

  const transaction = new ssms.Transaction(databasePool);

  try {
    transaction.begin();

    const { formId, noForm, noPr, requestItems } = await getRequestIds(
      transaction,
      traceId,
    );

    // POST to table UploadFile
    await deleteRequestFiles(transaction, noForm);

    // DELETE Trace_D
    await deleteRequestApproverPath(transaction, traceId);

    // DELETE Trace
    await deleteRequestTrace(transaction, noForm);

    // DELETE frm_PR_H
    await deleteRequestInformation(transaction, formId);

    // PATCH Budget
    await Promise.all(requestItems.map(async (item) => {
      await patchRequestBudget(
        transaction,
        -item.NetPrice,
        item.CostCenter,
        item.Nature,
        item.Periode,
        item.FileResource,
        item.Department,
      );
    }));

    // DELETE frm_PR_D
    await deleteRequestItems(transaction, noPr);

    await transaction.commit();

    ctx.response.status = 200;
  } catch (err) {
    await transaction.rollback();
    ctx.response.status = 500;
    console.error(err);
  }
};

export const getAllValidDepartments = async (
  ctx: RouterContext<"/departments">,
) => {
  const params = ctx.request.url.searchParams;

  const fullPeriode = params.get("period") || null;
  const fileResource = params.get("fileresource") || null;

  const { rowsReturned, rowsAffected } = await getValidDepartments(
    databasePool,
    fullPeriode,
    fileResource,
  );

  console.log(rowsAffected);
  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getAllValidCostCenters = async (
  ctx: RouterContext<"/costcenters">,
) => {
  const params = ctx.request.url.searchParams;

  const fullPeriode = params.get("period") || null;
  const fileResource = params.get("fileresource") || null;
  const dept = Number(params.get("dept")) || null;

  const { rowsReturned, rowsAffected } = await getValidCostCenters(
    databasePool,
    fullPeriode,
    fileResource,
    dept,
  );

  console.log(rowsAffected);
  ctx.response.status = 200;
  ctx.response.body = rowsReturned;
};

export const getUploadBudgetTemplate = async (
  ctx: RouterContext<"/template">,
) => {
  const filename = "upload_budget_template.xlsx";
  const options: ContextSendOptions = {
    root: `${Deno.cwd}/public`,
    path: filename,
  };

  ctx.response.headers.set(
    "Content-Disposition",
    `attachment; filename="${filename}"`,
  );

  await ctx.send(options);
};
