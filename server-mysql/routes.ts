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
  BudgetData,
  ForexAPIResponse,
  LoginPayload,
  LoginResponse,
  patchApprovalVerdict,
  PatchRemarksPayload,
  SubmitPayload,
  SubmitResponse,
} from "@scope/server-mysql";
import provisionFormNumber from "./helper/provisionFormNumber.ts";
import type { ForexRates } from "./models/FrmPRH.d.ts";
import addHours from "./helper/addHours.ts";
import { create, getNumericDate } from "@zaubrik/djwt";
import type { Header, Payload } from "@zaubrik/djwt";
import getKey from "./auth/getKey.ts";
import type { AuthInfo } from "./models/UserMaster.d.ts";
import { onlyNumerics } from "./helper/onlyNumerics.ts";
import { jsDateToMySQLDatetime } from "./helper/jsDateToMySQLDatetime.ts";

export const healthCheck = (ctx: RouterContext<"/">) => {
  ctx.response.status = 200;
  ctx.response.body = "Healthy";
};

export const getAllFileResources = async (
  ctx: RouterContext<"/budget/fileresources">,
) => {
  const [rows, _metadata] = await allFileResources(databasePool);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getAvailableBudgetYears = async (
  ctx: RouterContext<"/budget/years">,
) => {
  const [rows, _metadata] = await availableYears(databasePool);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getAvailableBudgetPeriods = async (
  ctx: RouterContext<"/budget/periods">,
) => {
  const [rows, _metadata] = await availablePeriods(databasePool);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getAllValidNatures = async (
  ctx: RouterContext<"/budget/nature">,
) => {
  const params = ctx.request.url.searchParams;

  const fullPeriode = params.get("period") || null;
  const fileResource = params.get("fileresource") || null;
  const dept = Number(params.get("dept")) || null;
  const costCenter = params.get("costcenter") || null;

  const [rows, _metadata] = await getValidNatures(
    databasePool,
    fullPeriode,
    fileResource,
    dept,
    costCenter,
  );
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getSingleBalance = async (
  ctx: RouterContext<"/budget/balance">,
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

  const [rows, _metadata] = await singleBalance(
    databasePool,
    costCenter,
    periode,
    nature,
    fileResource,
    dept,
  );
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getBudgetViewInformation = async (
  ctx: RouterContext<"/budget">,
) => {
  const params = ctx.request.url.searchParams;
  const year = params.get("year") || null;
  const fileResource = params.get("fileresource") || null;
  const [rows, _metadata] = await getBudgetsByYear(
    databasePool,
    fileResource,
    year,
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

export const getSpecificRequestItems = async (
  ctx: RouterContext<"/frmprd/request/:traceId">,
) => {
  const traceId = Number(ctx.params.traceId);
  const [rows, _metadata] = await getAllRequestItems(databasePool, traceId);
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
  const submissionDate = jsDateToMySQLDatetime(now);
  const emailDomain = "ssi.sharp-world.com";

  const connection = await databasePool.getConnection();

  try {
    await connection.beginTransaction();

    const noForm = provisionFormNumber();
    const [noPR, requestorSectionId] = await Promise.all([
      provisionPRNumber(connection, payload.firstStep.department),
      getSectionIdByName(connection, payload.firstStep.section),
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
        connection,
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
        connection,
        netPriceByCurrencyRate,
        usage.costCenter,
        usage.budgetOrNature,
        usage.periode,
        payload.firstStep.fileResource,
        payload.firstStep.department,
      );

      const [currentNatureInfo] = await singleBalance(
        connection,
        Number(usage.costCenter),
        usage.periode,
        usage.budgetOrNature,
        payload.firstStep.fileResource,
        Number(payload.firstStep.department),
      );

      const currentNatureBalance = Number(currentNatureInfo[0].Balance) || 0;

      if (!isRedLight && currentNatureBalance < netPriceByCurrencyRate) {
        isRedLight = true;
      }
    }

    const requestSubject = !isRedLight
      ? payload.secondStep.subject
      : `[RL] ${payload.secondStep.subject}`;

    const initialRemarks = !isRedLight ? "" : "[RL]";

    await postRequestInformation(
      connection,
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
      connection,
      payload.fourthStep.approver[0],
    );

    const newTraceId = await postRequestTrace(
      connection,
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
          connection,
          supervisorName.name,
        );
        await postRequestApproverPath(
          connection,
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
          connection,
          noForm,
          payload.secondStep.subject,
          payload.firstStep.name,
          file.name,
          submissionDate,
        )
      ),
    );

    await connection.commit();

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
    await connection.rollback();
    ctx.response.status = 500;
    ctx.response.body = failingResponse;
  } finally {
    connection.release();
  }
};

export const getAuthInformation = async (
  ctx: RouterContext<"/usermaster/auth">,
) => {
  const [rows, _metadata] = await getAuthInfo(databasePool);
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const requestJwt = async (ctx: RouterContext<"/jwt/request">) => {
  const authorizedMessage = "Valid credentials";
  const unauthorizedMessage = "Invalid credentials";
  const generationErrMessage = "There was an error in generating the token";

  const jwtKey = await getKey();
  const jwtHeader: Header = { alg: "HS512", type: "JWT" };
  const nineHourExpiration = getNumericDate(60 * 60 * 9);

  const request: LoginPayload = await ctx.request.body.json();
  const response = await fetch(
    `http://${Deno.env.get("SERVER_HOST")}:${
      Deno.env.get("SERVER_PORT")
    }/usermaster/auth`,
  );
  const credentials: AuthInfo[] = await response.json();

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
      const validNRP = credential.NRP = request.nrp;
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
  ctx: RouterContext<"/trace/approve">,
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

  const [rows, _metadata] = await approveRequests(
    databasePool,
    formattedNrp,
    page,
    pagination,
    status,
    startDate,
    endDate,
    search,
  );
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getRequestsBySupervisorNrpCount = async (
  ctx: RouterContext<"/trace/approve/count">,
) => {
  const params = ctx.request.url.searchParams;

  const startDate = params.get("startdate") || null;

  const endDate = params.get("enddate") || null;

  const search = params.get("search") || null;

  const status = params.get("status") || null;

  const supervisorNrp = params.get("nrp") || null;
  const formattedNrp = supervisorNrp ? onlyNumerics(supervisorNrp) : null;

  const [rows, _metadata] = await approveRequestsCount(
    databasePool,
    formattedNrp,
    status,
    startDate,
    endDate,
    search,
  );
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const patchRemarks = async (ctx: RouterContext<"/approve/remarks">) => {
  const request: PatchRemarksPayload = await ctx.request.body.json();
  await patchRemarksOfTrace(databasePool, request.newRemarks, request.noForm);
  await patchRemarksOfRequest(databasePool, request.newRemarks, request.noForm);
  ctx.response.status = 200;
};

export const patchRejectRequest = async (
  ctx: RouterContext<"/approve/reject">,
) => {
  const request: patchApprovalVerdict = await ctx.request.body.json();
  const connection = await databasePool.getConnection();

  try {
    connection.beginTransaction();

    const { formId: _formId, noForm: _noForm, noPr: _noPr, requestItems } =
      await getRequestIds(
        connection,
        request.traceId,
      );

    await patchTraceDVerdict(
      connection,
      "Rejected",
      request.traceId,
      request.supervisorLevel,
    );

    const { nextUserId, nextApproverLevel } = await getNextApprover(
      connection,
      request.traceId,
      request.supervisorId,
      request.supervisorLevel,
    );

    const { Maxxed: MaxApproverLevel, Summed: SumApproverLevel } =
      await getOtherApproverInfo(connection, request.traceId);

    // Return requested budget (all items)
    await Promise.all(requestItems.map(async (item) => {
      await patchRequestBudget(
        connection,
        -item.NetPrice,
        item.CostCenter,
        item.Nature,
        item.Periode,
        item.FileResource,
        item.Department,
      );
    }));

    await patchTraceVerdict(
      connection,
      "Rejected",
      request.traceId,
      MaxApproverLevel,
      SumApproverLevel,
      nextUserId,
      nextApproverLevel,
    );

    await Promise.all(
      request.rejectedItems.map(async (itemId) => {
        await patchFrmPRDVerdict(connection, request.supervisorId, itemId);
      }),
    );

    await connection.commit();

    ctx.response.status = 200;
  } catch (err) {
    await connection.rollback();
    ctx.response.status = 500;
    console.error(err);
  } finally {
    connection.release();
  }
};

export const patchAcceptRequest = async (
  ctx: RouterContext<"/approve/accept">,
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
  ctx: RouterContext<"/admin/budget">,
) => {
  const request: BudgetData[] = await ctx.request.body.json();

  if (request.length < 1) {
    ctx.response.status = 400;
    ctx.response.body = "Request body was empty";
    return;
  }

  const connection = await databasePool.getConnection();

  try {
    await connection.beginTransaction();

    for (const budgetData of request) {
      const potentialDuplicate: BudgetData = await getSpecificBudgetData(
        connection,
        budgetData.CostCenter,
        budgetData.Nature,
        budgetData.Periode,
        budgetData.IDSection,
        budgetData.FileResource,
      );

      let payload: BudgetData = {
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

        await patchSpecificBudgetNewBudget(connection, payload);
      } else {
        await postBudget(connection, payload);
      }
    }

    await connection.commit();
    ctx.response.status = 200;
  } catch (err) {
    await connection.rollback();
    const errMessage = err instanceof Error ? err.message : "";
    ctx.response.status = 500;
    ctx.response.body = errMessage;
  } finally {
    connection.release();
  }
};

export const deleteRequest = async (ctx: RouterContext<"/admin/:traceId">) => {
  const traceId = Number(ctx.params.traceId);
  const connection = await databasePool.getConnection();

  try {
    connection.beginTransaction();

    const { formId, noForm, noPr, requestItems } = await getRequestIds(
      connection,
      traceId,
    );

    // POST to table UploadFile
    await deleteRequestFiles(connection, noForm);

    // DELETE Trace_D
    await deleteRequestApproverPath(connection, traceId);

    // DELETE Trace
    await deleteRequestTrace(connection, noForm);

    // DELETE frm_PR_H
    await deleteRequestInformation(connection, formId);

    // PATCH Budget
    await Promise.all(requestItems.map(async (item) => {
      await patchRequestBudget(
        connection,
        -item.NetPrice,
        item.CostCenter,
        item.Nature,
        item.Periode,
        item.FileResource,
        item.Department,
      );
    }));

    // DELETE frm_PR_D
    await deleteRequestItems(connection, noPr);

    await connection.commit();

    ctx.response.status = 200;
  } catch (err) {
    await connection.rollback();
    ctx.response.status = 500;
    console.error(err);
  } finally {
    connection.release();
  }
};

export const getAllValidDepartments = async (
  ctx: RouterContext<"/budget/departments">,
) => {
  const params = ctx.request.url.searchParams;

  const fullPeriode = params.get("period") || null;
  const fileResource = params.get("fileresource") || null;

  const [rows, _metadata] = await getValidDepartments(
    databasePool,
    fullPeriode,
    fileResource,
  );
  ctx.response.status = 200;
  ctx.response.body = rows;
};

export const getAllValidCostCenters = async (
  ctx: RouterContext<"/budget/costcenters">,
) => {
  const params = ctx.request.url.searchParams;

  const fullPeriode = params.get("period") || null;
  const fileResource = params.get("fileresource") || null;
  const dept = Number(params.get("dept")) || null;

  const [rows, _metadata] = await getValidCostCenters(
    databasePool,
    fullPeriode,
    fileResource,
    dept,
  );
  ctx.response.status = 200;
  ctx.response.body = rows;
};
