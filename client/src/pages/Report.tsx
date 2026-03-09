import { useSearchParams } from "react-router-dom";
import sharp_logo from "../assets/svg/sharp_logo.svg";
import capitalize from "../helper/capitalize.ts";
import getCurrentPeriod from "../helper/getCurrentPeriod.ts";
import serverDomain from "../helper/serverDomain.ts";
import { useEffect, useState } from "react";
import LoadingFallback from "../components/reusable/LoadingFallback.tsx";
import GeneralReport from "../components/non-reusable/report/GeneralReport.tsx";

export interface ReportResponse {
  Periode: string;
  FileResource: string;
  ResourceName: string;
  Department: number;
  DepartmentGroup: number;
  CostCenter: string;
  Nature: string;
  Description: string;
  Budget: string;
  Balance: string;
}

const REPORT_URL = `${serverDomain}/budget/report`;

const COMPANY_NAME = "PT SHARP SEMICONDUCTOR INDONESIA";
const MONTHS = [
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
const FH_MONTHS = MONTHS.slice(3, 9);
const FH_MONTHS_INDEX = MONTHS_INDEX.slice(3, 9);
const LH_MONTHS = [...MONTHS.slice(9), ...MONTHS.slice(0, 3)];
const LH_MONTHS_INDEX = [...MONTHS_INDEX.slice(9), ...MONTHS_INDEX.slice(0, 3)];
const MONTH_SUBCOLS = ["BUD", "USA", "BAL"];
const extractMonth = (month: string) => month.substring(5, 7);
const extractYear = (month: string) => month.substring(0, 4);

const TITLES = {
  general: (periode: string) => (
    <>
      <h1 className="text-xl font-bold">
        BUDGET USAGE SUPPLIES, FIX AND REPAIR
      </h1>
      <h2 className="text-xl font-bold">{periode}</h2>
    </>
  ),
  byQuarter: (desc: string, month: string) => (
    <>
      <h1 className="text-xl font-bold">{`REPORT BUDGET ${desc}`}</h1>
      <h2 className="text-xl font-bold">
        {getCurrentPeriod(
          Number(extractYear(month)),
          Number(extractMonth(month)),
        ).substring(0, 5)}
      </h2>
    </>
  ),
  bySection: (periode: string) => (
    <>
      <h1 className="text-xl font-bold">EXPENSES BUDGET REPORT</h1>
      <h2 className="text-xl font-bold">{periode}</h2>
    </>
  ),
  byNature: (periode: string) => (
    <>
      <h1 className="text-xl font-bold">EXPENSES BUDGET REPORT</h1>
      <h2 className="text-xl font-bold">{periode}</h2>
    </>
  ),
};

const SUBHEADERS = {
  general: (fileResource: string) => (
    <>
      <h3 className="text-sm font-medium">
        File Resource : {fileResource === "Show All" ? "%" : fileResource}
      </h3>
    </>
  ),
  byQuarter: (fileResource: string, month: string) => (
    <>
      <h3 className="text-sm font-medium">File Resource : {fileResource}</h3>
      <h3 className="text-sm font-medium">
        Month : {capitalize(MONTHS[Number(extractMonth(month)) - 1])}
      </h3>
    </>
  ),
  bySection: <div></div>,
  byNature: <div></div>,
};

const Report = () => {
  const [searchParams] = useSearchParams();
  const reportType = searchParams.get("type") || "";
  const reportFileResource = searchParams.get("fileresource") || "";
  const reportPeriod = searchParams.get("period") || "";
  const reportMonth = searchParams.get("month") || "";

  const [reportData, setReportData] = useState<ReportResponse[] | null>(null);
  const [isReportDataLoading, setIsReportDataLoading] = useState(false);
  const [isReportDataError, setIsReportDataError] = useState<Error | null>(
    null,
  );

  const applyParams = (url: URL) => {
    if (reportType === "byquarter") {
      url.searchParams.set(
        "periode",
        `${extractYear(reportMonth)}${FH_MONTHS.includes(MONTHS[Number(extractMonth(reportMonth)) - 1]) ? "FH" : "LH"}`,
      );
    } else {
      url.searchParams.set("periode", reportPeriod);
    }
    if (reportFileResource !== "Show All" && reportFileResource !== "") {
      url.searchParams.set("fileresource", reportFileResource);
    }
  };

  useEffect(() => {
    const requestUrl = new URL(REPORT_URL);
    const abortController = new AbortController();
    setIsReportDataLoading(true);
    applyParams(requestUrl);

    const fetchData = async () => {
      try {
        const reportResponse = await fetch(requestUrl.toString(), {
          signal: abortController.signal,
        });
        if (!reportResponse.ok)
          throw new Error(`HTTP error! status: ${reportResponse.status}`);

        const reportResponseJson: ReportResponse[] =
          await reportResponse.json();

        setReportData(reportResponseJson);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        const error: Error = new Error(
          `Encountered an error when fetching API. Please ensure your connection is stable.\n(${err}).`,
        );
        setIsReportDataError(error);
      } finally {
        setIsReportDataLoading(false);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [reportFileResource, reportPeriod]);

  if (isReportDataLoading) {
    return <LoadingFallback />;
  }

  if (isReportDataError) {
    return (
      <div className="m-4">
        <div>Something unexpected happened.</div>
        {isReportDataError ? isReportDataError.message : ""}
      </div>
    );
  }

  return (
    <>
      <div className="border bg-black flex p-1">
        <div className="bg-white hover:bg-white/85 active:bg-white/70 | flex border p-1 select-none">
          Download PDF
        </div>
      </div>
      <div className="border font-sans flex flex-col gap-4 p-4 overflow-x-auto">
        <div className="flex flex-col items-center">
          {reportType === "general"
            ? TITLES.general(reportPeriod)
            : reportType === "byquarter"
              ? TITLES.byQuarter(
                  reportData && reportData.length !== 0
                    ? reportData[0].ResourceName.toUpperCase()
                    : "...",
                  reportMonth,
                )
              : reportType === "bysection"
                ? TITLES.bySection(reportPeriod)
                : reportType === "bynature"
                  ? TITLES.byNature(reportPeriod)
                  : ""}
        </div>

        <div className="flex flex-col items-start">
          <img src={sharp_logo} alt="Sharp Logo" className="h-4" />
          <h3 className="text-sm font-medium">{COMPANY_NAME}</h3>
          {reportType === "general"
            ? SUBHEADERS.general(reportFileResource)
            : reportType === "byquarter"
              ? SUBHEADERS.byQuarter(reportFileResource, reportMonth)
              : reportType === "bysection"
                ? SUBHEADERS.bySection
                : reportType === "bynature"
                  ? SUBHEADERS.byNature
                  : ""}
        </div>

        <GeneralReport
          subMonthIndex={
            reportPeriod.substring(4, 6) === "FH"
              ? FH_MONTHS_INDEX
              : LH_MONTHS_INDEX
          }
          subMonth={
            reportPeriod.substring(4, 6) === "FH" ? FH_MONTHS : LH_MONTHS
          }
          monthSubColumn={MONTH_SUBCOLS}
          reportData={reportData || []}
        />
      </div>
    </>
  );
};

export default Report;
