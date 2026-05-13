import { getLogger } from "@logtape/logtape";
import sendEmail from "../mailer.ts";
import { getUserInfoByNRP } from "../controllers/UserMaster.ts";
import type ssms from "mssql";
import { getEmailingInfo } from "../controllers/Trace.ts";

const logger = getLogger("prism-server");

const verdictEmail = async (option: {
  transaction: ssms.Transaction;
  supervisorNrp: string;
  noForm: string;
  traceId: string;
  supervisorAction: string;
  accessId: string;
  requestLink: string;
}) => {
  logger.info(`Sending email to requestor`, { accessId: option.accessId });

  logger.trace(
    `Running function getUserInfoByNRP()`,
    { accessId: option.accessId },
  );
  const {
    rowsReturned: supervisorInfo,
    rowsAffected: supervisorInfoRowsAffected,
  } = await getUserInfoByNRP(
    option.transaction,
    option.supervisorNrp,
  );
  logger.trace(
    `Finished running function getUserInfoByNRP()`,
    { accessId: option.accessId },
  );
  logger.debug(
    `${supervisorInfoRowsAffected} rows affected`,
    { accessId: option.accessId },
  );
  const supervisorName = supervisorInfo[0].NameUser;
  logger.debug(
    `Value of supervisorName is ${supervisorName}`,
    { accessId: option.accessId },
  );

  logger.trace(`Running function getEmailingInfo()`, {
    accessId: option.accessId,
  });
  const {
    rowsAffected: emailingInfoRowsAffected,
    rowsReturned: emailingInfo,
  } = await getEmailingInfo(
    option.transaction,
    option.noForm,
  );
  logger.trace(`Finished running function getEmailingInfo()`, {
    accessId: option.accessId,
  });
  logger.debug(`${emailingInfoRowsAffected} rows affected`, {
    accessId: option.accessId,
  });

  const currentStatus = emailingInfo[0].CurrentStatus;
  const requestSubject = emailingInfo[0].RequestSubject;
  const requestorEmail = emailingInfo[0].RequestorEmail;
  const requestorName = emailingInfo[0].RequestorName;
  logger.debug(`Value of CurrentStatus is ${currentStatus}`, {
    accessId: option.accessId,
  });
  logger.debug(`Value of RequestSubject is ${requestSubject}`, {
    accessId: option.accessId,
  });
  logger.debug(`Value of RequestorEmail is ${requestorEmail}`, {
    accessId: option.accessId,
  });
  logger.debug(`Value of RequestorName is ${requestorName}`, {
    accessId: option.accessId,
  });

  logger.trace(`Running function sendEmail()`, { accessId: option.accessId });
  try {
    const result = await sendEmail({
      requestorEmail: requestorEmail,
      requestorName: requestorName,
      traceId: option.traceId,
      requestSubject: requestSubject,
      supervisorAction: option.supervisorAction,
      supervisorName: supervisorName,
      currentStatus: currentStatus,
      accessId: option.accessId,
      requestLink: option.requestLink,
    });
    logger.trace(
      `Finished running function sendEmail()`,
      { accessId: option.accessId },
    );

    if (!result) throw Error("sendEmail() result is undefined");

    logger.debug(
      `Value of acceptedRecipients is ${result.acceptedRecipients}`,
      { accessId: option.accessId },
    );
    logger.debug(`Value of envelope is ${result.envelope}`, {
      accessId: option.accessId,
    });
    logger.debug(`Value of messageId is ${result.messageId}`, {
      accessId: option.accessId,
    });
    logger.debug(
      `Value of rejectedRecipients is ${result.rejectedRecipients}`,
      { accessId: option.accessId },
    );
    logger.debug(`Value of response is ${result.response}`, {
      accessId: option.accessId,
    });
  } catch (err) {
    logger.error(`Error when sending email : ${err}`, {
      accessId: option.accessId,
    });
  }

  logger.info(`Finished sending email to requestor`, {
    accessId: option.accessId,
  });
};

export default verdictEmail;
