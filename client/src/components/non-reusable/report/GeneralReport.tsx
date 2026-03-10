import React, { useMemo } from "react";
import type { ReportResponse } from "../../../pages/Report.tsx";
import formatNegativeNumber from "../../../helper/formatNegativeNumber.ts";
import formatNumberToString from "../../../helper/formatNumberToString.ts";

interface GeneralReportProps {
  subMonthIndex: string[];
  subMonth: string[];
  monthSubColumn: string[];
  reportData: ReportResponse[];
}

interface MonthlyData {
  budget: number;
  balance: number;
  usage: number;
}

interface Row {
  Department: number;
  CostCenter: string;
  Nature: string;
  months: Record<string, MonthlyData>;
  totalBudget: number;
  totalBalance: number;
}

const GeneralReport = ({
  subMonthIndex,
  subMonth,
  monthSubColumn,
  reportData,
}: GeneralReportProps) => {
  const groupedRows = useMemo(() => {
    const map = new Map<string, Row>();

    reportData.forEach((data) => {
      const key = `${data.CostCenter}-${data.Nature}`;
      let row = map.get(key);
      if (!row) {
        row = {
          Department: data.Department,
          CostCenter: data.CostCenter,
          Nature: data.Nature,
          months: {},
          totalBudget: 0,
          totalBalance: 0,
        };
        map.set(key, row);
      }

      const monthKey = data.Periode.substring(6, 8);
      const budget = Number(data.Budget || 0);
      const balance = Number(data.Balance || 0);

      row.months[monthKey] = {
        budget,
        balance,
        usage: budget - balance,
      };

      row.totalBudget += budget;
      row.totalBalance += balance;
    });

    return Array.from(map.values());
  }, [reportData]);

  if (reportData.length === 0) {
    return <div></div>;
  }

  return (
    <table className="table-auto border border-collapse w-full text-[0.6rem]">
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
        {groupedRows.map((row, index) => {
          const totalUsage = row.totalBudget - row.totalBalance;
          const percentage =
            row.totalBudget > 0
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
                    <td className="text-[0.75rem] border-x p-2 text-center">
                      {formatNegativeNumber(monthData.balance)}
                    </td>
                  </React.Fragment>
                );
              })}
              <td className="text-[0.75rem] border-x p-2 text-center">
                {formatNegativeNumber(totalUsage)}
              </td>
              <td className="text-[0.75rem] border-x p-2 text-center">
                {formatNegativeNumber(row.totalBalance)}
              </td>
              <td className="text-[0.75rem] border-x p-2 text-center">
                {formatNumberToString(percentage)}%
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default GeneralReport;
