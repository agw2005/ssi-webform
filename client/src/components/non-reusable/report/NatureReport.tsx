import React from "react";
import type { Row } from "../../../pages/Report.tsx";
import formatNegativeNumber from "../../../helper/formatNegativeNumber.ts";
import capitalize from "../../../helper/capitalize.ts";
import type { ReportResponse } from "@scope/server-ssms";

interface NatureReportProps {
  SubMonthIndex: string[];
  SubMonth: string[];
  MonthSubColumn: string[];
  ReportData: ReportResponse[];
  RowData: Row[];
  Period: string;
}

interface NatureReportFooter {
  TotalBudget: number;
  TotalUsage: number;
  TotalBalance: number;
  Month: string;
}

const NatureReport = ({
  SubMonthIndex,
  SubMonth,
  MonthSubColumn,
  ReportData,
  RowData,
  Period,
}: NatureReportProps) => {
  console.log(RowData);
  if (ReportData.length === 0) {
    return <div></div>;
  }

  const categoryCounts = RowData.reduce(
    (acc, row) => {
      const category = row.Description.includes("(ADM)")
        ? "Administration"
        : "Production";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const tableFooter: NatureReportFooter[] = SubMonthIndex.map((monthIndex) => {
    const totals = RowData.reduce(
      (acc, row) => {
        const monthData = row.Months?.[monthIndex];

        if (monthData) {
          acc.TotalBudget += monthData.Budget || 0;
          acc.TotalUsage += monthData.Usage || 0;
          acc.TotalBalance += monthData.Balance || 0;
        }

        return acc;
      },
      {
        TotalBudget: 0,
        TotalUsage: 0,
        TotalBalance: 0,
      },
    );

    return {
      Month: monthIndex,
      ...totals,
    };
  });

  const grandTotal: NatureReportFooter = tableFooter.reduce(
    (current, next) => {
      current.TotalBudget += next.TotalBudget;
      current.TotalUsage += next.TotalUsage;
      current.TotalBalance += next.TotalBalance;
      return current;
    },
    {
      Month: "AGGREGATED",
      TotalBudget: 0,
      TotalUsage: 0,
      TotalBalance: 0,
    },
  );

  return (
    <table
      id="report"
      className="table-auto border border-collapse w-full text-[0.6rem]"
    >
      <thead className="border">
        <tr>
          <th rowSpan={2} className="border p-1"></th>
          <th rowSpan={2} className="border p-1">
            NATURE
          </th>
          <th rowSpan={2} className="border p-1">
            DESCRIPTION
          </th>
          {SubMonth.map((month, index) => (
            <th key={index} colSpan={4} className="border p-1">
              {month}
            </th>
          ))}
          <th colSpan={4} className="border p-1">
            {Period}
          </th>
        </tr>
        <tr>
          {[...Array(7)].map((_, index) => {
            return MonthSubColumn.map((subcolumn, subindex) => {
              return (
                <th key={`${index}-${subindex}`} className="border p-1">
                  {subcolumn}
                </th>
              );
            });
          })}
        </tr>
      </thead>
      <tbody>
        {RowData.map((row, index) => {
          const totalUsage = row.TotalBudget - row.TotalBalance;
          const percentage = row.TotalBudget > 0
            ? (row.TotalBalance / row.TotalBudget) * 100
            : 0;

          const currentCategory = row.Description.includes("(ADM)")
            ? "Administration"
            : "Production";

          const previousCategory = index > 0
            ? RowData[index - 1].Description.includes("(ADM)")
              ? "Administration"
              : "Production"
            : null;

          const isFirstOfCategory = currentCategory !== previousCategory;

          return (
            <tr key={index}>
              {isFirstOfCategory && (
                <td
                  rowSpan={categoryCounts[currentCategory]}
                  className="text-[0.75rem] border p-2 whitespace-nowrap text-center align-center"
                >
                  {currentCategory}
                </td>
              )}
              <td className="text-[0.75rem] border p-2 whitespace-nowrap text-center">
                {row.Nature}
              </td>
              <td className="text-[0.75rem] border p-2 whitespace-nowrap text-center">
                {row.Description}
              </td>
              {SubMonthIndex.map((SubMonthKey, subIndex) => {
                const monthData = row.Months[SubMonthKey] || {
                  budget: 0,
                  usage: 0,
                  balance: 0,
                };
                const percentage = monthData.Budget > 0
                  ? (monthData.Balance / monthData.Budget) * 100
                  : 0;

                return (
                  <React.Fragment key={subIndex}>
                    <td className="text-[0.75rem] border p-2 text-center">
                      {formatNegativeNumber(monthData.Budget)}
                    </td>
                    <td className="text-[0.75rem] border p-2 text-center">
                      {formatNegativeNumber(monthData.Usage)}
                    </td>
                    <td
                      className={`text-[0.75rem] border p-2 text-center ${
                        monthData.Balance < 0
                          ? "bg-red-700 text-white border-black"
                          : "bg-white"
                      }`}
                    >
                      {formatNegativeNumber(monthData.Balance)}
                    </td>
                    <td
                      className={`text-[0.75rem] border p-2 text-center ${
                        percentage < 0
                          ? "bg-red-700 text-white border-black"
                          : "bg-white"
                      }`}
                    >
                      {formatNegativeNumber(percentage, "%")}
                    </td>
                  </React.Fragment>
                );
              })}
              <td className="text-[0.75rem] border p-2 text-center">
                {formatNegativeNumber(row.TotalBudget)}
              </td>
              <td className="text-[0.75rem] border p-2 text-center">
                {formatNegativeNumber(totalUsage)}
              </td>
              <td
                className={`text-[0.75rem] border p-2 text-center ${
                  row.TotalBalance < 0
                    ? "bg-red-700 text-white border-black"
                    : "bg-white"
                }`}
              >
                {formatNegativeNumber(row.TotalBalance)}
              </td>
              <td
                className={`text-[0.75rem] border p-2 text-center ${
                  percentage < 0
                    ? "bg-red-700 text-white border-black"
                    : "bg-white"
                }`}
              >
                {formatNegativeNumber(percentage, "%")}
              </td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          <td
            colSpan={3}
            className="text-[0.75rem] border p-2 whitespace-nowrap text-center"
          >
            Total
          </td>
          {SubMonthIndex.map((monthIndex, index) => {
            const currentMonthData = tableFooter.find(
              (tableFooterData) => tableFooterData.Month === monthIndex,
            );
            const currentMonthTotalBudget = currentMonthData?.TotalBudget || 0;
            const currentMonthTotalUsage = currentMonthData?.TotalUsage || 0;
            const currentMonthTotalBalance = currentMonthData?.TotalBalance ||
              0;
            const currentMonthTotalPercentage =
              (currentMonthTotalBalance / currentMonthTotalBudget) * 100;

            return (
              <React.Fragment key={index}>
                <td className="text-[0.75rem] border p-2 whitespace-nowrap text-center">
                  {formatNegativeNumber(currentMonthTotalBudget)}
                </td>
                <td className="text-[0.75rem] border p-2 whitespace-nowrap text-center">
                  {formatNegativeNumber(currentMonthTotalUsage)}
                </td>
                <td
                  className={`text-[0.75rem] border p-2 whitespace-nowrap text-center ${
                    currentMonthTotalBalance < 0
                      ? "bg-red-700 text-white border-black"
                      : "bg-white"
                  }`}
                >
                  {formatNegativeNumber(currentMonthTotalBalance)}
                </td>
                <td
                  className={`text-[0.75rem] border p-2 whitespace-nowrap text-center ${
                    currentMonthTotalPercentage < 0
                      ? "bg-red-700 text-white border-black"
                      : "bg-white"
                  }`}
                >
                  {formatNegativeNumber(currentMonthTotalPercentage, "%")}
                </td>
              </React.Fragment>
            );
          })}
          {MonthSubColumn.map((subColumn, index) => {
            const currentTotal = Number(
              grandTotal[
                `total${capitalize(subColumn)}` as keyof NatureReportFooter
              ],
            );
            const percentage =
              (grandTotal.TotalBalance / grandTotal.TotalBudget) * 100;
            return subColumn === "%"
              ? (
                <td
                  key={index}
                  className={`text-[0.75rem] border p-2 whitespace-nowrap text-center ${
                    percentage < 0
                      ? "bg-red-700 text-white border-black"
                      : "bg-white"
                  }`}
                >
                  {formatNegativeNumber(percentage, "%")}
                </td>
              )
              : (
                <td
                  key={index}
                  className={`text-[0.75rem] border p-2 whitespace-nowrap text-center ${
                    currentTotal < 0
                      ? "bg-red-700 text-white border-black"
                      : "bg-white"
                  }`}
                >
                  {formatNegativeNumber(currentTotal)}
                </td>
              );
          })}
        </tr>
      </tfoot>
    </table>
  );
};

export default NatureReport;
