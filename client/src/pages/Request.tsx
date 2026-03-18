import { useParams } from "react-router-dom";
import Primitive from "../components/reusable/Primitive.tsx";
import useFetch from "../hooks/useFetch.tsx";
import type {
  RequestOverview,
  RequestItem,
  UploadedFile,
  ApproverPath,
  PatchRemarksPayload,
} from "@scope/server";
import { onlyNumerics } from "@scope/server";
import capitalize from "../helper/capitalize.ts";
import formatNumberToString from "../helper/formatNumberToString.ts";
import serverDomain from "../helper/serverDomain.ts";
import mysqlDateIsoStringToJSString from "../helper/mysqlDateIsoStringToJSString.ts";
import useAuth from "../hooks/useAuth.tsx";
import Button from "../components/reusable/Button.tsx";
import { useEffect, useState } from "react";

const REQUEST_OVERVIEW_URL = `${serverDomain}/trace/request`;
const REQUEST_ITEMS_URL = `${serverDomain}/frmprd/request`;
const REQUEST_FILES_URL = `${serverDomain}/uploadfile`;
const REQUEST_APPROVER_PATH_URL = `${serverDomain}/traced`;
const PATCH_REMARKS_URL = `${serverDomain}/approve/remarks`;

const UNAUTH_ITEMS_COLUMNS = [
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

const authItemsColumns = [
  ...UNAUTH_ITEMS_COLUMNS.slice(0, 6),
  ...UNAUTH_ITEMS_COLUMNS.slice(7),
  "Operation",
];

const PROGRESS_COLUMNS = ["Type", "NRP", "Name", "Result", "Verdict Date"];

const REJECT_BUTTON_STYLINGS =
  "bg-red-700/40 hover:bg-red-700/80 active:bg-red-700/60 select-none";

const APPROVE_BUTTON_STYLINGS =
  "bg-green-700/40 hover:bg-green-700/80 active:bg-green-700/60 select-none";

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

const approverIsAuthorized = (data: ApproverPath[], nrp: string) => {
  return data.some(
    (item) =>
      onlyNumerics(item.NRP) === onlyNumerics(nrp) &&
      item.Result === "In Progress",
  );
};

const Request = () => {
  const { authInfo, authIsLoading } = useAuth();
  const reactRouterParams = useParams();

  const {
    data: requestOverviewData,
    isLoading: isRequestOverviewDataLoading,
    isError: isRequestOverviewDataError,
  } = useFetch<RequestOverview>(
    REQUEST_OVERVIEW_URL,
    reactRouterParams.requestId,
  );

  const {
    data: requestItemsData,
    isLoading: isRequestItemsDataLoading,
    isError: isRequestItemsDataError,
  } = useFetch<RequestItem>(REQUEST_ITEMS_URL, reactRouterParams.requestId);

  const {
    data: requestFilesData,
    isLoading: isRequestFilesDataLoading,
    isError: isRequestFilesDataError,
  } = useFetch<UploadedFile>(REQUEST_FILES_URL, reactRouterParams.requestId);

  const {
    data: requestApproverPathData,
    isLoading: isRequestApproverPathDataLoading,
    isError: isRequestApproverPathDataError,
  } = useFetch<ApproverPath>(
    REQUEST_APPROVER_PATH_URL,
    reactRouterParams.requestId,
  );

  const [currentRemarks, setCurrentRemarks] = useState("");
  const [newRemarks, setNewRemarks] = useState("");

  useEffect(() => {
    if (requestOverviewData?.[0]?.Remarks) {
      setCurrentRemarks(requestOverviewData[0].Remarks);
      setNewRemarks(requestOverviewData[0].Remarks);
    }
  }, [requestOverviewData]);

  if (requestOverviewData === null) return;
  const overview = {
    ID: requestOverviewData[0].FormID,
    "Form Number": requestOverviewData[0].NoForm,
    Requestor: `${capitalize(requestOverviewData[0].Requestor)} (${requestOverviewData[0].RequestorNRP}) - ${requestOverviewData[0].RequestorSection}`,
    "PR Number": requestOverviewData[0].NoPR,
    Subject: requestOverviewData[0].Subject,
    Amount: `${formatNumberToString(requestOverviewData[0].Amount)} USD`,
    "Return On Outgoing": requestOverviewData[0].ReturnOnOutgoing,
    Remarks: requestOverviewData[0].Remarks,
    "Cost Center": requestOverviewData[0].CostCenter,
    Nature: requestOverviewData[0].Nature,
    "ID Budget": requestOverviewData[0].IDBudget,
    // "Rate (1 USD)": formatNumberToString(requestOverviewData[0].Rate),
    Attachment: "",
  };

  const isAuthorizedApprover =
    authInfo &&
    requestApproverPathData &&
    approverIsAuthorized(requestApproverPathData, authInfo.nrp);

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
    >
      <div className="flex flex-col gap-8">
        <div className="border">
          {isAuthorizedApprover && (
            <div className="flex items-center border-b border-black/50">
              <div
                className={`${APPROVE_BUTTON_STYLINGS} flex-1 text-center px-4 py-2`}
              >
                Approve All
              </div>
              <div
                className={`${REJECT_BUTTON_STYLINGS} flex-1 text-center px-4 py-2`}
                onClick={() => {
                  //frm_PR_D = StatusItem ('True') , RejectedBy (supervisor NameUser)
                  //
                }}
              >
                Reject All
              </div>
              <div className="bg-blue-700/40 hover:bg-blue-700/80 active:bg-blue-700/60 | flex-1 text-center px-4 py-2 select-none">
                Print Request
              </div>
            </div>
          )}
          {Object.entries(overview).map(([key, value], index) => {
            const blackAndWhite = `flex items-center border-b border-black/50 ${
              index % 2 === 0
                ? "bg-black/10 hover:bg-black/15 active:bg-black/12.5"
                : "bg-black/0 hover:bg-black/5 active:bg-black/2.5"
            }`;

            if (key === "Remarks") {
              return isAuthorizedApprover ? (
                <div key={key} className={blackAndWhite}>
                  <div className="flex-1 px-4 py-2">{key}</div>
                  <div className="flex-9 px-4 py-2 flex flex-col gap-2">
                    <input
                      type="text"
                      className={`px-2 py-1 rounded-xl outline-none ${currentRemarks !== newRemarks ? "bg-red-900/20" : ""}`}
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
                          const response = await fetch(PATCH_REMARKS_URL, {
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify(payload),
                          });
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
              ) : (
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
                              title={`Date Uploaded: ${new Date(attachment.DateUpload).toISOString()}`}
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
          <table className="table-auto border-collapse w-full">
            <thead>
              <tr>
                {!isAuthorizedApprover
                  ? UNAUTH_ITEMS_COLUMNS.map((column, index) => {
                      return (
                        <th
                          key={index}
                          className="bg-blue-900 hover:bg-blue-800 active:bg-blue-800/80 | text-white border border-black px-4 py-2 select-none"
                        >
                          {column}
                        </th>
                      );
                    })
                  : authItemsColumns.map((column, index) => {
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
                requestItemsData.map((item, index) => {
                  return (
                    <tr key={index}>
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
                      {!isAuthorizedApprover && (
                        <td className="bg-white hover:bg-black/10 active:bg-black/5 | whitespace-nowrap border text-center px-4 py-2">
                          {item.Rejected === "True" ? "Yes" : "No"}
                        </td>
                      )}
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
                      {isAuthorizedApprover && (
                        <td className="border text-center p-0 h-1">
                          <div className="flex flex-col h-full w-full">
                            <div
                              className={`${APPROVE_BUTTON_STYLINGS} flex-1 flex items-center justify-center px-4 py-2`}
                            >
                              Approve
                            </div>
                            <div
                              className={`${REJECT_BUTTON_STYLINGS} flex-1 flex items-center justify-center px-4 py-2`}
                            >
                              Reject
                            </div>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-2 overflow-x-auto">
          <h2 className="font-bold text-2xl">Request Progress</h2>
          <table className="table-auto border-collapse w-full">
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
                        className={`${handleProgressColors(supervisor.Result)} hover:bg-black/10 active:bg-black/5 | whitespace-nowrap border text-center px-4 py-2`}
                      >
                        {supervisor.Result !== ""
                          ? supervisor.Result
                          : "In Queue"}
                      </td>
                      <td
                        className={`hover:bg-black/10 active:bg-black/5 | whitespace-nowrap border text-center px-4 py-2`}
                      >
                        {supervisor.Result !== "Approved"
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
    </Primitive>
  );
};

export default Request;
