import React from "react";
import type { ReportResponse, Row } from "../../../pages/Report.tsx";
import formatNegativeNumber from "../../../helper/formatNegativeNumber.ts";
import capitalize from "../../../helper/capitalize.ts";

interface NatureReportProps {
  subMonthIndex: string[];
  subMonth: string[];
  monthSubColumn: string[];
  reportData: ReportResponse[];
  rowData: Row[];
  period: string;
}

interface NatureReportFooter {
  month: string;
  totalBudget: number;
  totalUsage: number;
  totalBalance: number;
}

const NatureReport = ({
  subMonthIndex,
  subMonth,
  monthSubColumn,
  reportData,
  rowData,
  period,
}: NatureReportProps) => {
  console.log(rowData);
  if (reportData.length === 0) {
    return <div></div>;
  }

  const categoryCounts = rowData.reduce(
    (acc, row) => {
      const category = row.Description.includes("(ADM)")
        ? "Administration"
        : "Production";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const tableFooter: NatureReportFooter[] = subMonthIndex.map((monthIndex) => {
    const totals = rowData.reduce(
      (acc, row) => {
        const monthData = row.months?.[monthIndex];

        if (monthData) {
          acc.totalBudget += monthData.budget || 0;
          acc.totalUsage += monthData.usage || 0;
          acc.totalBalance += monthData.balance || 0;
        }

        return acc;
      },
      {
        totalBudget: 0,
        totalUsage: 0,
        totalBalance: 0,
      },
    );

    return {
      month: monthIndex,
      ...totals,
    };
  });

  const grandTotal: NatureReportFooter = tableFooter.reduce(
    (current, next) => {
      current.totalBudget += next.totalBudget;
      current.totalUsage += next.totalUsage;
      current.totalBalance += next.totalBalance;
      return current;
    },
    {
      month: "AGGREGATED",
      totalBudget: 0,
      totalUsage: 0,
      totalBalance: 0,
    },
  );

  return (
    <table className="table-auto border border-collapse w-full text-[0.6rem]">
      <thead className="border">
        <tr>
          <th rowSpan={2} className="border p-1"></th>
          <th rowSpan={2} className="border p-1">
            NATURE
          </th>
          <th rowSpan={2} className="border p-1">
            DESCRIPTION
          </th>
          {subMonth.map((month, index) => (
            <th key={index} colSpan={4} className="border p-1">
              {month}
            </th>
          ))}
          <th colSpan={4} className="border p-1">
            {period}
          </th>
        </tr>
        <tr>
          {[...Array(7)].map((_, index) => {
            return monthSubColumn.map((subcolumn, subindex) => {
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
        {rowData.map((row, index) => {
          const totalUsage = row.totalBudget - row.totalBalance;
          const percentage =
            row.totalBudget > 0
              ? (row.totalBalance / row.totalBudget) * 100
              : 0;

          const currentCategory = row.Description.includes("(ADM)")
            ? "Administration"
            : "Production";

          const previousCategory =
            index > 0
              ? rowData[index - 1].Description.includes("(ADM)")
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
              {subMonthIndex.map((subMonthKey, subIndex) => {
                const monthData = row.months[subMonthKey] || {
                  budget: 0,
                  usage: 0,
                  balance: 0,
                };
                const percentage =
                  monthData.budget > 0
                    ? (monthData.balance / monthData.budget) * 100
                    : 0;

                return (
                  <React.Fragment key={subIndex}>
                    <td className="text-[0.75rem] border p-2 text-center">
                      {formatNegativeNumber(monthData.budget)}
                    </td>
                    <td className="text-[0.75rem] border p-2 text-center">
                      {formatNegativeNumber(monthData.usage)}
                    </td>
                    <td
                      className={`text-[0.75rem] border p-2 text-center ${monthData.balance < 0 ? "bg-red-700 text-white border-black" : "bg-white"}`}
                    >
                      {formatNegativeNumber(monthData.balance)}
                    </td>
                    <td
                      className={`text-[0.75rem] border p-2 text-center ${percentage < 0 ? "bg-red-700 text-white border-black" : "bg-white"}`}
                    >
                      {formatNegativeNumber(percentage, "%")}
                    </td>
                  </React.Fragment>
                );
              })}
              <td className="text-[0.75rem] border p-2 text-center">
                {formatNegativeNumber(row.totalBudget)}
              </td>
              <td className="text-[0.75rem] border p-2 text-center">
                {formatNegativeNumber(totalUsage)}
              </td>
              <td
                className={`text-[0.75rem] border p-2 text-center ${row.totalBalance < 0 ? "bg-red-700 text-white border-black" : "bg-white"}`}
              >
                {formatNegativeNumber(row.totalBalance)}
              </td>
              <td
                className={`text-[0.75rem] border p-2 text-center ${percentage < 0 ? "bg-red-700 text-white border-black" : "bg-white"}`}
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
          {subMonthIndex.map((monthIndex, index) => {
            const currentMonthData = tableFooter.find(
              (tableFooterData) => tableFooterData.month === monthIndex,
            );
            const currentMonthTotalBudget = currentMonthData?.totalBudget || 0;
            const currentMonthTotalUsage = currentMonthData?.totalUsage || 0;
            const currentMonthTotalBalance =
              currentMonthData?.totalBalance || 0;
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
                  className={`text-[0.75rem] border p-2 whitespace-nowrap text-center ${currentMonthTotalBalance < 0 ? "bg-red-700 text-white border-black" : "bg-white"}`}
                >
                  {formatNegativeNumber(currentMonthTotalBalance)}
                </td>
                <td
                  className={`text-[0.75rem] border p-2 whitespace-nowrap text-center ${currentMonthTotalPercentage < 0 ? "bg-red-700 text-white border-black" : "bg-white"}`}
                >
                  {formatNegativeNumber(currentMonthTotalPercentage, "%")}
                </td>
              </React.Fragment>
            );
          })}
          {monthSubColumn.map((subColumn, index) => {
            const currentTotal = Number(
              grandTotal[
                `total${capitalize(subColumn)}` as keyof NatureReportFooter
              ],
            );
            const percentage =
              (grandTotal.totalBalance / grandTotal.totalBudget) * 100;
            return subColumn === "%" ? (
              <td
                key={index}
                className={`text-[0.75rem] border p-2 whitespace-nowrap text-center ${percentage < 0 ? "bg-red-700 text-white border-black" : "bg-white"}`}
              >
                {formatNegativeNumber(percentage, "%")}
              </td>
            ) : (
              <td
                key={index}
                className={`text-[0.75rem] border p-2 whitespace-nowrap text-center ${currentTotal < 0 ? "bg-red-700 text-white border-black" : "bg-white"}`}
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
