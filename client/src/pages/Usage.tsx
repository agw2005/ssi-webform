import { Link, useSearchParams } from "react-router-dom";
import Primitive from "../components/reusable/Primitive.tsx";
import Button from "../components/reusable/Button.tsx";
import { useEffect, useState } from "react";
import getDateRangeAtPeriode from "../helper/getDateRangeAtPeriode.ts";
import dateToMySQLDateInput from "../helper/dateToMySQLDateInput.ts";
import formatNumberToString from "../helper/formatNumberToString.ts";
import capitalize from "../helper/capitalize.ts";
import serverDomain from "../helper/serverDomain.ts";

const REQUEST_SPECIFIC_URL = `${serverDomain}/frmprh`;

interface BudgetViewRequestResponse {
  IDTrace: string;
  ItemId: string;
  NoPR: string;
  AcctAssgCategory: string;
  CostCenter: string;
  Nature: string;
  Description: string;
  Qty: number;
  Measure: string;
  UnitPrice: number;
  Currency: string;
  EstimationDeliveryDate: string;
  Vendor: string;
  Reason: string;
  StatusItem: string;
  RejectedBy: string;
  Supplier: string;
  NetPrice: string;
  DeliveryDate: string;
  NoPO: string;
  Rate: number;
  IDBudget: string;
  SubmitDate: string;
}

const COLUMNS = [
  "Trace ID",
  "Item ID",
  "No.PR",
  "AcctAssgCategory",
  "Cost Center",
  "Nature",
  "Description",
  "Quantity",
  "Unit Price",
  "Currency",
  "Estimated Delivery Date",
  "Vendor",
  "Reason",
  "Is Rejected",
  "Rejected By",
  "Supplier",
  "Net Price",
  "Delivery Date",
  "No.PO",
  "Rate (1 USD)",
  "Budget ID",
];

const Usage = () => {
  const [searchParams] = useSearchParams();
  const [start, end] = getDateRangeAtPeriode(searchParams.get("periode") || "");
  const nature = searchParams.get("nature") || "";
  const costCenter = searchParams.get("costcenter") || "";

  const [requestsData, setRequestsData] = useState<
    BudgetViewRequestResponse[] | null
  >(null);
  const [isRequestsDataLoading, setIsRequestsDataLoading] = useState(false);
  const [isRequestsDataError, setIsRequestsDataError] = useState<Error | null>(
    null,
  );

  const applyParams = (url: URL) => {
    const startDate = dateToMySQLDateInput(start);
    const endDate = dateToMySQLDateInput(end);
    url.searchParams.set("nature", nature);
    url.searchParams.set("costcenter", costCenter);
    url.searchParams.set("startdate", startDate);
    url.searchParams.set("enddate", endDate);
  };

  useEffect(() => {
    const requestUrl = new URL(REQUEST_SPECIFIC_URL);
    const abortController = new AbortController();
    setIsRequestsDataLoading(true);
    applyParams(requestUrl);

    const fetchData = async () => {
      try {
        const response = await fetch(requestUrl.toString(), {
          signal: abortController.signal,
        });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const budgetViewRequests: BudgetViewRequestResponse[] =
          await response.json();

        setRequestsData(budgetViewRequests);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        const error: Error = new Error(
          `Encountered an error when fetching API. Please ensure your connection is stable.\n(${err}).`,
        );
        setIsRequestsDataError(error);
      } finally {
        setIsRequestsDataLoading(false);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <Primitive
      isLoading={[isRequestsDataLoading]}
      isErr={[isRequestsDataError]}
      componentName="Usage.tsx"
    >
      <div className="flex" onClick={() => history.back()}>
        <Button id="go-back" variant="black" label="Back" />
      </div>
      {requestsData && requestsData.length === 0 ? (
        <div className="mt-4 font-bold">There is not items</div>
      ) : (
        <div className="overflow-x-auto min-h-50 max-h-160 mt-4">
          <table className="table-auto border-collapse mt-4">
            <thead className="sticky top-0 z-10 border">
              <tr>
                {COLUMNS.map((column, index) => {
                  return (
                    <th
                      key={index}
                      className="text-xs lg:text-sm xl:text-base | border p-2 bg-blue-800 text-white border-black whitespace-nowrap text-center"
                    >
                      {column}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {requestsData &&
                requestsData.map((requestData, index) => {
                  return (
                    <tr key={index}>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                        {requestData.IDTrace}
                      </td>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                        {requestData.ItemId}
                      </td>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                        {requestData.NoPR}
                      </td>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                        {requestData.AcctAssgCategory
                          ? requestData.AcctAssgCategory
                          : "-"}
                      </td>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                        {requestData.CostCenter}
                      </td>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                        {requestData.Nature}
                      </td>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 min-w-48 text-center">
                        <Link
                          className="text-blue-700 underline"
                          to={`/request/${requestData.IDTrace}`}
                        >
                          {requestData.Description}
                        </Link>
                      </td>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                        {formatNumberToString(requestData.Qty)}{" "}
                        {capitalize(requestData.Measure)}
                      </td>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                        {formatNumberToString(requestData.UnitPrice)}
                      </td>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                        {requestData.Currency}
                      </td>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                        {requestData.EstimationDeliveryDate}
                      </td>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                        {requestData.Vendor}
                      </td>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                        {requestData.Reason}
                      </td>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                        {requestData.StatusItem}
                      </td>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                        {requestData.RejectedBy ? requestData.RejectedBy : "-"}
                      </td>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                        {requestData.Supplier ? requestData.Supplier : "-"}
                      </td>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                        {formatNumberToString(
                          requestData.UnitPrice * requestData.Qty,
                        )}
                      </td>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                        {requestData.DeliveryDate
                          ? requestData.DeliveryDate
                          : "-"}
                      </td>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                        {requestData.NoPO ? requestData.NoPO : "-"}
                      </td>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                        {formatNumberToString(requestData.Rate)}{" "}
                        {requestData.Currency}
                      </td>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                        {requestData.IDBudget}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </Primitive>
  );
};

export default Usage;
