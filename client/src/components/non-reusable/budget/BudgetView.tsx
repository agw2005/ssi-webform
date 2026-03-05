import React, { useEffect, useState } from "react";
import LoadingFallback from "../../reusable/LoadingFallback.tsx";
import formatNumberToString from "../../../helper/formatNumberToString.ts";

const BUDGET_VIEW_URL = "http://localhost:8000/budget";

interface BudgetViewProps {
  periode: string;
  fileResource: string;
}

interface BudgetViewResponse {
  Periode: string;
  FileResource: string;
  Department: number;
  CostCenter: string;
  Nature: string;
  Description: string;
  Budget: string;
  Balance: string;
}

const MONTHS = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

const THREE_COLSPAN_COLUMNS = [
  "(01) January",
  "(02) February",
  "(03) March",
  "(04) April",
  "(05) May",
  "(06) June",
  "(07) July",
  "(08) August",
  "(09) September",
  "(10) October",
  "(11) November",
  "(12) December",
];

const TWO_ROWSPAN_COLUMNS = [
  "File Resource",
  "Cost Center",
  "Nature",
  "Description",
];

const SUB_COLUMNS = ["Budget", "Usage", "Balance"];

const BudgetView = ({ periode, fileResource }: BudgetViewProps) => {
  const [budgetViewData, setBudgetViewData] = useState<
    BudgetViewResponse[] | null
  >(null);
  const [isBudgetViewDataLoading, setIsBudgetViewDataLoading] = useState(false);
  const [isBudgetViewDataError, setIsBudgetViewDataError] =
    useState<Error | null>(null);

  const applyParams = (url: URL) => {
    url.searchParams.set("periode", periode);
    if (fileResource !== "Show All" && fileResource !== "") {
      url.searchParams.set("fileresource", fileResource);
    }
  };

  useEffect(() => {
    const requestUrl = new URL(BUDGET_VIEW_URL);
    const abortController = new AbortController();
    setIsBudgetViewDataLoading(true);
    applyParams(requestUrl);

    const fetchData = async () => {
      try {
        const budgetViewResponse = await fetch(requestUrl.toString(), {
          signal: abortController.signal,
        });
        if (!budgetViewResponse.ok)
          throw new Error(`HTTP error! status: ${budgetViewResponse.status}`);

        const budgetViewResponseJson: BudgetViewResponse[] =
          await budgetViewResponse.json();

        setBudgetViewData(budgetViewResponseJson);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        const error: Error = new Error(
          `Encountered an error when fetching API. Please ensure your connection is stable.\n(${err}).`,
        );
        setIsBudgetViewDataError(error);
      } finally {
        setIsBudgetViewDataLoading(false);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [periode, fileResource]);

  if (isBudgetViewDataLoading) {
    return <LoadingFallback />;
  }

  if (isBudgetViewDataError) {
    return (
      <div className="m-4">
        <div>Something unexpected happened.</div>
        {isBudgetViewDataError ? isBudgetViewDataError.message : ""}
      </div>
    );
  }

  const uniqueRows =
    budgetViewData &&
    budgetViewData.filter(
      (budgetData, index, self) =>
        index ===
        self.findIndex(
          (data) =>
            data.CostCenter === budgetData.CostCenter &&
            data.Nature === budgetData.Nature,
        ),
    );

  return (
    <div className="overflow-x-auto min-h-50 max-h-160 mt-4">
      <table className="table-auto border-collapse mt-4">
        <thead className="sticky top-0 z-10 border">
          <tr>
            {TWO_ROWSPAN_COLUMNS.map((column, index) => {
              return (
                <th
                  key={index}
                  rowSpan={2}
                  className="text-xs lg:text-sm xl:text-base | border p-2 bg-blue-800 text-white border-black whitespace-nowrap text-center"
                >
                  {column}
                </th>
              );
            })}
            {THREE_COLSPAN_COLUMNS.map((column, index) => {
              return (
                <th
                  key={index}
                  colSpan={3}
                  className="text-xs lg:text-sm xl:text-base | border p-2 bg-blue-700 text-white border-black whitespace-nowrap text-center"
                >
                  {column}
                </th>
              );
            })}
          </tr>
          <tr>
            {THREE_COLSPAN_COLUMNS.map((_column, index) => {
              return (
                <React.Fragment key={index}>
                  {SUB_COLUMNS.map((subcolumn, index) => {
                    return (
                      <th
                        key={index}
                        className="text-xs lg:text-sm xl:text-base | border p-2 bg-blue-800 text-white border-black whitespace-nowrap text-center"
                      >
                        {subcolumn}
                      </th>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {uniqueRows?.map((rowData, index) => {
            const rowCostCenter = rowData.CostCenter;
            const rowNature = rowData.Nature;
            return (
              <tr key={index}>
                <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                  {rowData.FileResource} ({rowData.Department})
                </td>
                <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                  {rowCostCenter}
                </td>
                <td className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center">
                  {rowNature}
                </td>
                <td className="text-xs lg:text-sm xl:text-base | border p-2 min-w-50 max-w-50 text-center">
                  {rowData.Description}
                </td>
                {MONTHS.map((month, index) => {
                  const monthData = budgetViewData?.find(
                    (budgetData) =>
                      budgetData.CostCenter === rowCostCenter &&
                      budgetData.Nature === rowNature &&
                      budgetData.Periode.endsWith(month),
                  );
                  const monthBudget = Number(monthData?.Budget || 0);
                  const monthBalance = Number(monthData?.Balance || 0);
                  const monthUsage = monthBudget - monthBalance;
                  return (
                    <React.Fragment key={index}>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 text-center">
                        {formatNumberToString(monthBudget)}
                      </td>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 text-center">
                        {formatNumberToString(monthUsage)}
                      </td>
                      <td className="text-xs lg:text-sm xl:text-base | border p-2 text-center">
                        {formatNumberToString(monthBalance)}
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BudgetView;
