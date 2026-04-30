import { getLogger } from "@logtape/logtape";
import type ssms from "mssql";
import { getCurrentRateDollar } from "../controllers/RateDollar.ts";
import provisionFormNumber from "./provisionFormNumber.ts";
import {
  postRequestInformation,
  provisionPRNumber,
} from "../controllers/FrmPRH.ts";
import type { SubmitPayload } from "@scope/server";
import { getSectionIdByName } from "../controllers/Section.ts";
import { postUsage } from "../controllers/FrmPRD.ts";
import { patchRequestBudget, singleBalance } from "../controllers/Budget.ts";
import { getUserIdByName } from "../controllers/UserMaster.ts";
import { postRequestTrace } from "../controllers/Trace.ts";
import addHours from "./addHours.ts";
import { jsDateToMySQLDatetime } from "./jsDateToMySQLDatetime.ts";
import { postRequestApproverPath } from "../controllers/TraceD.ts";
import { postRequestFiles } from "../controllers/UploadFile.ts";

const logger = getLogger("webform-oak-server");

export const newPurchasingRequest = async (
  transaction: ssms.Transaction,
  payload: SubmitPayload,
) => {
  const indonesiaUtc = 7;
  const now = addHours(new Date(), indonesiaUtc);
  const submissionDate = jsDateToMySQLDatetime(now);
  const emailDomain = "ssi.sharp-world.com";

  logger.debug(
    `Value of submissionDate is ${submissionDate}`,
  );

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

    // POST to table frm_PR_D (Identifier : NoPR)
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
    // PATCH to table Budget
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
  // POST to table frm_PR_H (Identifiers : NoForm & NoPR)
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
  // POST to table Trace (Identifiers : NoForm & IDTrace)
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
      // POST to table Trace_D (Identifier : IDTrace)
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
    // POST to table UploadFile (Identifier : NoForm)
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

  return { noForm, noPR, traceId: newTraceId };
};
