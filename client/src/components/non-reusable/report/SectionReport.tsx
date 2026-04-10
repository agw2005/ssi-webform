import React from "react";
import type { Row } from "../../../pages/Report.tsx";
import formatNegativeNumber from "../../../helper/formatNegativeNumber.ts";
import type { ReportResponse } from "@scope/server-mysql";

interface SectionReportProps {
  SubMonthIndex: string[];
  SubMonth: string[];
  MonthSubColumn: string[];
  ReportData: ReportResponse[];
  RowData: Row[];
  Period: string;
}

const SectionReport = ({
  SubMonthIndex,
  SubMonth,
  MonthSubColumn,
  ReportData,
  RowData,
  Period,
}: SectionReportProps) => {
  console.log(RowData);
  if (ReportData.length === 0) {
    return <div></div>;
  }

  return (
    <table
      id="report"
      className="table-auto border border-collapse w-full text-[0.6rem]"
    >
      <thead className="border">
        <tr>
          <th rowSpan={2} className="border p-1">
            DEPT
          </th>
          <th rowSpan={2} className="border p-1">
            SECTION
          </th>
          <th rowSpan={2} className="border p-1">
            NATURE
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

          return (
            <tr key={index}>
              <td className="text-[0.75rem] border p-2 whitespace-nowrap text-center">
                {row.Department}
              </td>
              <td className="text-[0.75rem] border p-2 whitespace-nowrap text-center">
                {row.Description}
              </td>
              <td className="text-[0.75rem] border p-2 whitespace-nowrap text-center">
                {row.Nature}
              </td>
              {SubMonthIndex.map((subMonthKey, subIndex) => {
                const monthData = row.Months[subMonthKey] || {
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
    </table>
  );
};

export default SectionReport;
