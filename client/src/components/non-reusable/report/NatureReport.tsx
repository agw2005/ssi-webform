import React from "react";
import type { ReportResponse, Row } from "../../../pages/Report.tsx";
import formatNegativeNumber from "../../../helper/formatNegativeNumber.ts";

interface NatureReportProps {
  subMonthIndex: string[];
  subMonth: string[];
  monthSubColumn: string[];
  reportData: ReportResponse[];
  rowData: Row[];
  period: string;
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

  return (
    <table className="table-auto border border-collapse w-full text-[0.6rem]">
      <thead className="border">
        <tr>
          <th rowSpan={2} className="border p-1"></th>
          <th rowSpan={2} className="border p-1">
            SECTION
          </th>
          <th rowSpan={2} className="border p-1">
            NATURE
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
                {row.Description}
              </td>
              <td className="text-[0.75rem] border p-2 whitespace-nowrap text-center">
                {row.Nature}
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
                    <td className="text-[0.75rem] border p-2 text-center">
                      {formatNegativeNumber(monthData.balance)}
                    </td>
                    <td className="text-[0.75rem] border p-2 text-center">
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
              <td className="text-[0.75rem] border p-2 text-center">
                {formatNegativeNumber(row.totalBalance)}
              </td>
              <td className="text-[0.75rem] border p-2 text-center">
                {formatNegativeNumber(percentage, "%")}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default NatureReport;
