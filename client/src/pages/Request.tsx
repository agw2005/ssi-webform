import { useParams } from "react-router-dom";
import Primitive from "../components/reusable/Primitive.tsx";
import useFetch from "../hooks/useFetch.tsx";
import type {
  RequestOverview,
  RequestItem,
  UploadedFile,
  ApproverPath,
} from "@scope/server";
import LoadingFallback from "../components/reusable/LoadingFallback.tsx";
import capitalize from "../helper/capitalize.ts";
import formatNumberToString from "../helper/formatNumberToString.ts";

const REQUEST_OVERVIEW_URL = "http://localhost:8000/trace/request";
const REQUEST_ITEMS_URL = "http://localhost:8000/frmprd/request";
const REQUEST_FILES_URL = "http://localhost:8000/uploadfile";
const REQUEST_APPROVER_PATH_URL = "http://localhost:8000/traced";

const ITEMS_COLUMNS = [
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

const Request = () => {
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

  if (
    isRequestOverviewDataLoading ||
    isRequestItemsDataLoading ||
    isRequestFilesDataLoading ||
    isRequestApproverPathDataLoading
  ) {
    return <LoadingFallback />;
  }

  if (
    isRequestOverviewDataError ||
    isRequestItemsDataError ||
    isRequestFilesDataError ||
    isRequestApproverPathDataError
  ) {
    return (
      <div className="m-4">
        <div>Something unexpected happened.</div>
        {isRequestOverviewDataError ? isRequestOverviewDataError.message : ""}
      </div>
    );
  }

  if (requestOverviewData === null) return;
  const overview = {
    ID: requestOverviewData[0].FormID,
    "Form Number": requestOverviewData[0].NoForm,
    Requestor: `${capitalize(requestOverviewData[0].Requestor)} (${requestOverviewData[0].RequestorNRP}) - ${requestOverviewData[0].RequestorSection}`,
    "PR Number": requestOverviewData[0].NoPR,
    Subject: requestOverviewData[0].Subject,
    Amount: formatNumberToString(requestOverviewData[0].Amount),
    "Return On Outgoing": requestOverviewData[0].ReturnOnOutgoing,
    Remarks: requestOverviewData[0].Remarks,
    "Cost Center": requestOverviewData[0].CostCenter,
    Nature: requestOverviewData[0].Nature,
    "ID Budget": requestOverviewData[0].IDBudget,
    "Rate (1 USD)": formatNumberToString(requestOverviewData[0].Rate),
    Attachment: "",
  };

  return (
    <Primitive>
      <div className="flex flex-col gap-8">
        <div className="border">
          {Object.entries(overview).map(([key, value], index) => {
            const blackAndWhite = `flex items-center border-b border-black/50 ${
              index % 2 === 0
                ? "bg-black/10 hover:bg-black/15 active:bg-black/12.5"
                : "bg-black/0 hover:bg-black/5 active:bg-black/2.5"
            }`;

            if (key !== "Attachment") {
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
                              title={`Date Uploaded: ${attachment.DateUpload}>`}
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
                requestItemsData.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | max-w-32 break-normal border text-center px-4 py-2">
                        {item.Description}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2">
                        {formatNumberToString(item.Qty)}{" "}
                        {capitalize(item.Measure)}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2">
                        {formatNumberToString(item.UnitPrice)} {item.Currency}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2">
                        {item.EstimatedDelivery}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2">
                        {item.Vendor}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | max-w-64 border text-center px-4 py-2">
                        {item.Reason}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2">
                        {item.Rejected === "True" ? "Yes" : "No"}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2">
                        {stringIsEmpty(item.Supplier)}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2">
                        {formatNumberToString(item.UnitPrice * item.Qty)}{" "}
                        {item.Currency}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2">
                        {stringIsEmpty(String(item.DeliveryDate))}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-2">
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
                        className={`hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2`}
                      >
                        {supervisor.ApproverType === "A"
                          ? "Approver"
                          : supervisor.ApproverType === "R"
                            ? "Releaser"
                            : "Administrator"}
                      </td>
                      <td
                        className={`hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2`}
                      >
                        {supervisor.NRP}
                      </td>
                      <td
                        className={`hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2`}
                      >
                        {capitalize(supervisor.NameUser)}
                      </td>
                      <td
                        className={`${handleProgressColors(supervisor.Result)} hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2`}
                      >
                        {supervisor.Result !== ""
                          ? supervisor.Result
                          : "In Queue"}
                      </td>
                      <td
                        className={`hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2`}
                      >
                        {supervisor.Result !== "Approved"
                          ? "-"
                          : supervisor.DateApprove}
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
