import React from "react";
import type { ReportResponse, Row } from "../../../pages/Report.tsx";
import formatNegativeNumber from "../../../helper/formatNegativeNumber.ts";

interface GeneralReportProps {
  subMonthIndex: string[];
  subMonth: string[];
  monthSubColumn: string[];
  reportData: ReportResponse[];
  rowData: Row[];
}

const GeneralReport = ({
  subMonthIndex,
  subMonth,
  monthSubColumn,
  reportData,
  rowData,
}: GeneralReportProps) => {
  if (reportData.length === 0) {
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
            SEC
            <br />
            REQ
          </th>
          <th rowSpan={2} className="border p-1">
            NATURE
          </th>
          {subMonth.map((month, index) => (
            <th key={index} colSpan={3} className="border p-1">
              {month}
            </th>
          ))}
          <th colSpan={3} className="border p-1">
            TOTAL
          </th>
        </tr>
        <tr>
          {[...Array(6)].map((_, index) => {
            return monthSubColumn.map((subcolumn, subindex) => {
              return (
                <th key={`${index}-${subindex}`} className="border p-1">
                  {subcolumn}
                </th>
              );
            });
          })}
          <th className="border p-1">USA</th>
          <th className="border p-1">BAL</th>
          <th className="border p-1">%</th>
        </tr>
      </thead>
      <tbody>
        {rowData.map((row, index) => {
          const totalUsage = row.totalBudget - row.totalBalance;
          const percentage = row.totalBudget > 0
            ? (row.totalBalance / row.totalBudget) * 100
            : 0;

          return (
            <tr key={index}>
              <td className="text-[0.75rem] border-x p-2 whitespace-nowrap text-center">
                {row.Department}
              </td>
              <td className="text-[0.75rem] border-x p-2 whitespace-nowrap text-center">
                {row.CostCenter}
              </td>
              <td className="text-[0.75rem] border-x p-2 whitespace-nowrap text-center">
                {row.Nature}
              </td>
              {subMonthIndex.map((subMonthKey, subIndex) => {
                const monthData = row.months[subMonthKey] || {
                  budget: 0,
                  usage: 0,
                  balance: 0,
                };

                return (
                  <React.Fragment key={subIndex}>
                    <td className="text-[0.75rem] border-x p-2 text-center">
                      {formatNegativeNumber(monthData.budget)}
                    </td>
                    <td className="text-[0.75rem] border-x p-2 text-center">
                      {formatNegativeNumber(monthData.usage)}
                    </td>
                    <td
                      className={`text-[0.75rem] border-x p-2 text-center ${
                        monthData.balance < 0
                          ? "bg-red-700 text-white border-black"
                          : "bg-white"
                      }`}
                    >
                      {formatNegativeNumber(monthData.balance)}
                    </td>
                  </React.Fragment>
                );
              })}
              <td className="text-[0.75rem] border-x p-2 text-center">
                {formatNegativeNumber(totalUsage)}
              </td>
              <td
                className={`text-[0.75rem] border-x p-2 text-center ${
                  row.totalBalance < 0
                    ? "bg-red-700 text-white border-black"
                    : "bg-white"
                }`}
              >
                {formatNegativeNumber(row.totalBalance)}
              </td>
              <td
                className={`text-[0.75rem] border-x p-2 text-center ${
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

export default GeneralReport;
