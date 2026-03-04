import { useParams } from "react-router-dom";
import Primitive from "../components/reusable/Primitive.tsx";
import useFetch from "../hooks/useFetch.tsx";
import type { RequestOverview } from "@scope/server";
import LoadingFallback from "../components/reusable/LoadingFallback.tsx";
import capitalize from "../helper/capitalize.ts";

const REQUEST_URL = "http://localhost:8000/trace/request";

const ITEMS_COLUMNS = [
  "Description",
  "Quantity",
  "Measure",
  "Unit Price",
  "Currency",
  "Estimated Delivery",
  "Vendor",
  "Reason",
  "Rejected",
  "Supplier",
  "Net Price",
  "Delivery Date",
];

// const PROGRESS_COLUMNS = [
//   "Status",
//   "Type",
//   "NRP",
//   "Name",
//   "Result",
//   "Verdict Date",
// ];

// const ProgressColors = {
//   Approved: "bg-green-500/20 hover:bg-green-500/35 active:bg-green-500/25",
//   Rejected: "bg-red-500/10 hover:bg-red-500/35 active:bg-red-500/25",
//   InProgress: "bg-blue-500/25 hover:bg-blue-500/35 active:bg-blue-500/50",
//   InQueue: "bg-white hover:bg-black/10 active:bg-black/5",
// } as const;

const Request = () => {
  const reactRouterParams = useParams();

  const {
    data: requestData,
    isLoading: isRequestDataLoading,
    isError: isRequestDataError,
  } = useFetch<RequestOverview>(REQUEST_URL, reactRouterParams.requestId);

  if (isRequestDataLoading) {
    return <LoadingFallback />;
  }

  if (isRequestDataError) {
    return (
      <div className="m-4">
        <div>Something unexpected happened.</div>
        {isRequestDataError ? isRequestDataError.message : ""}
      </div>
    );
  }

  if (requestData === null) return;
  const overview = {
    ID: requestData[0].FormID,
    "Form Number": requestData[0].NoForm,
    Requestor: `${capitalize(requestData[0].Requestor)} (${requestData[0].RequestorNRP}) - ${requestData[0].RequestorSection}`,
    "PR Number": requestData[0].NoPR,
    Subject: requestData[0].Subject,
    Amount: requestData[0].Amount,
    "Return On Outgoing": requestData[0].ReturnOnOutgoing,
    Remarks: requestData[0].Remarks,
    "Cost Center": requestData[0].CostCenter,
    Nature: requestData[0].Nature,
    "ID Budget": requestData[0].IDBudget,
    "Rate (1 USD)": requestData[0].Rate,
  };

  return (
    <Primitive>
      <div className="flex flex-col gap-8">
        <div className="border">
          {Object.entries(overview).map(([key, value], index) => (
            <div
              key={key}
              className={`flex border-b border-black/50 ${
                index % 2 === 0
                  ? "bg-black/10 hover:bg-black/15 active:bg-black/12.5"
                  : "bg-black/0 hover:bg-black/5 active:bg-black/2.5"
              }`}
            >
              <div className="flex-1 px-4 py-2">{key}</div>
              <div className="flex-9 px-4 py-2">
                {value === "" ? "-" : value}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-2xl">Request Items</h2>
          <table className="table-auto border-collapse w-full">
            <thead>
              <tr>
                {ITEMS_COLUMNS.map((column, index) => {
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
              {requestData &&
                requestData.map((request, index) => {
                  return (
                    <tr key={index}>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | w-32 break-normal border text-center px-4 py-2">
                        {request.description}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2">
                        {request.quantity}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2">
                        {request.measure}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2">
                        {request.unitPrice}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2">
                        {request.currency}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2">
                        {request.estimatedDeliveryDate}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2">
                        {request.vendor}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | w-64 border text-center px-4 py-2">
                        {request.reason}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2">
                        {request.rejected ? "Yes" : "No"}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2">
                        {request.supplier}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2">
                        {request.netPrice}
                      </td>
                      <td className="bg-white hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2">
                        {request.deliveryDate}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        {/* <div className="flex flex-col gap-2">
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
              {PLACEHOLDER_PROGRESS.map((row, index) => {
                return (
                  <tr key={index}>
                    <td
                      className={`${progressColor(row.status)} active:bg-black/5 | border text-center px-4 py-2`}
                    >
                      {row.status}
                    </td>
                    <td
                      className={`${progressColor(row.status)} active:bg-black/5 | border text-center px-4 py-2`}
                    >
                      {row.type}
                    </td>
                    <td
                      className={`${progressColor(row.status)} active:bg-black/5 | border text-center px-4 py-2`}
                    >
                      {row.nrp}
                    </td>
                    <td
                      className={`${progressColor(row.status)} active:bg-black/5 | border text-center px-4 py-2`}
                    >
                      {row.name}
                    </td>
                    <td
                      className={`${progressColor(row.status)} active:bg-black/5 | border text-center px-4 py-2`}
                    >
                      {row.result}
                    </td>
                    <td
                      className={`${progressColor(row.status)} active:bg-black/5 | border text-center px-4 py-2`}
                    >
                      {row.verdictDate}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div> */}
      </div>
    </Primitive>
  );
};

export default Request;
