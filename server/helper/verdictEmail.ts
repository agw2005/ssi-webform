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
}) => {
  logger.info(`Sending email to requestor`);

  logger.trace(
    `Running function getUserInfoByNRP()`,
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
  );
  logger.debug(
    `${supervisorInfoRowsAffected} rows affected`,
  );
  const supervisorName = supervisorInfo[0].NameUser;
  logger.debug(
    `Value of supervisorName is ${supervisorName}`,
  );

  logger.trace(`Running function getEmailingInfo()`);
  const {
    rowsAffected: emailingInfoRowsAffected,
    rowsReturned: emailingInfo,
  } = await getEmailingInfo(
    option.transaction,
    option.noForm,
  );
  logger.trace(`Finished running function getEmailingInfo()`);
  logger.debug(`${emailingInfoRowsAffected} rows affected`);

  const currentStatus = emailingInfo[0].CurrentStatus;
  const requestSubject = emailingInfo[0].RequestSubject;
  const requestorEmail = emailingInfo[0].RequestorEmail;
  const requestorName = emailingInfo[0].RequestorName;
  logger.debug(`Value of CurrentStatus is ${currentStatus}`);
  logger.debug(`Value of RequestSubject is ${requestSubject}`);
  logger.debug(`Value of RequestorEmail is ${requestorEmail}`);
  logger.debug(`Value of RequestorName is ${requestorName}`);

  logger.trace(
    `Running function sendEmail()`,
  );
  sendEmail({
    requestorEmail: requestorEmail,
    requestorName: requestorName,
    traceId: option.traceId,
    requestSubject: requestSubject,
    supervisorAction: option.supervisorAction,
    supervisorName: supervisorName,
    currentStatus: currentStatus,
  });
  logger.trace(
    `Finished running function sendEmail()`,
  );

  logger.info(`Finished sending email to requestor`);
};

export default verdictEmail;
