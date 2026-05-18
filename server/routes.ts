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
} from "./controllers/FrmPRD.ts";
import {
  deleteRequestInformation,
  getFileUploadInfo,
  getRequestItemForBudgetView,
  patchRemarksOfRequest,
} from "./controllers/FrmPRH.ts";
import { sectionNames, userSectionMappings } from "./controllers/Section.ts";
import {
  approveRequests,
  approveRequestsCount,
  deleteRequestTrace,
  getRequestIds,
  homeRequests,
  homeRequestsCount,
  patchRemarksOfTrace,
  patchTraceVerdict,
  specificRequest,
} from "./controllers/Trace.ts";
import {
  deleteRequestApproverPath,
  getApproverPathInformation,
  getNextApprover,
  getOtherApproverInfo,
  patchApproverToActiveApproving,
  patchTraceDVerdict,
} from "./controllers/TraceD.ts";
import {
  deleteRequestFiles,
  getMinimumFileInformation,
} from "./controllers/UploadFile.ts";
import {
  getAuthInfo,
  getUserInfoByNRP,
  patchNewLogin,
  supervisorNames,
} from "./controllers/UserMaster.ts";
import type { RouterContext } from "@oak/oak";
import databasePool from "./dbpool.ts";
import {
  appCurrencies,
  type BudgetTable,
  type LoginPayload,
  type LoginResponse,
  type patchApprovalVerdict,
  type PatchRemarksPayload,
  type SubmitPayload,
  type SubmitResponse,
} from "@scope/server";
import { create, getNumericDate } from "@zaubrik/djwt";
import type { Header, Payload } from "@zaubrik/djwt";
import getKey from "./auth/getKey.ts";
import type { AuthInfo } from "./models/UserMaster.d.ts";
import { onlyNumerics } from "./helper/onlyNumerics.ts";
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
import { getRequestInformation } from "./helper/getRequestInformation.ts";
import { newPurchasingRequest } from "./helper/newPurchasingRequest.ts";
import { postRequestFiles } from "./controllers/UploadFile.ts";
import { jsDateToMySQLDatetime } from "./helper/jsDateToMySQLDatetime.ts";
import verdictEmail from "./helper/verdictEmail.ts";

const logger = getLogger("prism-server");

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
    200,
  );

export const getAvailableBudgetYears = async (
  ctx: RouterContext<"/years">,
) =>
  await runSimpleQuery(
    ctx,
    "/budget/years",
    availableYears,
    "availableYears",
    200,
  );

export const getAvailableBudgetPeriods = async (
  ctx: RouterContext<"/periods">,
) =>
  await runSimpleQuery(
    ctx,
    "/budget/periods",
    availablePeriods,
    "availablePeriods",
    200,
  );

export const getAllValidNatures = async (
  ctx: RouterContext<"/nature">,
) => {
  const accessId = crypto.randomUUID();

  const route = "/budget/nature";

  logger.info(
    `User accessed route "${route}"`,
    { accessId: accessId },
  );
  logger.trace(
    `Started searching route parameters`,
    { accessId: accessId },
  );

  const params = ctx.request.url.searchParams;
  const fullPeriode = params.get("period") || null;
  const fileResource = params.get("fileresource") || null;
  const dept = Number(params.get("dept")) || null;
  const costCenter = params.get("costcenter") || null;

  logger.trace(
    `Finished searching route parameters`,
    { accessId: accessId },
  );

  logger.debug(
    `Value of fullPeriode is ${fullPeriode}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of fileResource is ${fileResource}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of dept is ${dept}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of costCenter is ${costCenter}`,
    { accessId: accessId },
  );

  await runParameterizedQuery(
    ctx,
    route,
    "getValidNatures",
    (transaction) =>
      getValidNatures(transaction, fullPeriode, fileResource, dept, costCenter),
    200,
    accessId,
  );
};

export const getSingleBalance = async (
  ctx: RouterContext<"/balance">,
) => {
  const accessId = crypto.randomUUID();

  const route = "/budget/balance";

  logger.info(
    `User accessed route "${route}"`,
    { accessId: accessId },
  );
  logger.trace(
    `Started searching route parameters`,
    { accessId: accessId },
  );

  const params = ctx.request.url.searchParams;

  logger.trace(
    `Finished searching route parameters`,
    { accessId: accessId },
  );

  const costCenter = params.get("costcenter") || null;
  const periode = params.get("period") || null;
  const nature = params.get("nature") || null;
  const fileResource = params.get("fileresource") || null;
  const dept = Number(params.get("dept")) || null;

  logger.debug(
    `Value of costCenter is ${costCenter}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of periode is ${periode}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of nature is ${nature}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of fileResource is ${fileResource}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of dept is ${dept}`,
    { accessId: accessId },
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
      { accessId: accessId },
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
    200,
    accessId,
  );
};

export const getBudgetViewInformation = async (
  ctx: RouterContext<"/">,
) => {
  const accessId = crypto.randomUUID();

  const route = "/budget/";

  logger.info(
    `User accessed route "${route}"`,
    { accessId: accessId },
  );

  logger.trace(
    `Started searching route parameters`,
    { accessId: accessId },
  );

  const params = ctx.request.url.searchParams;

  logger.trace(
    `Finished searching route parameters`,
    { accessId: accessId },
  );

  const year = params.get("year") || null;
  const fileResource = params.get("fileresource") || null;

  logger.debug(
    `Value of year is ${year}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of fileResource is ${fileResource}`,
    { accessId: accessId },
  );

  await runParameterizedQuery(
    ctx,
    route,
    "getBudgetsByYear",
    (transaction) => getBudgetsByYear(transaction, fileResource, year),
    200,
    accessId,
  );
};

export const getReportViewInformation = async (
  ctx: RouterContext<"/report">,
) => {
  const accessId = crypto.randomUUID();

  const route = "/budget/report";

  logger.info(
    `User accessed route "${route}"`,
    { accessId: accessId },
  );

  logger.trace(
    `Started searching route parameters`,
    { accessId: accessId },
  );

  const params = ctx.request.url.searchParams;

  logger.trace(
    `Finished searching route parameters`,
    { accessId: accessId },
  );

  const periode = params.get("periode") || null;
  const fileResource = params.get("fileresource") || null;

  logger.debug(
    `Value of periode is ${periode}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of fileResource is ${fileResource}`,
    { accessId: accessId },
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
    200,
    accessId,
  );
};

export const getSpecificRequestItems = async (
  ctx: RouterContext<"/request/:traceId">,
) => {
  const accessId = crypto.randomUUID();

  const route = "/frmprd/request";

  logger.info(
    `User accessed route "${route}"`,
    { accessId: accessId },
  );

  const traceId = Number(ctx.params.traceId);

  logger.debug(
    `Value of traceId is ${traceId}`,
    { accessId: accessId },
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
    200,
    accessId,
  );
};

export const getRequestsAtBudgetView = async (
  ctx: RouterContext<"/">,
) => {
  const accessId = crypto.randomUUID();

  const route = "/frmprh/";

  logger.info(
    `User accessed route "${route}"`,
    { accessId: accessId },
  );

  logger.trace(
    `Started searching route parameters`,
    { accessId: accessId },
  );

  const params = ctx.request.url.searchParams;

  logger.trace(
    `Finished searching route parameters`,
    { accessId: accessId },
  );

  const nature = params.get("nature") || null;
  const costCenter = params.get("costcenter") || null;
  const startDate = params.get("startdate") || null;
  const endDate = params.get("enddate") || null;

  logger.debug(
    `Value of nature is ${nature}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of costCenter is ${costCenter}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of startDate is ${startDate}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of endDate is ${endDate}`,
    { accessId: accessId },
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
    200,
    accessId,
  );
};

export const getSectionNames = async (ctx: RouterContext<"/names">) =>
  await runSimpleQuery(
    ctx,
    "/section/names",
    sectionNames,
    "sectionNames",
    200,
  );

export const getSectionUsers = async (ctx: RouterContext<"/users">) =>
  await runSimpleQuery(
    ctx,
    "/section/users",
    userSectionMappings,
    "userSectionMappings",
    200,
  );

export const getRequests = async (ctx: RouterContext<"/requests">) => {
  const accessId = crypto.randomUUID();

  const route = "/trace/requests";

  logger.info(
    `User accessed route "${route}"`,
    { accessId: accessId },
  );
  logger.trace(
    `Started searching route parameters`,
    { accessId: accessId },
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
    { accessId: accessId },
  );

  logger.debug(
    `Value of requestorSectionId is ${requestorSectionId}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of status is ${status}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of currentSupervisorId is ${currentSupervisorId}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of startDate is ${startDate}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of endDate is ${endDate}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of search is ${search}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of pagination is ${pagination}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of page is ${page}`,
    { accessId: accessId },
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
    200,
    accessId,
  );
};

export const getRequestsCount = async (
  ctx: RouterContext<"/requests/count">,
) => {
  const accessId = crypto.randomUUID();

  const route = "/trace/requests/count";

  logger.info(`User accessed route "${route}"`, { accessId: accessId });

  logger.trace(`Started searching route parameters`, { accessId: accessId });

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
    { accessId: accessId },
  );

  logger.debug(
    `Value of requestorSectionId is ${requestorSectionId}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of status is ${status}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of currentSupervisorId is ${currentSupervisorId}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of startDate is ${startDate}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of endDate is ${endDate}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of search is ${search}`,
    { accessId: accessId },
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
    200,
    accessId,
  );
};

export const getSpecificRequest = async (
  ctx: RouterContext<"/request/:traceId">,
) => {
  const accessId = crypto.randomUUID();

  const route = "/trace/request";

  logger.info(
    `User accessed route "${route}"`,
    { accessId: accessId },
  );

  const traceId = Number(ctx.params.traceId);

  logger.debug(
    `Value of traceId is ${traceId}`,
    { accessId: accessId },
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
    200,
    accessId,
  );
};

export const getApproverPath = async (
  ctx: RouterContext<"/:traceId">,
) => {
  const accessId = crypto.randomUUID();

  const route = "/traced";

  logger.info(
    `User accessed route "${route}"`,
    { accessId: accessId },
  );

  const traceId = Number(ctx.params.traceId);

  logger.debug(
    `Value of traceId is ${traceId}`,
    { accessId: accessId },
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
    200,
    accessId,
  );
};

export const getUploadFiles = async (
  ctx: RouterContext<"/:traceId">,
) => {
  const accessId = crypto.randomUUID();

  const route = "/uploadfile";

  logger.info(
    `User accessed route "${route}"`,
    { accessId: accessId },
  );

  const traceId = Number(ctx.params.traceId);

  logger.debug(
    `Value of traceId is ${traceId}`,
    { accessId: accessId },
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
    200,
    accessId,
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
    200,
  );

export const getUserByNRP = async (
  ctx: RouterContext<"/:nrp">,
) => {
  const accessId = crypto.randomUUID();

  const route = "/nrp";

  logger.info(
    `User accessed route "${route}"`,
    { accessId: accessId },
  );

  const nrp = ctx.params.nrp;

  logger.debug(`Value of nrp is ${nrp}`, { accessId: accessId });

  await runParameterizedQuery(
    ctx,
    route,
    "getUserInfoByNRP",
    (transaction) =>
      getUserInfoByNRP(
        transaction,
        nrp,
      ),
    200,
    accessId,
  );
};

export const submitRequest = async (ctx: RouterContext<"/submit">) => {
  const accessId = crypto.randomUUID();

  const route = "/submit";

  logger.info(`User accessed route "${route}"`, { accessId: accessId });

  const formDataRequest: FormData = await ctx.request.body.formData();
  logger.debug(`${formDataRequest}`, { accessId: accessId });

  const rawPayload = formDataRequest.get("payload");
  if (typeof rawPayload !== "string") {
    logger.info(
      `typeof rawPayload !== "string" evaluated to true`,
      { accessId: accessId },
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

  const files: File[] = formDataRequest.getAll("files") as File[];

  const truePayload: SubmitPayload = {
    ...parsedPayload,
    fifthStep: {
      files: files,
    },
  };

  const transaction = new ssms.Transaction(databasePool);

  transaction.on("error", (err) => {
    logger.error(
      `Internal transaction error caught by listener = ${err}`,
      { accessId: accessId },
    );
  });

  logger.info(`Beginning transaction`, { accessId: accessId });

  try {
    await transaction.begin();

    const { noForm, noPR, traceId } = await newPurchasingRequest(
      transaction,
      truePayload,
      accessId,
    );

    const successResponse: SubmitResponse = {
      message: "Your purchasing request has been filed successfully!",
      noForm: noForm,
      noPR: noPR,
      traceId: String(traceId),
    };

    logger.info(`Comitting transaction`, { accessId: accessId });

    await transaction.commit();

    ctx.response.status = 201;
    ctx.response.body = successResponse;
  } catch (err) {
    try {
      logger.error(`Rolling back transaction. ${err}`, { accessId: accessId });
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
        `Failed rolling back transaction. ${rollbackErr}`,
        { accessId: accessId },
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
) =>
  await runSimpleQuery(
    ctx,
    "/usermaster/auth",
    getAuthInfo,
    "getAuthInfo",
    200,
  );

export const requestJwt = async (ctx: RouterContext<"/request">) => {
  const accessId = crypto.randomUUID();

  const route = "/jwt/request";

  logger.info(`User accessed route "${route}"`, { accessId: accessId });

  const authorizedMessage = "Valid credentials";
  const unauthorizedMessage = "Invalid credentials";
  const generationErrMessage = "There was an error in generating the token";

  const transaction = new ssms.Transaction(databasePool);

  transaction.on("error", (err) => {
    logger.error(`Internal transaction error caught by listener = ${err}`, {
      accessId: accessId,
    });
  });

  logger.info(`Beginning transaction`, { accessId: accessId });

  try {
    await transaction.begin();
    logger.trace(`Running function getKey()`, { accessId: accessId });
    const jwtKey = await getKey();
    logger.trace(`Finished running function getKey()`, { accessId: accessId });
    logger.debug(`JWT ${jwtKey ? "Exist" : "is missing"}`, {
      accessId: accessId,
    });

    const jwtHeader: Header = { alg: "HS512", type: "JWT" };
    const nineHourExpiration = getNumericDate(60 * 60 * 9);
    const request: LoginPayload = await ctx.request.body.json();
    logger.debug(`Value of request is ${request}`, { accessId: accessId });

    logger.trace(`Running function getAuthInfo()`, { accessId: accessId });
    const { rowsReturned: credentials, rowsAffected: authInfoRowsAffected } =
      await getAuthInfo(transaction);
    logger.trace(`Finished running function getAuthInfo()`, {
      accessId: accessId,
    });
    logger.debug(`${authInfoRowsAffected[0]} rows affected`, {
      accessId: accessId,
    });

    let validCredentials: AuthInfo | null = null;
    const isAdmin = request.nrp === "Admin" &&
      request.password ===
        credentials.filter((credential) => credential.IDUser === 1)[0].Password;
    logger.debug(`Value of isAdmin is ${isAdmin}`, { accessId: accessId });

    if (isAdmin) {
      const adminCredentials = credentials.filter((credential) =>
        credential.IDUser === 1
      )[0];
      logger.debug(`Value of adminCredentials is ${adminCredentials}`, {
        accessId: accessId,
      });
      validCredentials = adminCredentials;
      logger.debug(`Value of validCredentials is ${validCredentials}`, {
        accessId: accessId,
      });
    } else {
      logger.info(`Started looping for "credentials"`, { accessId: accessId });
      for (const credential of credentials) {
        const validNRP = credential.NRP === request.nrp;
        const validPassword = credential.Password === request.password;
        if (validNRP && validPassword) {
          validCredentials = credential;
          logger.debug(`Value of validCredentials is ${validCredentials}`, {
            accessId: accessId,
          });
          logger.info(`Finished looping early for "credentials"`, {
            accessId: accessId,
          });
          break;
        }
      }
      logger.info(`Finished looping for "credentials"`, { accessId: accessId });
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
      logger.debug(`Value of jwtPayload is ${jwtPayload}`, {
        accessId: accessId,
      });
      const jwt = await create(jwtHeader, jwtPayload, jwtKey);
      logger.debug(`Value of jwt is ${jwt}`, { accessId: accessId });

      if (jwt) {
        const authorizedResponse: LoginResponse = {
          message: authorizedMessage,
          nrp: validCredentials.NRP,
          jwt: jwt,
        };
        logger.debug(`Value of authorizedResponse is ${authorizedResponse}`, {
          accessId: accessId,
        });
        logger.trace(`Running function patchNewLogin()`, {
          accessId: accessId,
        });
        const newLoginPatchRowsAffected = await patchNewLogin(
          transaction,
          validCredentials.IDUser,
        );
        logger.trace(`Finished running function patchNewLogin()`, {
          accessId: accessId,
        });
        logger.debug(`${newLoginPatchRowsAffected} rows affected`, {
          accessId: accessId,
        });

        logger.info(`Comitting transaction`, { accessId: accessId });

        await transaction.commit();

        ctx.response.status = 200;
        ctx.response.body = authorizedResponse;
      } else {
        logger.error(`The value of "jwt" does not exist`, {
          accessId: accessId,
        });
        const errResponse: LoginResponse = {
          message: generationErrMessage,
          nrp: validCredentials.NRP,
          jwt: "",
        };

        logger.warn(
          `Transaction failed for route "${route}". JWT value does not exist`,
          { accessId: accessId },
        );

        await transaction.rollback();

        ctx.response.status = 500;
        ctx.response.body = errResponse;
      }
      return;
    }

    logger.warning(`Incoming NRP and Password does not exist in database`, {
      accessId: accessId,
    });
    const unauthorizedResponse: LoginResponse = {
      message: unauthorizedMessage,
      nrp: "",
      jwt: "",
    };

    logger.warn(
      `Transaction failed for route "${route}". Unauthorized`,
      { accessId: accessId },
    );

    await transaction.rollback();

    ctx.response.status = 401;
    ctx.response.body = unauthorizedResponse;
  } catch (err) {
    logger.error(`Transaction failed for route "${route}". ${err}`, {
      accessId: accessId,
    });
    ctx.response.status = 500;
    try {
      await transaction.rollback();
    } catch (rollbackErr) {
      logger.error(`Failed rolling back transaction. ${rollbackErr}`, {
        accessId: accessId,
      });
    }
  }
};

export const getRequestsBySupervisorNrp = async (
  ctx: RouterContext<"/approve">,
) => {
  const accessId = crypto.randomUUID();

  const route = "/trace/approve";

  logger.info(
    `User accessed route "${route}"`,
    { accessId: accessId },
  );

  logger.trace(
    `Started searching route parameters`,
    { accessId: accessId },
  );
  const params = ctx.request.url.searchParams;
  logger.trace(
    `Finished searching route parameters`,
    { accessId: accessId },
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
    { accessId: accessId },
  );
  logger.debug(
    `Value of endDate is ${endDate}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of search is ${search}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of status is ${status}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of formattedNrp is ${formattedNrp}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of page is ${page}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of pagination is ${pagination}`,
    { accessId: accessId },
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
    200,
    accessId,
  );
};

export const getRequestsBySupervisorNrpCount = async (
  ctx: RouterContext<"/approve/count">,
) => {
  const accessId = crypto.randomUUID();

  const route = "/trace/approve/count";

  logger.info(
    `User accessed route "/trace/approve/count"`,
    { accessId: accessId },
  );

  logger.trace(
    `Started searching route parameters`,
    { accessId: accessId },
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
    { accessId: accessId },
  );

  logger.debug(
    `Value of startDate is ${startDate}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of endDate is ${endDate}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of search is ${search}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of status is ${status}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of formattedNrp is ${formattedNrp}`,
    { accessId: accessId },
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
    200,
    accessId,
  );
};

export const patchRemarks = async (ctx: RouterContext<"/remarks">) => {
  const accessId = crypto.randomUUID();

  const route = "/approve/remarks";

  logger.info(`User accessed route "${route}"`, { accessId: accessId });

  const request: PatchRemarksPayload = await ctx.request.body.json();
  logger.debug(`Value of request is ${request}`, { accessId: accessId });
  const transaction = new ssms.Transaction(databasePool);

  transaction.on("error", (err: unknown) => {
    logger.error(
      `Internal transaction error caught by listener = ${err}`,
      { accessId: accessId },
    );
  });

  logger.info(`Beginning transaction`, { accessId: accessId });

  try {
    await transaction.begin();

    logger.trace(`Running function patchRemarksOfTrace()`, {
      accessId: accessId,
    });
    const patchTraceRowsAffected = await patchRemarksOfTrace(
      transaction,
      request.newRemarks,
      request.noForm,
    );
    logger.trace(`Finished running function patchRemarksOfTrace()`, {
      accessId: accessId,
    });
    logger.debug(`${patchTraceRowsAffected} rows affected`, {
      accessId: accessId,
    });

    logger.trace(`Running function patchRemarksOfRequest()`, {
      accessId: accessId,
    });
    const patchRequestRowsAffected = await patchRemarksOfRequest(
      transaction,
      request.newRemarks,
      request.noForm,
    );
    logger.trace(`Finished running function patchRemarksOfRequest()`, {
      accessId: accessId,
    });
    logger.debug(`${patchRequestRowsAffected} rows affected`, {
      accessId: accessId,
    });

    logger.info(`Comitting transaction`, { accessId: accessId });

    await transaction.commit();

    ctx.response.status = 204;
  } catch (err) {
    logger.error(`Transaction failed for route "${route}". ${err}`, {
      accessId: accessId,
    });
    ctx.response.status = 500;
    try {
      await transaction.rollback();
    } catch (rollbackErr) {
      logger.error(`Failed rolling back transaction. ${rollbackErr}`, {
        accessId: accessId,
      });
    }
  }
};

export const patchRejectRequest = async (
  ctx: RouterContext<"/reject">,
) => {
  const accessId = crypto.randomUUID();

  const route = "/approve/reject";

  logger.info(`User accessed route "${route}"`, { accessId: accessId });

  const action = "Rejected";
  const request: patchApprovalVerdict = await ctx.request.body.json();

  logger.debug(`Value of request is ${request}`, { accessId: accessId });

  const transaction = new ssms.Transaction(databasePool);

  logger.info(`Beginning transaction`, { accessId: accessId });

  try {
    await transaction.begin();

    logger.trace(
      `Running function getRequestIds()`,
      { accessId: accessId },
    );
    const { formId, noForm, noPr, requestItems } = await getRequestIds(
      transaction,
      request.traceId,
    );
    logger.trace(
      `Finished running function getRequestIds()`,
      { accessId: accessId },
    );
    logger.debug(
      `Value of formId is ${formId}`,
      { accessId: accessId },
    );
    logger.debug(
      `Value of noForm is ${noForm}`,
      { accessId: accessId },
    );
    logger.debug(
      `Value of noPr is ${noPr}`,
      { accessId: accessId },
    );
    logger.debug(
      `Value of requestItems is ${requestItems}`,
      { accessId: accessId },
    );
    logger.debug(
      `Value of supervisor NRP is ${request.supervisorNrp}`,
      { accessId: accessId },
    );

    logger.trace(
      `Running function patchTraceDVerdict()`,
      { accessId: accessId },
    );
    const traceDPatchRowsAffected = await patchTraceDVerdict(
      transaction,
      action,
      request.traceId,
      onlyNumerics(request.supervisorNrp),
      request.supervisorLevel,
    );
    logger.trace(
      `Finished running function patchTraceDVerdict()`,
      { accessId: accessId },
    );
    logger.debug(
      `${traceDPatchRowsAffected} rows affected`,
      { accessId: accessId },
    );

    logger.trace(
      `Running function getNextApprover()`,
      { accessId: accessId },
    );
    const { nextUserId, nextApproverLevel } = await getNextApprover(
      transaction,
      request.traceId,
      onlyNumerics(request.supervisorNrp),
      request.supervisorLevel,
    );
    logger.trace(
      `Finished running function getNextApprover()`,
      { accessId: accessId },
    );
    logger.debug(
      `Value of nextUserId is ${nextUserId}`,
      { accessId: accessId },
    );
    logger.debug(
      `Value of nextApproverLevel is ${nextApproverLevel}`,
      { accessId: accessId },
    );

    logger.trace(
      `Running function getOtherApproverInfo()`,
      { accessId: accessId },
    );
    const { Maxxed: MaxApproverLevel, Summed: SumApproverLevel } =
      await getOtherApproverInfo(transaction, request.traceId);
    logger.trace(
      `Finished running function getOtherApproverInfo()`,
      { accessId: accessId },
    );
    logger.debug(
      `Value of MaxApproverLevel is ${MaxApproverLevel}`,
      { accessId: accessId },
    );
    logger.debug(
      `Value of SumApproverLevel is ${SumApproverLevel}`,
      { accessId: accessId },
    );

    logger.trace(`Started looping "requestItems"`, { accessId: accessId });
    for (const item of requestItems) {
      logger.debug(`Current requestItems = ${requestItems}`, {
        accessId: accessId,
      });

      logger.trace(`Running function patchRequestBudget()`, {
        accessId: accessId,
      });
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
      logger.trace(`Finished running function patchRequestBudget()`, {
        accessId: accessId,
      });
      logger.debug(`${budgetPatchRowsAffeceted} rows affected`, {
        accessId: accessId,
      });
    }
    logger.trace(`Finished looping "requestItems"`, { accessId: accessId });

    logger.trace(`Running function patchTraceVerdict()`, {
      accessId: accessId,
    });
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
      { accessId: accessId },
    );
    logger.debug(
      `${tracePatchRowsAffected} rows affected`,
      { accessId: accessId },
    );

    logger.trace(`Started looping "rejectedItems"`, { accessId: accessId });
    for (const itemId of request.rejectedItems) {
      logger.debug(`Current itemId = ${itemId}`, { accessId: accessId });

      logger.trace(`Running function Running function patchFrmPRDVerdict()`, {
        accessId: accessId,
      });
      const frmPrDRowPatchAffected = await patchFrmPRDVerdict(
        transaction,
        String(request.supervisorId),
        itemId,
      );
      logger.trace(`Finished running function patchFrmPRDVerdict()`, {
        accessId: accessId,
      });
      logger.debug(`${frmPrDRowPatchAffected} rows affected`, {
        accessId: accessId,
      });
    }
    logger.trace(`Finished looping "rejectedItems"`, { accessId: accessId });

    await verdictEmail({
      transaction: transaction,
      supervisorNrp: request.supervisorNrp,
      noForm: noForm,
      traceId: String(request.traceId),
      supervisorAction: action,
      accessId,
      requestLink: request.requestPageOrigin,
    });

    logger.info(`Comitting transaction`, { accessId: accessId });

    await transaction.commit();

    ctx.response.status = 204;
  } catch (err) {
    logger.error(
      `Transaction failed for route "${route}". ${err}`,
      { accessId: accessId },
    );
    ctx.response.status = 500;
    try {
      await transaction.rollback();
    } catch (rollbackErr) {
      logger.error(
        `Failed rolling back transaction. ${rollbackErr}`,
        { accessId: accessId },
      );
    }
  }
};

export const patchAcceptRequest = async (
  ctx: RouterContext<"/accept">,
) => {
  const accessId = crypto.randomUUID();

  const route = "/approve/accept";

  logger.info(`User accessed route "${route}"`, { accessId: accessId });

  const action = "Approved";
  const request: patchApprovalVerdict = await ctx.request.body.json();

  logger.debug(
    `Value of request.requestPageOrigin is ${request.requestPageOrigin}`,
    {
      accessId: accessId,
    },
  );

  const transaction = new ssms.Transaction(databasePool);

  logger.info(`Beginning transaction`, { accessId: accessId });

  try {
    await transaction.begin();

    logger.trace(`Running function getRequestIds()`, { accessId: accessId });
    const {
      formId: formId,
      noForm,
      noPr: noPr,
      requestItems: requestItems,
    } = await getRequestIds(
      transaction,
      request.traceId,
    );
    logger.trace(
      `Finished running function getRequestIds()`,
      { accessId: accessId },
    );
    logger.debug(
      `Value of formId is ${formId}`,
      { accessId: accessId },
    );
    logger.debug(
      `Value of noForm is ${noForm}`,
      { accessId: accessId },
    );
    logger.debug(
      `Value of noPr is ${noPr}`,
      { accessId: accessId },
    );
    logger.debug(
      `Value of requestItems is ${requestItems}`,
      { accessId: accessId },
    );

    logger.trace(
      `Running function getNextApprover()`,
      { accessId: accessId },
    );
    const { nextUserId, nextApproverLevel } = await getNextApprover(
      transaction,
      request.traceId,
      onlyNumerics(request.supervisorNrp),
      request.supervisorLevel,
    );
    logger.trace(
      `Finished running function getNextApprover()`,
      { accessId: accessId },
    );

    logger.debug(
      `Value of nextUserId is ${nextUserId}`,
      { accessId: accessId },
    );
    logger.debug(
      `Value of nextApproverLevel is ${nextApproverLevel}`,
      { accessId: accessId },
    );
    logger.debug(
      `Value of supervisor NRP is ${request.supervisorNrp} (${
        onlyNumerics(request.supervisorNrp)
      })`,
      { accessId: accessId },
    );

    logger.trace(
      `Running function patchTraceDVerdict()`,
      { accessId: accessId },
    );
    const traceDPatchRowsAffected = await patchTraceDVerdict(
      transaction,
      action,
      request.traceId,
      onlyNumerics(request.supervisorNrp),
      request.supervisorLevel,
    );
    logger.trace(
      `Finished running function patchTraceDVerdict()`,
      { accessId: accessId },
    );
    logger.debug(
      `${traceDPatchRowsAffected} rows affected`,
      { accessId: accessId },
    );

    const isLastSupervisor = nextApproverLevel === null &&
      nextUserId === null;

    if (nextUserId !== null && nextApproverLevel !== null) {
      logger.trace(
        `Running function patchApproverToActiveApproving()`,
        { accessId: accessId },
      );
      const toActiveApprovingRowsAffected =
        await patchApproverToActiveApproving(
          transaction,
          request.traceId,
          nextApproverLevel,
        );
      logger.trace(
        `Finished running function patchApproverToActiveApproving()`,
        { accessId: accessId },
      );
      logger.debug(
        `${toActiveApprovingRowsAffected} rows affected`,
        { accessId: accessId },
      );
    }

    logger.trace(
      `Running function getOtherApproverInfo()`,
      { accessId: accessId },
    );
    const { Maxxed: MaxApproverLevel, Summed: SumApproverLevel } =
      await getOtherApproverInfo(transaction, request.traceId);
    logger.trace(
      `Finished running function getOtherApproverInfo()`,
      { accessId: accessId },
    );
    logger.debug(
      `Value of MaxApproverLevel is ${MaxApproverLevel}`,
      { accessId: accessId },
    );
    logger.debug(
      `Value of SumApproverLevel is ${SumApproverLevel}`,
      { accessId: accessId },
    );

    logger.trace(
      `Running function patchTraceVerdict()`,
      { accessId: accessId },
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
      { accessId: accessId },
    );
    logger.debug(
      `${tracePatchRowsAffected} rows affected`,
      { accessId: accessId },
    );

    if (isLastSupervisor) {
      logger.trace(
        `Last supervisor for request of ID Trace ${request.traceId} is approved. Firing final approved API.`,
        { accessId: accessId },
      );

      const finalApprovedAPIResponse = await getRequestInformation(
        request.traceId,
        transaction,
        accessId,
      );

      ctx.response.status = 200;
      ctx.response.body = finalApprovedAPIResponse;
    } else {
      ctx.response.status = 204;
    }

    await verdictEmail({
      transaction: transaction,
      supervisorNrp: request.supervisorNrp,
      noForm: noForm,
      traceId: String(request.traceId),
      supervisorAction: action,
      accessId: accessId,
      requestLink: request.requestPageOrigin,
    });

    logger.info(
      `Comitting transaction`,
      { accessId: accessId },
    );

    await transaction.commit();
  } catch (err) {
    logger.error(
      `Transaction failed for route "${route}". ${err}`,
      { accessId: accessId },
    );
    ctx.response.status = 500;
    try {
      await transaction.rollback();
    } catch (rollbackErr) {
      logger.error(
        `Failed rolling back transaction. ${rollbackErr}`,
        { accessId: accessId },
      );
    }
  }
};

export const putBudgets = async (
  ctx: RouterContext<"/budget">,
) => {
  const accessId = crypto.randomUUID();

  const route = "/admin/budget";

  logger.info(
    `User accessed route "${route}"`,
    { accessId: accessId },
  );

  const request: (Omit<BudgetTable, "Budget" | "Balance"> & {
    Budget: number | null;
    Balance: number | null;
  })[] = await ctx
    .request
    .body.json();

  logger.debug(
    `Value of request is ${request}`,
    { accessId: accessId },
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
      { accessId: accessId },
    );
    await transaction.begin();

    logger.trace(
      `Started looping "request"`,
      { accessId: accessId },
    );
    for (const budgetData of request) {
      if (budgetData.Budget === null || budgetData.Balance === null) continue;

      logger.debug(
        `Current budgetData is ${budgetData}`,
        { accessId: accessId },
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
        { accessId: accessId },
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
        { accessId: accessId },
      );

      if (potentialDuplicate) {
        const newBudget = budgetData.Budget;
        logger.debug(
          `Value of newBudget is ${newBudget}`,
          { accessId: accessId },
        );
        const oldBudget = Number(potentialDuplicate.Budget);
        logger.debug(
          `Value of oldBudget is ${oldBudget}`,
          { accessId: accessId },
        );
        const difference = newBudget - oldBudget;
        logger.debug(
          `Value of difference is ${difference}`,
          { accessId: accessId },
        );

        payload = {
          ...payload,
          Budget: budgetData.Budget,
          Balance: Number(potentialDuplicate.Balance) + difference,
        };
        logger.debug(
          `Value of payload is ${payload}`,
          { accessId: accessId },
        );

        logger.trace(
          `Running function patchSpecificBudgetNewBudget()`,
          { accessId: accessId },
        );
        const newSpecificBudgetRowsAffected =
          await patchSpecificBudgetNewBudget(transaction, payload);
        logger.trace(
          `Finished running function patchSpecificBudgetNewBudget()`,
          { accessId: accessId },
        );
        logger.debug(
          `${newSpecificBudgetRowsAffected} rows affected`,
          { accessId: accessId },
        );
      } else {
        logger.trace(
          `Running function postBudget()`,
          { accessId: accessId },
        );
        const newBudgetRowsAffected = await postBudget(transaction, payload);
        logger.trace(
          `Finished running function postBudget()`,
          { accessId: accessId },
        );
        logger.debug(
          `${newBudgetRowsAffected} rows affected`,
          { accessId: accessId },
        );
      }
    }
    logger.trace(
      `Finished looping "request"`,
      { accessId: accessId },
    );

    logger.info(
      `Comitting transaction`,
      { accessId: accessId },
    );
    await transaction.commit();

    ctx.response.status = 204;
  } catch (err) {
    logger.error(
      `Transaction failed for route "${route}". ${err}`,
      { accessId: accessId },
    );
    ctx.response.status = 500;
    try {
      await transaction.rollback();
    } catch (rollbackErr) {
      logger.error(
        `Failed rolling back transaction. ${rollbackErr}`,
        { accessId: accessId },
      );
    }
  }
};

export const deleteRequest = async (ctx: RouterContext<"/:traceId">) => {
  const accessId = crypto.randomUUID();

  const route = "/admin";

  logger.info(
    `User accessed route "${route}"`,
    { accessId: accessId },
  );

  const traceId = Number(ctx.params.traceId);
  logger.debug(
    `Value of traceId is ${traceId}`,
    { accessId: accessId },
  );

  const transaction = new ssms.Transaction(databasePool);

  try {
    logger.info(
      `Beginning transaction`,
      { accessId: accessId },
    );
    await transaction.begin();

    const { formId, noForm, noPr, requestItems } = await getRequestIds(
      transaction,
      traceId,
    );
    logger.trace(
      `Finished running function provisionFormNumber()`,
      { accessId: accessId },
    );
    logger.debug(
      `Value of formId is ${formId}`,
      { accessId: accessId },
    );
    logger.debug(
      `Value of noForm is ${noForm}`,
      { accessId: accessId },
    );
    logger.debug(
      `Value of noPr is ${noPr}`,
      { accessId: accessId },
    );
    logger.debug(
      `Value of requestItems is ${requestItems}`,
      { accessId: accessId },
    );

    // POST to table UploadFile
    logger.trace(
      `Running function deleteRequestFiles()`,
      { accessId: accessId },
    );
    const deleteFilesRowsAffected = await deleteRequestFiles(
      transaction,
      noForm,
    );
    logger.trace(
      `Finished running function deleteRequestFiles()`,
      { accessId: accessId },
    );
    logger.debug(
      `${deleteFilesRowsAffected} rows affected`,
      { accessId: accessId },
    );

    // DELETE Trace_D
    logger.trace(
      `Running function deleteRequestApproverPath()`,
      { accessId: accessId },
    );
    const deleteApproverPathRowAffected = await deleteRequestApproverPath(
      transaction,
      traceId,
    );
    logger.trace(
      `Finished running function deleteRequestApproverPath()`,
      { accessId: accessId },
    );
    logger.debug(
      `${deleteApproverPathRowAffected} rows affected`,
      { accessId: accessId },
    );
    if (deleteApproverPathRowAffected === 0) {
      throw new Error(`No approver path was deleted. Aborting request.`);
    }

    // DELETE Trace
    logger.trace(
      `Running function deleteRequestTrace()`,
      { accessId: accessId },
    );
    const deleteTraceRowsAffected = await deleteRequestTrace(
      transaction,
      noForm,
    );
    logger.trace(
      `Finished running function deleteRequestTrace()`,
      { accessId: accessId },
    );
    logger.debug(
      `${deleteTraceRowsAffected} rows affected`,
      { accessId: accessId },
    );
    if (deleteTraceRowsAffected === 0) {
      throw new Error(`No request trace was deleted. Aborting request.`);
    }

    // DELETE frm_PR_H
    logger.trace(
      `Running function deleteRequestInformation()`,
      { accessId: accessId },
    );
    const deleteReqInfoRowsAffected = await deleteRequestInformation(
      transaction,
      formId,
    );
    logger.trace(
      `Finished running function deleteRequestInformation()`,
      { accessId: accessId },
    );
    logger.debug(
      `${deleteReqInfoRowsAffected} rows affected`,
      { accessId: accessId },
    );
    if (deleteReqInfoRowsAffected === 0) {
      throw new Error(`No request info was deleted. Aborting request.`);
    }

    // PATCH Budget
    logger.trace(
      `Started looping "requestItems"`,
      { accessId: accessId },
    );
    for (const item of requestItems) {
      logger.debug(`Current requestItems : `, { accessId: accessId });
      logger.debug(`Value of CostCenter is ${item.CostCenter}`, {
        accessId: accessId,
      });
      logger.debug(`Value of Department is ${item.Department}`, {
        accessId: accessId,
      });
      logger.debug(`Value of FileResource is ${item.FileResource}`, {
        accessId: accessId,
      });
      logger.debug(`Value of Nature is ${item.Nature}`, { accessId: accessId });
      logger.debug(`Value of NetPrice is ${-item.NetPrice}`, {
        accessId: accessId,
      });
      logger.debug(`Value of Periode is ${item.Periode}`, {
        accessId: accessId,
      });

      logger.trace(`Running function patchRequestBudget()`, {
        accessId: accessId,
      });
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
      logger.trace(`Finished running function patchRequestBudget()`);
      logger.debug(`${budgetPatchRowsAffected[0]} rows affected`, {
        accessId: accessId,
      });
      if (budgetPatchRowsAffected[0] === 0) {
        throw new Error(`No budget was modified. Aborting request.`);
      }
    }
    logger.trace(
      `Finished looping "requestItems"`,
      { accessId: accessId },
    );

    // DELETE frm_PR_D
    logger.trace(
      `Running function deleteRequestItems()`,
      { accessId: accessId },
    );
    const deleteItemsRowsAffected = await deleteRequestItems(transaction, noPr);
    logger.trace(
      `Finished running function deleteRequestItems()`,
      { accessId: accessId },
    );
    logger.debug(
      `${deleteItemsRowsAffected} rows affected`,
      { accessId: accessId },
    );
    if (deleteItemsRowsAffected === 0) {
      throw new Error(`No request items were deleted. Aborting request.`);
    }

    logger.info(
      `Comitting transaction`,
      { accessId: accessId },
    );
    await transaction.commit();

    ctx.response.status = 204;
  } catch (err) {
    logger.error(
      `Transaction failed for route "${route}". ${err}`,
      { accessId: accessId },
    );
    ctx.response.status = 500;
    try {
      await transaction.rollback();
    } catch (rollbackErr) {
      logger.error(
        `Failed rolling back transaction. ${rollbackErr}`,
        { accessId: accessId },
      );
    }
  }
};

export const getAllValidDepartments = async (
  ctx: RouterContext<"/departments">,
) => {
  const accessId = crypto.randomUUID();

  const route = "/budget/departments";

  logger.info(
    `User accessed route "${route}"`,
    { accessId: accessId },
  );

  logger.trace(
    `Started searching route parameters`,
    { accessId: accessId },
  );
  const params = ctx.request.url.searchParams;
  logger.trace(
    `Finished searching route parameters`,
    { accessId: accessId },
  );

  const fullPeriode = params.get("period") || null;
  const fileResource = params.get("fileresource") || null;

  logger.debug(
    `Value of fullPeriode is ${fullPeriode}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of fileResource is ${fileResource}`,
    { accessId: accessId },
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
    200,
    accessId,
  );
};

export const getAllValidCostCenters = async (
  ctx: RouterContext<"/costcenters">,
) => {
  const accessId = crypto.randomUUID();

  const route = "/budget/costcenters";

  logger.info(
    `User accessed route "${route}"`,
    { accessId: accessId },
  );

  logger.trace(
    `Started searching route parameters`,
    { accessId: accessId },
  );
  const params = ctx.request.url.searchParams;
  logger.trace(
    `Finished searching route parameters`,
    { accessId: accessId },
  );

  const fullPeriode = params.get("period") || null;
  const fileResource = params.get("fileresource") || null;
  const dept = Number(params.get("dept")) || null;

  logger.debug(
    `Value of fullPeriode is ${fullPeriode}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of fileResource is ${fileResource}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of dept is ${dept}`,
    { accessId: accessId },
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
    200,
    accessId,
  );
};

export const getUploadBudgetTemplate = async (
  ctx: RouterContext<"/template">,
) => {
  const accessId = crypto.randomUUID();

  const route = "/admin/template";

  logger.info(
    `User accessed route "${route}"`,
    { accessId: accessId },
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
      { accessId: accessId },
    );

    await ctx.send(options);
  } catch (err) {
    logger.error(
      `Download failed on route "${route}". ${err}`,
      { accessId: accessId },
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
    200,
  );

export const patchForex = async (
  ctx: RouterContext<"/ratedollartemp">,
) => {
  const accessId = crypto.randomUUID();

  const route = "/admin/ratedollartemp";

  logger.info(
    `User accessed route "${route}"`,
    { accessId: accessId },
  );

  logger.trace(
    `Started searching route parameters`,
    { accessId: accessId },
  );
  const params = ctx.request.url.searchParams;
  logger.trace(
    `Finished searching route parameters`,
    { accessId: accessId },
  );

  const currency = params.get("currency");
  const newValue = params.get("value");

  logger.debug(
    `Value of currency is ${currency}`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of newValue is ${newValue}`,
    { accessId: accessId },
  );

  if (currency === null || newValue === null) {
    logger.warning(
      `At least 1 parameter was empty when all of them are required`,
      { accessId: accessId },
    );
    ctx.response.status = 400;
    ctx.response.body = "Invalid parameters!";
    return;
  }

  if (isNaN(Number(newValue))) {
    logger.warning(`A new value for a currency is not a valid number`, {
      accessId: accessId,
    });
    ctx.response.status = 400;
    ctx.response.body = "Invalid parameters!";
    return;
  }

  if (!(appCurrencies as readonly string[]).includes(currency)) {
    logger.warning(`The input currency was not found in the database`, {
      accessId: accessId,
    });
    ctx.response.status = 400;
    ctx.response.body = "Invalid parameters!";
    return;
  }

  const transaction = new ssms.Transaction(databasePool);

  transaction.on("error", (err) => {
    logger.error(
      `Internal transaction error caught by listener = ${err}`,
      { accessId: accessId },
    );
  });

  logger.info(`Beginning transaction`, { accessId: accessId });

  try {
    await transaction.begin();

    logger.trace(
      `Running function patchRateDollarTemp()`,
      { accessId: accessId },
    );
    const rateDollarTempPatchRowsAffected = await patchRateDollarTemp(
      transaction,
      currency as (typeof appCurrencies)[number],
      Number(newValue),
    );
    logger.trace(
      `Finished running function patchRateDollarTemp()`,
      { accessId: accessId },
    );
    logger.debug(
      `${rateDollarTempPatchRowsAffected} rows affected`,
      { accessId: accessId },
    );

    logger.info(
      `Comitting transaction`,
      { accessId: accessId },
    );

    await transaction.commit();

    ctx.response.status = 204;
  } catch (err) {
    logger.error(
      `Transaction failed for route "${route}". ${err}`,
      { accessId: accessId },
    );
    ctx.response.status = 500;
    try {
      await transaction.rollback();
    } catch (rollbackErr) {
      logger.error(
        `Failed rolling back transaction. ${rollbackErr}`,
        { accessId: accessId },
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
    200,
  );

export const patchRateDollar = async () => {
  const accessId = crypto.randomUUID();

  const transaction = new ssms.Transaction(databasePool);

  transaction.on("error", (err) => {
    logger.error(
      `Internal transaction error caught by listener = ${err}`,
      { accessId: accessId },
    );
  });

  logger.info(
    `Beginning transaction`,
    { accessId: accessId },
  );

  try {
    await transaction.begin();

    logger.trace(
      `Running function ${renewRateDollar.name}()`,
      { accessId: accessId },
    );
    const rowsAffected = await renewRateDollar(transaction);
    logger.trace(
      `Finished running function ${renewRateDollar.name}()`,
      { accessId: accessId },
    );
    logger.debug(
      `${rowsAffected} rows affected`,
      { accessId: accessId },
    );

    logger.info(
      `Comitting transaction`,
      { accessId: accessId },
    );

    await transaction.commit();
  } catch (err) {
    logger.error(
      `Failed running ${renewRateDollar.name}(). ${err}`,
      { accessId: accessId },
    );
    try {
      await transaction.rollback();
    } catch (rollbackErr) {
      logger.error(
        `Failed rolling back transaction. ${rollbackErr}`,
        { accessId: accessId },
      );
    }
  }
};

export const postUploadFile = async (
  ctx: RouterContext<"/attach">,
) => {
  const accessId = crypto.randomUUID();

  const route = "/approve/attach";

  logger.info(
    `User accessed route "${route}"`,
    { accessId: accessId },
  );

  logger.trace(
    `Started searching route parameters`,
    { accessId: accessId },
  );
  const params = ctx.request.url.searchParams;
  logger.trace(
    `Finished searching route parameters`,
    { accessId: accessId },
  );

  const IDTrace = Number(params.get("traceid"));

  logger.debug(
    `Value of IDTrace is ${IDTrace}`,
    { accessId: accessId },
  );

  if (IDTrace === 0) {
    throw Error("Unable to find that ID Trace.");
  }

  logger.trace(
    `Started searching route form data`,
    { accessId: accessId },
  );
  const formDataRequest: FormData = await ctx.request.body.formData();
  logger.trace(
    `Finished searching route form data`,
    { accessId: accessId },
  );

  const files = formDataRequest.getAll("files") as File[];

  const transaction = new ssms.Transaction(databasePool);

  transaction.on("error", (err) => {
    logger.error(
      `Internal transaction error caught by listener = ${err}`,
      { accessId: accessId },
    );
  });

  logger.info(
    `Beginning transaction`,
    { accessId: accessId },
  );

  try {
    await transaction.begin();

    logger.trace(
      `Running function getRequestIds()`,
      { accessId: accessId },
    );
    const {
      formId: _formId,
      noForm,
      noPr: _noPr,
      requestItems: _requestItems,
    } = await getRequestIds(
      transaction,
      IDTrace,
    );
    logger.trace(
      `Finished running function getRequestIds()`,
      { accessId: accessId },
    );
    logger.debug(
      `Value of noForm is ${noForm}`,
      { accessId: accessId },
    );

    logger.trace(
      `Running function getFileUploadInfo()`,
      { accessId: accessId },
    );
    const {
      rowsReturned: additionalUploadInfo,
      rowsAffected,
    } = await getFileUploadInfo(
      transaction,
      noForm,
    );
    logger.trace(
      `Finished running function getFileUploadInfo()`,
      { accessId: accessId },
    );
    logger.debug(`Requestor is ${additionalUploadInfo[0].Requestor}`, {
      accessId: accessId,
    });
    logger.debug(`Subject is ${additionalUploadInfo[0].Subject}`, {
      accessId: accessId,
    });
    logger.debug(`${rowsAffected[0]} rows affected`, { accessId: accessId });

    for (const file of files) {
      logger.trace(
        `Current file : ${file.name}`,
        { accessId: accessId },
      );
      logger.trace(
        `Running function postRequestFiles()`,
        { accessId: accessId },
      );
      const { rowsAffected, newUploadId } = await postRequestFiles(
        transaction,
        noForm,
        additionalUploadInfo[0].Subject,
        additionalUploadInfo[0].Requestor,
        file.name,
        jsDateToMySQLDatetime(new Date()),
      );
      if (rowsAffected[0] === 0) {
        throw Error("No rows were affected. This is an unexpected beviour.");
      }
      logger.trace(
        `Finished running function postRequestFiles()`,
        { accessId: accessId },
      );
      logger.debug(
        `The Upload ID for file ${file.name} is ${newUploadId}`,
        { accessId: accessId },
      );
    }

    logger.info(
      `Comitting transaction`,
      { accessId: accessId },
    );

    await transaction.commit();

    ctx.response.status = 201;
  } catch (err) {
    logger.error(`Transaction failed for route "${route}". ${err}`, {
      accessId: accessId,
    });
    ctx.response.status = 500;
    try {
      await transaction.rollback();
    } catch (rollbackErr) {
      logger.error(`Failed rolling back transaction. ${rollbackErr}`, {
        accessId: accessId,
      });
    }
  }
};
