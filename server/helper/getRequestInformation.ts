import type { FinalApprovalPayload } from "@scope/server";
import { getLogger } from "@logtape/logtape";
import { getAllRequestItems } from "../controllers/FrmPRD.ts";
import { specificRequest } from "../controllers/Trace.ts";
import { getApproverPathInformation } from "../controllers/TraceD.ts";
import { getMinimumFileInformation } from "../controllers/UploadFile.ts";
import type ssms from "mssql";

const logger = getLogger("prism-server");

export const getRequestInformation = async (
  traceId: number,
  transaction: ssms.Transaction,
  accessId: string,
): Promise<FinalApprovalPayload> => {
  logger.trace(
    `Running function getAllRequestItems()`,
    { accessId: accessId },
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
    { accessId: accessId },
  );
  logger.debug(
    `${requestItemsRowsAffected[0]} rows affected`,
    { accessId: accessId },
  );

  logger.trace(
    `Running function specificRequest()`,
    { accessId: accessId },
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
    { accessId: accessId },
  );
  logger.debug(
    `${reqOverviewRowsAffected[0]} rows affected`,
    { accessId: accessId },
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
    { accessId: accessId },
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
    { accessId: accessId },
  );
  logger.debug(
    `${requestSupervisorsRowsAffected[0]} rows affected`,
    { accessId: accessId },
  );

  logger.trace(
    `Running function getMinimumFileInformation()`,
    { accessId: accessId },
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
    { accessId: accessId },
  );
  logger.debug(
    `${requestFilesRowsAffected[0]} rows affected`,
    { accessId: accessId },
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
