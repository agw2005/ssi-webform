import { useNavigate, useParams } from "react-router-dom";
import Primitive from "../components/reusable/Primitive.tsx";
import useFetch from "../hooks/useFetch.tsx";
import type {
  ApproverPath,
  patchApprovalVerdict,
  PatchRemarksPayload,
  RequestItem,
  RequestOverview,
  UploadedFile,
} from "@scope/server";
import { onlyNumerics } from "@scope/server";
import capitalize from "../helper/capitalize.ts";
import formatNumberToString from "../helper/formatNumberToString.ts";
import mysqlDateIsoStringToJSString from "../helper/mysqlDateIsoStringToJSString.ts";
import useAuth from "../hooks/useAuth.tsx";
import Button from "../components/reusable/Button.tsx";
import { useEffect, useRef, useState } from "react";
import Dialog, { toggleDialog } from "../components/reusable/Dialog.tsx";
import { getCurrentApproverLevel } from "../helper/getCurrentApproverLevel.ts";
import generateRequestPdf from "../helper/generateRequestPdf.ts";
import { webformAPI } from "../helper/apis.ts";

export interface Overview {
  "Form ID": string;
  "Form Number": string;
  Requestor: string;
  "PR Number": string;
  Subject: string;
  Amount: string;
  "Return On Outgoing": string;
  Remarks: string;
  "Cost Center": string;
  Nature: string;
  "ID Budget": string;
  Attachment: string;
}

const ITEMS_COLUMNS = [
  "ID",
  "Description",
  "Quantity",
  "Price Per Unit",
  "Estimated Delivery",
  "Vendor",
  "Reason",
  "Rejected",
  "Supplier",
  "Net Price",
  "Delivery Date",
];

const PROGRESS_COLUMNS = ["Type", "NRP", "Name", "Result", "Verdict Date"];

const REJECT_BUTTON_STYLINGS =
  "bg-red-700/40 hover:bg-red-700/80 active:bg-red-700/60 select-none";

const APPROVE_BUTTON_STYLINGS =
  "bg-green-700/40 hover:bg-green-700/80 active:bg-green-700/60 select-none";

const EMPTY_OVERVIEW: Overview = {
  "Form ID": "",
  "Form Number": "",
  Requestor: "",
  "PR Number": "",
  Subject: "",
  Amount: "",
  "Return On Outgoing": "",
  Remarks: "",
  "Cost Center": "",
  Nature: "",
  "ID Budget": "",
  Attachment: "",
};

const handleProgressColors = (progress: string) => {
  if (progress === "Approved") {
    return "bg-green-500/20 hover:bg-green-500/35 active:bg-green-500/25";
  } else if (progress === "Rejected") {
    return "bg-red-500/10 hover:bg-red-500/35 active:bg-red-500/25";
  } else if (progress === "In Progress") {
    return "bg-blue-500/25 hover:bg-blue-500/35 active:bg-blue-500/50";
  } else {
    return "bg-white hover:bg-black/10 active:bg-black/5";
  }
};

const stringIsEmpty = (str: string) => {
  return str === "" || str === "null" ? "-" : str;
};

const approverIsAuthorized = (data: ApproverPath[], nrp: string | null) => {
  if (nrp === "null" || nrp === null) return false;
  return data.some(
    (approver) =>
      onlyNumerics(approver.NRP) === onlyNumerics(nrp) &&
      approver.Result === "In Progress",
  );
};

const Request = () => {
  const { authInfo, authIsLoading } = useAuth();
  const reactRouterParams = useParams();
  const navigate = useNavigate();

  const {
    data: requestOverviewData,
    isLoading: isRequestOverviewDataLoading,
    isError: isRequestOverviewDataError,
  } = useFetch<RequestOverview>(
    webformAPI.RequestOverview,
    reactRouterParams.requestId,
  );

  const {
    data: requestItemsData,
    isLoading: isRequestItemsDataLoading,
    isError: isRequestItemsDataError,
  } = useFetch<RequestItem>(
    webformAPI.RequestItems,
    reactRouterParams.requestId,
  );

  const {
    data: requestFilesData,
    isLoading: isRequestFilesDataLoading,
    isError: isRequestFilesDataError,
  } = useFetch<UploadedFile>(
    webformAPI.RequestAttachments,
    reactRouterParams.requestId,
  );

  const {
    data: requestApproverPathData,
    isLoading: isRequestApproverPathDataLoading,
    isError: isRequestApproverPathDataError,
    refetch: refetchApproverPath,
  } = useFetch<ApproverPath>(
    webformAPI.ApproverPath,
    reactRouterParams.requestId,
  );

  const [currentRemarks, setCurrentRemarks] = useState(() => {
    if (!requestOverviewData?.length) return "";
    else {
      return requestOverviewData[0].Remarks;
    }
  });
  const [newRemarks, setNewRemarks] = useState(() => {
    if (!requestOverviewData?.length) return "";
    else {
      return requestOverviewData[0].Remarks;
    }
  });
  const [selectedRejects, setSelectedRejects] = useState<number[]>([]);
  const [rejectEmptyErr, setRejectEmptyErr] = useState(false);

  const rejectReference = useRef<HTMLDialogElement>(null);

  const [currentOverview, setCurrentOverview] = useState<Overview>(
    EMPTY_OVERVIEW,
  );

  useEffect(() => {
    if (!requestOverviewData?.length) return;

    setCurrentOverview({
      "Form ID": requestOverviewData[0].FormID,
      "Form Number": requestOverviewData[0].NoForm,
      Requestor: `${capitalize(requestOverviewData[0].Requestor)} (${
        requestOverviewData[0].RequestorNRP
      }) - ${requestOverviewData[0].RequestorSection}`,
      "PR Number": requestOverviewData[0].NoPR,
      Subject: requestOverviewData[0].Subject,
      Amount: `${formatNumberToString(requestOverviewData[0].Amount)} USD`,
      "Return On Outgoing": requestOverviewData[0].ReturnOnOutgoing,
      Remarks: requestOverviewData[0].Remarks || "",
      "Cost Center": requestOverviewData[0].CostCenter,
      Nature: requestOverviewData[0].Nature,
      "ID Budget": requestOverviewData[0].IDBudget,
      Attachment: "",
    });
  }, [requestOverviewData]);

  const handleVerdict = async (
    verdict: "accept" | "reject",
    payload: patchApprovalVerdict,
  ) => {
    try {
      const response = await fetch(webformAPI.PostVerdict(verdict), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        console.log("Server accepted the verdict");
        refetchApproverPath();
      } else {
        console.log("Server rejected the verdict");
      }
      navigate(`/approve`, { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  if (requestOverviewData === null) return;

  const isAuthorizedApprover = authInfo &&
    requestApproverPathData &&
    approverIsAuthorized(requestApproverPathData, authInfo.nrp);

  const requestIsRejected = requestApproverPathData?.some(
    (approverData) => approverData.Result === "Rejected",
  );

  return (
    <Primitive
      isLoading={[
        isRequestOverviewDataLoading,
        isRequestItemsDataLoading,
        isRequestFilesDataLoading,
        isRequestApproverPathDataLoading,
        authIsLoading,
      ]}
      isErr={[
        isRequestOverviewDataError,
        isRequestItemsDataError,
        isRequestFilesDataError,
        isRequestApproverPathDataError,
      ]}
      componentName="Request.tsx"
      pageTitle={`Request ${reactRouterParams.requestId}`}
    >
      <div className="flex flex-col gap-8">
        <div className="border">
          {isAuthorizedApprover && (
            <div className="flex items-center border-b border-black/50">
              <div
                className={`${APPROVE_BUTTON_STYLINGS} flex-1 text-center px-4 py-2`}
                onClick={async () => {
                  const payload: patchApprovalVerdict = {
                    traceId: Number(reactRouterParams.requestId),
                    rejectedItems: selectedRejects,
                    supervisorNrp: authInfo.nrp,
                    supervisorId: authInfo.userId,
                    supervisorLevel: getCurrentApproverLevel(
                      requestApproverPathData,
                    ),
                  };
                  await handleVerdict("accept", payload);
                }}
              >
                Approve
              </div>
              <div
                className={`${REJECT_BUTTON_STYLINGS} flex-1 text-center px-4 py-2`}
                onClick={() => {
                  toggleDialog(rejectReference);
                }}
              >
                Reject
              </div>
              <div
                className="bg-blue-700/40 hover:bg-blue-700/80 active:bg-blue-700/60 | flex-1 text-center px-4 py-2 select-none"
                onClick={() =>
                  generateRequestPdf(
                    reactRouterParams.requestId || "",
                    currentOverview,
                  )}
              >
                Print Request
              </div>
            </div>
          )}
          {Object.entries(currentOverview).map(([key, value], index) => {
            const blackAndWhite = `flex items-center border-b border-black/50 ${
              index % 2 === 0
                ? "bg-black/10 hover:bg-black/15 active:bg-black/12.5"
                : "bg-black/0 hover:bg-black/5 active:bg-black/2.5"
            }`;

            if (key === "Remarks") {
              return isAuthorizedApprover
                ? (
                  <div key={key} className={blackAndWhite}>
                    <div className="flex-1 px-4 py-2">{key}</div>
                    <div className="flex-9 px-4 py-2 flex flex-col gap-2">
                      <input
                        type="text"
                        className={`px-2 py-1 rounded-xl outline-none ${
                          currentRemarks !== newRemarks ? "bg-red-900/20" : ""
                        }`}
                        name="new-remarks"
                        id="new-remarks"
                        value={newRemarks}
                        placeholder={currentRemarks || "Remarks is empty"}
                        onChange={(e) => setNewRemarks(e.currentTarget.value)}
                      />
                      <div
                        className="w-max flex items-center gap-4"
                        onClick={async () => {
                          const payload: PatchRemarksPayload = {
                            newRemarks: newRemarks,
                            noForm: requestOverviewData[0].NoForm,
                          };
                          try {
                            const response = await fetch(
                              webformAPI.PatchRemarks,
                              {
                                method: "PATCH",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify(payload),
                              },
                            );
                            if (!response.ok) {
                              console.error(
                                "There was a problem in saving the new remarks",
                              );
                            }
                          } catch (err) {
                            console.error(err);
                          }
                          setCurrentRemarks(newRemarks);
                        }}
                      >
                        <Button
                          label="Save remarks"
                          id="save-new-remarks"
                          variant="black"
                        />
                        {currentRemarks !== newRemarks && (
                          <p className="text-sm">Changes are not saved</p>
                        )}
                      </div>
                    </div>
                  </div>
                )
                : (
                  <div key={key} className={blackAndWhite}>
                    <div className="flex-1 px-4 py-2">{key}</div>
                    <div className="flex-9 px-4 py-2">
                      {value === "" ? "-" : value}
                    </div>
                  </div>
                );
            } else if (key !== "Attachment") {
              return (
                <div key={key} className={blackAndWhite}>
                  <div className="flex-1 px-4 py-2">{key}</div>
                  <div className="flex-9 px-4 py-2">
                    {value === "" ? "-" : value}
                  </div>
                </div>
              );
            } else {
              return (
                <div key={key} className={blackAndWhite}>
                  <div className="flex-1 px-4 py-2">{key}</div>
                  <div className="flex-9 px-4 py-2">
                    {requestFilesData && requestFilesData.length === 0
                      ? "-"
                      : requestFilesData &&
                        requestFilesData.map((attachment, index) => {
                          return (
                            <div
                              key={index}
                              title={`Date Uploaded: ${
                                new Date(attachment.DateUpload).toISOString()
                              }`}
                            >
                              <a href="#" target="_blank">
                                {attachment.Filename}
                              </a>
                            </div>
                          );
                        })}
                  </div>
                </div>
              );
            }
          })}
        </div>
        <div className="flex flex-col gap-2 overflow-x-auto">
          <h2 className="font-bold text-2xl">Request Items</h2>
          <table
            id="request-items"
            className="table-auto border-collapse w-full"
          >
            <thead>
              <tr>
                {ITEMS_COLUMNS.map((column, index) => {
                  return (
                    <th
                      key={index}
                      className="bg-blue-900 hover:bg-blue-800 active:bg-blue-800/80 | text-white border border-black px-4 py-2 select-none"
                    >
                      {column}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {requestItemsData &&
                requestItemsData.map((item) => {
                  return (
                    <tr key={item.IDItem}>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | whitespace-nowrap border text-center px-4 py-2">
                        {item.IDItem}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | max-w-32 break-normal border text-center px-4 py-2">
                        {item.Description}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | whitespace-nowrap border text-center px-4 py-2">
                        {formatNumberToString(item.Qty)}{" "}
                        {capitalize(item.Measure)}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | whitespace-nowrap border text-center px-4 py-2">
                        {formatNumberToString(item.UnitPrice)} {item.Currency}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | whitespace-nowrap border text-center px-4 py-2">
                        {item.EstimatedDelivery}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | whitespace-nowrap border text-center px-4 py-2">
                        {item.Vendor}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | max-w-64 border text-center px-4 py-2">
                        {item.Reason}
                      </td>
                      <td
                        className="bg-white hover:bg-black/10 active:bg-black/5 | whitespace-nowrap border text-center px-4 py-2"
                        title={item.RejectedBy
                          ? `Rejected by : ${item.RejectedBy}`
                          : ""}
                      >
                        {item.StatusItem === "True" ? "Yes" : "No"}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | whitespace-nowrap border text-center px-4 py-2">
                        {stringIsEmpty(item.Supplier)}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | whitespace-nowrap border text-center px-4 py-2">
                        {formatNumberToString(item.UnitPrice * item.Qty)}{" "}
                        {item.Currency}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | whitespace-nowrap border text-center px-4 py-2">
                        {stringIsEmpty(String(item.DeliveryDate))}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-2 overflow-x-auto">
          <h2 className="font-bold text-2xl">Request Progress</h2>
          <table
            id="supervisor-path"
            className="table-auto border-collapse w-full"
          >
            <thead>
              <tr>
                {PROGRESS_COLUMNS.map((column, index) => {
                  return (
                    <th
                      key={index}
                      className="bg-blue-900 hover:bg-blue-800 active:bg-blue-800/80 | text-white border border-black py-2 select-none"
                    >
                      {column}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {requestApproverPathData &&
                requestApproverPathData.map((supervisor, index) => {
                  return (
                    <tr key={index}>
                      <td
                        className={`hover:bg-black/10 active:bg-black/5 | whitespace-nowrap border text-center px-4 py-2`}
                      >
                        {supervisor.ApproverType === "A"
                          ? "Approver"
                          : supervisor.ApproverType === "R"
                          ? "Releaser"
                          : "Administrator"}
                      </td>
                      <td
                        className={`hover:bg-black/10 active:bg-black/5 | whitespace-nowrap border text-center px-4 py-2`}
                      >
                        {supervisor.NRP}
                      </td>
                      <td
                        className={`hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2`}
                      >
                        {capitalize(supervisor.NameUser)}
                      </td>
                      <td
                        className={`${
                          handleProgressColors(supervisor.Result)
                        } hover:bg-black/10 active:bg-black/5 | whitespace-nowrap border text-center px-4 py-2`}
                      >
                        {supervisor.Result !== ""
                          ? supervisor.Result
                          : requestIsRejected
                          ? "-"
                          : "In Queue"}
                      </td>
                      <td
                        className={`hover:bg-black/10 active:bg-black/5 | whitespace-nowrap border text-center px-4 py-2`}
                      >
                        {supervisor.Result === "In Progress" ||
                            supervisor.Result === ""
                          ? "-"
                          : mysqlDateIsoStringToJSString(
                            supervisor.DateApprove,
                          )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
      {isAuthorizedApprover && (
        <Dialog
          toggle={() => toggleDialog(rejectReference)}
          ref={rejectReference}
        >
          <div className="flex flex-col px-16 py-16 gap-4">
            <h2 className="text-xl font-bold">
              Which item(s) are to be rejected?
            </h2>
            <div className="flex flex-col gap-1">
              {requestItemsData &&
                requestItemsData.map((item) => {
                  return (
                    <div key={item.IDItem} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name={String(item.IDItem)}
                        id={String(item.IDItem)}
                        checked={selectedRejects.includes(item.IDItem)}
                        onChange={() => {
                          const newValue = item.IDItem;
                          if (!selectedRejects.includes(newValue)) {
                            setSelectedRejects([...selectedRejects, newValue]);
                          } else {
                            setSelectedRejects(
                              selectedRejects.filter(
                                (selected) =>
                                  selected !== newValue,
                              ),
                            );
                          }
                        }}
                      />
                      <label
                        htmlFor={String(item.IDItem)}
                        className="select-none flex-1"
                      >
                        {item.IDItem}
                      </label>
                    </div>
                  );
                })}
            </div>
            <div
              className="flex-1"
              onClick={() => {
                if (
                  requestItemsData &&
                  requestItemsData.length !== selectedRejects.length
                ) {
                  const allIds = requestItemsData.map((item) => item.IDItem);
                  setSelectedRejects(allIds);
                } else if (
                  requestItemsData &&
                  requestItemsData.length === selectedRejects.length
                ) {
                  setSelectedRejects([]);
                }
              }}
            >
              <Button
                id="reject-submit"
                variant="black"
                label={requestItemsData &&
                    requestItemsData.length !== selectedRejects.length
                  ? "Select All"
                  : "Deselect All"}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <div
                className="flex-1"
                onClick={() => toggleDialog(rejectReference)}
              >
                <Button id="reject-cancel" variant="red" label="Cancel" />
              </div>
              <div
                className="flex-1"
                onClick={async () => {
                  if (selectedRejects.length === 0) {
                    setRejectEmptyErr(true);
                  } else {
                    const payload: patchApprovalVerdict = {
                      traceId: Number(reactRouterParams.requestId),
                      rejectedItems: selectedRejects,
                      supervisorNrp: authInfo.nrp,
                      supervisorId: authInfo.userId,
                      supervisorLevel: getCurrentApproverLevel(
                        requestApproverPathData,
                      ),
                    };
                    await handleVerdict("reject", payload);
                    setRejectEmptyErr(false);
                  }
                }}
              >
                <Button id="reject-submit" variant="green" label="OK" />
              </div>
            </div>
            {rejectEmptyErr && (
              <span className="self-center text-red-600">
                You must atleast select 1 item to reject
              </span>
            )}
          </div>
        </Dialog>
      )}
    </Primitive>
  );
};

export default Request;
