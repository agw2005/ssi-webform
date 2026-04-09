import React, { useEffect } from "react";
import LoadingFallback from "../../reusable/LoadingFallback.tsx";
import formatNumberToString from "../../../helper/formatNumberToString.ts";
import { Link } from "react-router-dom";
import type { BudgetViewAtYear } from "@scope/server";
import useBudgets from "../../../hooks/useBudgets.tsx";

interface BudgetViewProps {
  year: string;
  fileResource: string;
}

const MONTH_INDEX = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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

const BudgetView = ({ year, fileResource }: BudgetViewProps) => {
  const params = new URLSearchParams();
  params.set("year", year);
  if (fileResource !== "Show All" && fileResource !== "") {
    params.set("fileresource", fileResource);
  }

  const {
    budgets: budgetViewData,
    budgetIsLoading: isBudgetViewDataLoading,
    budgetIsError: isBudgetViewDataError,
  } = useBudgets(
    year,
    fileResource,
    params.toString(),
  );

  const uniqueRows: BudgetViewAtYear[] | null = budgetViewData &&
    budgetViewData.filter(
      (budgetData, index, self) =>
        index ===
          self.findIndex(
            (data) =>
              data.CostCenter === budgetData.CostCenter &&
              data.Nature === budgetData.Nature &&
              data.Department === budgetData.Department &&
              data.FileResource === budgetData.FileResource,
          ),
    );

  useEffect(() => {
    console.log(uniqueRows);
  }, [uniqueRows]);

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
                {MONTH_INDEX.map((monthIndex, index) => {
                  const monthData = budgetViewData?.find(
                    (budgetData) =>
                      budgetData.CostCenter === rowCostCenter &&
                      budgetData.Nature === rowNature &&
                      budgetData.MonthIndex === monthIndex,
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
                        <Link
                          className="text-blue-700 underline"
                          to={`/usage?year=${monthData?.PeriodYear}&month=${monthData?.MonthIndex}&costcenter=${rowData.CostCenter}&nature=${rowNature}`}
                        >
                          {formatNumberToString(monthUsage)}
                        </Link>
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
