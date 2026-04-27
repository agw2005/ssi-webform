import { Link, useSearchParams } from "react-router-dom";
import company_logo from "../assets/svg/company_logo.svg";
import LoadingFallback from "../components/reusable/LoadingFallback.tsx";
import extractMonthFromFullPeriode from "../helper/extractMonthFromFullPeriode.ts";
import extractYearFromFullPeriode from "../helper/extractYearFromFullPeriode.ts";
import Button from "../components/reusable/Button.tsx";
import useReport from "../hooks/useReport.tsx";
import type { ReportResponse } from "@scope/server";
import useRender from "../hooks/useRender.tsx";

interface MonthlyData extends Pick<ReportResponse, "Budget" | "Balance"> {
  Usage: number;
}

export interface Row extends
  Pick<
    ReportResponse,
    "Department" | "CostCenter" | "Nature" | "DepartmentGroup" | "Description"
  > {
  Months: Record<string, MonthlyData>;
  TotalBudget: number;
  TotalBalance: number;
}

interface TypeTitle {
  general: string;
  byquarter: string;
  bysection: string;
  bynature: string;
}

export const COMPANY_NAME = "PT Foxconn Technologies Indonesia";
export const MONTHS = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];
const MONTHS_INDEX = [
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
export const FH_MONTHS = MONTHS.slice(3, 9);
export const FH_MONTHS_INDEX = MONTHS_INDEX.slice(3, 9);
export const LH_MONTHS = [...MONTHS.slice(9), ...MONTHS.slice(0, 3)];
export const LH_MONTHS_INDEX = [
  ...MONTHS_INDEX.slice(9),
  ...MONTHS_INDEX.slice(0, 3),
];
export const MONTH_SUBCOLS = ["BUDGET", "USAGE", "BALANCE"];

const REPORT_TYPE_TITLE: TypeTitle = {
  general: "General",
  byquarter: "Quarterly",
  bysection: "Section",
  bynature: "Nature",
};

const Report = () => {
  const [searchParams] = useSearchParams();
  const reportType = (searchParams.get("type") || "") as
    | "general"
    | "byquarter"
    | "bysection"
    | "bynature"
    | "empty"
    | "";
  const reportFileResource = searchParams.get("fileresource") || "";
  const reportPeriod = searchParams.get("period") || "";
  const reportMonth = searchParams.get("month") || "";

  const params = new URLSearchParams();
  const extractedPeriode = `${extractYearFromFullPeriode(reportMonth)}${
    FH_MONTHS.includes(
        MONTHS[Number(extractMonthFromFullPeriode(reportMonth)) - 1],
      )
      ? "FH"
      : "LH"
  }`;

  reportType === "byquarter"
    ? params.set("periode", extractedPeriode)
    : params.set("periode", reportPeriod);

  if (reportFileResource !== "Show All" && reportFileResource !== "") {
    params.set("fileresource", reportFileResource);
  }

  const { reportData, isReportDataLoading, isReportDataError } = useReport(
    reportType,
    params.toString(),
  );

  const dataExist = reportData !== null && reportData.length !== 0;

  const render = useRender(
    reportPeriod,
    reportMonth,
    reportFileResource,
    reportData,
  );

  if (isReportDataLoading) {
    return <LoadingFallback />;
  }

  if (isReportDataError) {
    return (
      <div className="m-4">
        <title>
          {`${REPORT_TYPE_TITLE[reportType as keyof TypeTitle]} Report`}
        </title>
        <div>Something unexpected happened.</div>
        {isReportDataError ? isReportDataError.message : ""}
      </div>
    );
  }

  return !dataExist
    ? (
      <div className="m-8 flex flex-col items-center gap-4">
        <title>
          {`${REPORT_TYPE_TITLE[reportType as keyof TypeTitle]} Report`}
        </title>
        <h1 className="text-3xl font-bold">NO DATA FOUND</h1>
        <h2 className="text-xl font-bold">
          No data exist for this combination of{" "}
          <span className="text-red-700">File Resource</span>,{" "}
          <span className="text-green-700">Month</span>, or{" "}
          <span className="text-blue-700">Period</span>
        </h2>
        <Link to="/budget">
          <Button id="go-back" variant="black" label="Go Back" />
        </Link>
      </div>
    )
    : (
      <>
        <title>
          {`${REPORT_TYPE_TITLE[reportType as keyof TypeTitle]} Report`}
        </title>
        <div className="border bg-black flex p-1">
          <div
            className="bg-white hover:bg-white/85 active:bg-white/70 | flex border p-1 select-none"
            onClick={render.pdf(reportType)}
          >
            Download PDF
          </div>
        </div>
        <div className="border font-sans flex flex-col gap-4 p-4 overflow-x-auto">
          <div className="flex flex-col items-center">
            {!dataExist ? "" : render.title(reportType)}
          </div>

          <div className="flex flex-col items-start">
            {!dataExist
              ? (
                ""
              )
              : (
                <>
                  <img src={company_logo} alt="Sharp Logo" className="h-11" />
                  <h3 className="text-sm font-medium">{COMPANY_NAME}</h3>
                  {render.description(reportType)}
                </>
              )}
          </div>

          {render.table(reportType)}
        </div>
      </>
    );
};

export default Report;
