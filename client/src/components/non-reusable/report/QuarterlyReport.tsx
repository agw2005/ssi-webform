import type { Row } from "../../../pages/Report.tsx";
import capitalize from "../../../helper/capitalize.ts";
import getStartingMonthPeriodOfMonthReport from "../../../helper/getStartingMonthPeriodOfMonthReport.ts";
import getCurrentPeriod from "../../../helper/getCurrentPeriod.ts";
import extractMonthFromFullPeriode from "../../../helper/extractMonthFromFullPeriode.ts";
import extractYearFromFullPeriode from "../../../helper/extractYearFromFullPeriode.ts";
import formatNumberToString from "../../../helper/formatNumberToString.ts";
import formatNegativeNumber from "../../../helper/formatNegativeNumber.ts";
import React from "react";
import type { ReportResponse } from "@scope/server-mysql";

interface QuarterlyReportProps {
  Months: string[];
  MonthSubColumn: string[];
  ReportData: ReportResponse[];
  Month: string;
  RowData: Row[];
}

const QuarterlyReport = ({
  Months,
  MonthSubColumn,
  ReportData,
  Month,
  RowData,
}: QuarterlyReportProps) => {
  const [_startingMonthIndex, startingMonthString] =
    getStartingMonthPeriodOfMonthReport(Month);

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
            SEC
            <br />
            REQ
          </th>
          <th rowSpan={2} className="border p-1">
            NATURE
          </th>
          <th colSpan={4} className="border-x p-1">
            {capitalize(Months[Number(Month.substring(5)) - 1])}
          </th>
          <th colSpan={4} className="border-x p-1">
            {`${capitalize(startingMonthString)}-${
              capitalize(Months[Number(Month.substring(5)) - 1])
            }`}
          </th>
          <th colSpan={4} className="border-x p-1">
            {getCurrentPeriod(
              Number(extractYearFromFullPeriode(Month)),
              Number(extractMonthFromFullPeriode(Month)),
            ).substring(0, 5)}
          </th>
        </tr>
        <tr>
          {[...Array(3)].map((_, index) => {
            return MonthSubColumn.map((subcolumn, subindex) => {
              return (
                <th
                  key={`${index}-${subindex}`}
                  className={`border-x border-b ${
                    subindex === 3 ? "border-t-0" : "border-t"
                  } p-1`}
                >
                  {subcolumn}
                </th>
              );
            });
          })}
        </tr>
      </thead>
      <tbody>
        {RowData.map((row, index) => {
          const monthBudget = row.Months[Month.substring(5)].Budget;
          const monthUsage = row.Months[Month.substring(5)].Usage;
          const monthBalance = row.Months[Month.substring(5)].Balance;
          const usagePercentage = (monthBalance / monthBudget) * 100;

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
              {[...Array(3)].map((_, index) => {
                return (
                  <React.Fragment key={index}>
                    <td className="text-[0.75rem] border-x p-2 text-center">
                      {formatNumberToString(monthBudget)}
                    </td>
                    <td className="text-[0.75rem] border-x p-2 text-center">
                      {formatNumberToString(monthUsage)}
                    </td>
                    <td
                      className={`text-[0.75rem] border-x p-2 text-center ${
                        monthBalance < 0
                          ? "bg-red-700 text-white border-black"
                          : "bg-white"
                      }`}
                    >
                      {formatNegativeNumber(monthBalance)}
                    </td>
                    <td
                      className={`text-[0.75rem] border-x p-2 text-center ${
                        usagePercentage < 0
                          ? "bg-red-700 text-white border-black"
                          : "bg-white"
                      }`}
                    >
                      {formatNegativeNumber(monthBalance, "%")}
                    </td>
                  </React.Fragment>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default QuarterlyReport;
