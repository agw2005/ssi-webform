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

const logger = getLogger("prism-server");

export const newPurchasingRequest = async (
  transaction: ssms.Transaction,
  payload: SubmitPayload,
  accessId: string,
) => {
  const indonesiaUtc = 7;
  const now = addHours(new Date(), indonesiaUtc);
  const submissionDate = jsDateToMySQLDatetime(now);
  const emailDomain = "ssi.sharp-world.com";

  logger.debug(
    `Value of submissionDate is ${submissionDate}`,
    { accessId: accessId },
  );

  logger.trace(
    `Running function getCurrentRateDollar()`,
    { accessId: accessId },
  );
  const { rowsReturned: rates, rowsAffected: ratesRowAffected } =
    await getCurrentRateDollar(
      transaction,
    );
  logger.trace(
    `Finished running function getCurrentRateDollar()`,
    { accessId: accessId },
  );
  logger.debug(
    `${ratesRowAffected[0]} rows affected`,
    { accessId: accessId },
  );

  logger.debug(
    `Value of rates is ${rates}`,
    { accessId: accessId },
  );

  logger.trace(
    `Running function provisionFormNumber()`,
    { accessId: accessId },
  );
  const noForm = provisionFormNumber();
  logger.trace(
    `Finished running function provisionFormNumber()`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of noForm is ${noForm}`,
    { accessId: accessId },
  );
  logger.trace(
    `Running function provisionPRNumber()`,
    { accessId: accessId },
  );
  const noPR = await provisionPRNumber(
    transaction,
    payload.firstStep.department,
  );
  logger.trace(
    `Finished running function provisionPRNumber()`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of noPR is ${noPR}`,
    { accessId: accessId },
  );
  logger.trace(
    `Running function getSectionIdByName()`,
    { accessId: accessId },
  );
  const requestorSectionId = await getSectionIdByName(
    transaction,
    payload.firstStep.section,
  );
  logger.trace(
    `Finished running function getSectionIdByName()`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of requestorSectionId is ${requestorSectionId}`,
    { accessId: accessId },
  );

  let requestAmount = 0;
  let isRedLight = false;

  logger.trace(
    `Started looping "payload.thirdStep.usages"`,
    { accessId: accessId },
  );
  for (const usage of payload.thirdStep.usages) {
    logger.debug(
      `Current usage = ${usage}`,
      { accessId: accessId },
    );
    const currencyRate = usage.currency === "JPY"
      ? rates.find((rate) => rate.Currency === "YEN")?.Valuation
      : rates.find((rate) => rate.Currency === usage.currency)?.Valuation;

    logger.debug(
      `Value of currencyRate is ${currencyRate}`,
      { accessId: accessId },
    );

    if (!currencyRate) {
      logger.error(
        `currencyRate does not exist!`,
        { accessId: accessId },
      );
      throw new Error("Unable to fetch RateDollar values");
    }

    const budgetId =
      `${usage.periode}-${usage.costCenter}-${payload.firstStep.fileResource}`;
    logger.debug(
      `Value of budgetId is ${budgetId}`,
      { accessId: accessId },
    );
    const quantity = Number(usage.quantity);
    logger.debug(
      `Value of quantity is ${quantity}`,
      { accessId: accessId },
    );
    const pricePerUnit = Number(usage.unitPrice);
    logger.debug(
      `Value of pricePerUnit is ${pricePerUnit}`,
      { accessId: accessId },
    );
    const netPriceByCurrencyRate = (quantity * pricePerUnit) / currencyRate;
    logger.debug(
      `Value of netPriceByCurrencyRate is ${netPriceByCurrencyRate}`,
      { accessId: accessId },
    );

    requestAmount += netPriceByCurrencyRate;

    logger.trace(
      `Running function postUsage()`,
      { accessId: accessId },
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
      { accessId: accessId },
    );
    logger.debug(
      `${usageRowsAffected[0]} rows affected`,
      { accessId: accessId },
    );
    logger.debug(
      `Value of newUsageId is ${newUsageId}`,
      { accessId: accessId },
    );

    logger.trace(
      `Running function patchRequestBudget()`,
      { accessId: accessId },
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
      { accessId: accessId },
    );
    logger.debug(
      `${patchReqBudgetRowsAffected[0]} rows affected`,
      { accessId: accessId },
    );

    logger.trace(
      `Running function singleBalance()`,
      { accessId: accessId },
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
      { accessId: accessId },
    );
    logger.debug(
      `${natureBalanceRowsAffected[0]} rows affected`,
      { accessId: accessId },
    );
    logger.debug(`Value of natureBalance is ${natureBalance[0].Balance}`, {
      accessId: accessId,
    });

    const currentNatureBalance = Number(natureBalance[0].Balance);
    logger.debug(
      `Value of currentNatureBalance is ${currentNatureBalance}`,
      { accessId: accessId },
    );

    if (!isRedLight && currentNatureBalance < netPriceByCurrencyRate) {
      isRedLight = true;
    }

    logger.debug(
      `Value of isRedLight is ${isRedLight}`,
      { accessId: accessId },
    );
  }
  logger.trace(
    `Finished looping "payload.thirdStep.usages"`,
    { accessId: accessId },
  );

  const requestSubject = !isRedLight
    ? payload.secondStep.subject
    : `[RL] ${payload.secondStep.subject}`;
  logger.debug(
    `Value of requestSubject is ${requestSubject}`,
    { accessId: accessId },
  );

  const initialRemarks = !isRedLight ? "" : "[RL]";
  logger.debug(
    `Value of initialRemarks is ${initialRemarks}`,
    { accessId: accessId },
  );

  logger.trace(
    `Running function postRequestInformation()`,
    { accessId: accessId },
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
    { accessId: accessId },
  );
  logger.debug(
    `${requestInfoRowAffected[0]} rows affected`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of requestInfoId is ${requestInfoId}`,
    { accessId: accessId },
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
    { accessId: accessId },
  );

  logger.trace(
    `Running function getUserIdByName()`,
    { accessId: accessId },
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
    { accessId: accessId },
  );
  logger.debug(
    `${initialSupervisorIdRowsAffected[0]} rows affected`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of initialSupervisorId is ${initialSupervisorId}`,
    { accessId: accessId },
  );

  logger.trace(
    `Running function postRequestTrace()`,
    { accessId: accessId },
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
    { accessId: accessId },
  );
  logger.debug(
    `${newTraceIdRowsAffected[0]} rows affected`,
    { accessId: accessId },
  );
  logger.debug(
    `Value of newTraceId is ${newTraceId}`,
    { accessId: accessId },
  );

  {
    logger.trace(
      `Started looping "supervisorNames"`,
      { accessId: accessId },
    );
    let approverStep = 0;
    for (const supervisorName of supervisorNames) {
      logger.debug(
        `Value of supervisorName is ${supervisorName}`,
        { accessId: accessId },
      );
      logger.trace(
        `Running function getUserIdByName()`,
        { accessId: accessId },
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
        { accessId: accessId },
      );
      logger.debug(
        `${currentSupervisorRowsAffected[0]} rows affected`,
        { accessId: accessId },
      );
      logger.debug(
        `Value of supervisorId is ${supervisorId}`,
        { accessId: accessId },
      );

      logger.trace(
        `Running function postRequestApproverPath()`,
        { accessId: accessId },
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
        { accessId: accessId },
      );

      approverStep += 1;
    }
    logger.trace(
      `Finished looping "supervisorNames"`,
      { accessId: accessId },
    );
  }

  logger.trace(
    `Started looping "payload.fifthStep.files"`,
    { accessId: accessId },
  );
  for (const file of payload.fifthStep.files) {
    logger.debug(
      `Current file = ${file.name}`,
      { accessId: accessId },
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
      { accessId: accessId },
    );
    logger.debug(
      `${newUploadRowsAffected[0]} rows affected`,
      { accessId: accessId },
    );
    logger.debug(
      `Value of newUploadId is ${newUploadId}`,
      { accessId: accessId },
    );
  }
  logger.trace(
    `Finished looping "payload.fifthStep.files"`,
    { accessId: accessId },
  );

  return { noForm, noPR, traceId: newTraceId };
};
