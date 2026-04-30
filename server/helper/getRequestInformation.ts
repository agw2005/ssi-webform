import type { FinalApprovalPayload } from "@scope/server";
import { getLogger } from "@logtape/logtape";
import { getAllRequestItems } from "../controllers/FrmPRD.ts";
import { specificRequest } from "../controllers/Trace.ts";
import { getApproverPathInformation } from "../controllers/TraceD.ts";
import { getMinimumFileInformation } from "../controllers/UploadFile.ts";
import type ssms from "mssql";

const logger = getLogger("webform-oak-server");

export const getRequestInformation = async (
  traceId: number,
  transaction: ssms.Transaction,
): Promise<FinalApprovalPayload> => {
  logger.trace(
    `Running function getAllRequestItems()`,
  );
  const {
    rowsReturned: requestItems,
    rowsAffected: requestItemsRowsAffected,
  } = await getAllRequestItems(
    transaction,
    traceId,
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
    traceId,
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
    traceId,
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
    traceId,
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

  return payload;
};
