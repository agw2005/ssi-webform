import { Link, useSearchParams } from "react-router-dom";
import sharp_logo from "../assets/svg/sharp_logo.svg";
import serverDomain from "../helper/serverDomain.ts";
import { useEffect, useMemo, useState } from "react";
import LoadingFallback from "../components/reusable/LoadingFallback.tsx";
import GeneralReport from "../components/non-reusable/report/GeneralReport.tsx";
import extractMonthFromFullPeriode from "../helper/extractMonthFromFullPeriode.ts";
import extractYearFromFullPeriode from "../helper/extractYearFromFullPeriode.ts";
import Titles from "../components/non-reusable/report/Titles.tsx";
import Description from "../components/non-reusable/report/Description.tsx";
import getPeriodHalves from "../helper/getPeriodHalves.ts";
import Button from "../components/reusable/Button.tsx";
import QuarterlyReport from "../components/non-reusable/report/QuarterlyReport.tsx";
import SectionReport from "client/src/components/non-reusable/report/SectionReport.tsx";

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

interface MonthlyData {
  budget: number;
  balance: number;
  usage: number;
}

export interface Row {
  Department: number;
  CostCenter: string;
  Nature: string;
  DepartmentGroup: number;
  Description: string;
  months: Record<string, MonthlyData>;
  totalBudget: number;
  totalBalance: number;
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

  const render = {
    title: (typeOfReport: string) => {
      switch (typeOfReport) {
        case "general":
          return Titles.general(reportPeriod);
        case "byquarter":
          return Titles.byQuarter(
            reportData && reportData.length !== 0
              ? reportData[0].ResourceName.toUpperCase()
              : "...",
            reportMonth,
          );
        case "bysection":
          return Titles.bySection(reportPeriod);
        case "bynature":
          return Titles.byNature(reportPeriod);
        default:
          return "";
      }
    },
    description: (typeOfReport: string) => {
      switch (typeOfReport) {
        case "general":
          return Description.general(reportFileResource);
        case "byquarter":
          return Description.byQuarter(reportFileResource, reportMonth);
        case "bysection":
          return Description.empty();
        case "bynature":
          return Description.empty();
        case "empty":
          return Description.empty();
        default:
          return "";
      }
    },
    table: (typeOfReport: string) => {
      switch (typeOfReport) {
        case "general":
          return (
            <GeneralReport
              subMonthIndex={comparePeriodHalves(
                FH_MONTHS_INDEX,
                LH_MONTHS_INDEX,
              )}
              subMonth={comparePeriodHalves(FH_MONTHS, LH_MONTHS)}
              monthSubColumn={MONTH_SUBCOLS}
              reportData={reportData || []}
              rowData={byCostCenterAndNatureRows}
            />
          );
        case "byquarter":
          return (
            <QuarterlyReport
              months={MONTHS}
              monthSubColumn={[...MONTH_SUBCOLS, "%"]}
              reportData={reportData || []}
              month={reportMonth}
              rowData={byCostCenterAndNatureRows}
            />
          );
        case "bysection":
          return (
            <SectionReport
              subMonthIndex={comparePeriodHalves(
                FH_MONTHS_INDEX,
                LH_MONTHS_INDEX,
              )}
              subMonth={comparePeriodHalves(FH_MONTHS, LH_MONTHS)}
              monthSubColumn={[...MONTH_SUBCOLS, "%"]}
              reportData={reportData || []}
              rowData={byDeptAndNatureRows}
              period={reportPeriod}
            />
          );
        case "bynature":
          return (
            <GeneralReport
              subMonthIndex={comparePeriodHalves(
                FH_MONTHS_INDEX,
                LH_MONTHS_INDEX,
              )}
              subMonth={comparePeriodHalves(FH_MONTHS, LH_MONTHS)}
              monthSubColumn={[...MONTH_SUBCOLS, "%"]}
              reportData={reportData || []}
              rowData={byDeptAndNatureRows}
            />
          );
        default:
          return "";
      }
    },
  };

  const dataExist = reportData !== null && reportData.length !== 0;

  const comparePeriodHalves = <T, U>(fhValue: T[], lhValue: U[]) => {
    return getPeriodHalves(reportPeriod) === "FH" ? fhValue : lhValue;
  };

  const applyParams = (url: URL) => {
    if (reportType === "byquarter") {
      url.searchParams.set(
        "periode",
        `${extractYearFromFullPeriode(reportMonth)}${FH_MONTHS.includes(MONTHS[Number(extractMonthFromFullPeriode(reportMonth)) - 1]) ? "FH" : "LH"}`,
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

  const byCostCenterAndNatureRows = useMemo(() => {
    const map = new Map<string, Row>();

    reportData?.forEach((data) => {
      const key = `${data.CostCenter}-${data.Nature}`;
      let row = map.get(key);
      if (!row) {
        row = {
          Department: data.Department,
          CostCenter: data.CostCenter,
          Nature: data.Nature,
          DepartmentGroup: data.DepartmentGroup,
          Description: data.Description,
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

    //this will sort the array by Department, Description, and Nature! DO NOT CHANGE!!!
    return Array.from(map.values()).sort((rowA, rowB) => {
      if (rowA.Department !== rowB.Department) {
        return rowA.Department - rowB.Department;
      }
      const descriptionSorting = rowA.Description.localeCompare(
        rowB.Description,
      );
      if (descriptionSorting !== 0) {
        return descriptionSorting;
      }
      return rowA.Nature.localeCompare(rowB.Nature);
    });
  }, [reportData]);

  const byDeptAndNatureRows = useMemo(() => {
    const map = new Map<string, Row>();

    reportData?.forEach((data) => {
      const key = `${data.Department}-${data.Nature}`;
      let row = map.get(key);

      if (!row) {
        row = {
          Department: data.Department,
          CostCenter: data.CostCenter,
          Nature: data.Nature,
          DepartmentGroup: data.DepartmentGroup,
          Description: data.Description,
          months: {},
          totalBudget: 0,
          totalBalance: 0,
        };
        map.set(key, row);
      }

      const monthKey = data.Periode.substring(6, 8);
      const budget = Number(data.Budget || 0);
      const balance = Number(data.Balance || 0);
      const usage = budget - balance;

      if (!row.months[monthKey]) {
        row.months[monthKey] = { budget: 0, balance: 0, usage: 0 };
      }

      row.months[monthKey].budget += budget;
      row.months[monthKey].balance += balance;
      row.months[monthKey].usage += usage;

      row.totalBudget += budget;
      row.totalBalance += balance;
    });

    return Array.from(map.values()).sort((rowA, rowB) => {
      if (rowA.Department !== rowB.Department) {
        return rowA.Department - rowB.Department;
      }
      const descriptionSorting = rowA.Description.localeCompare(
        rowB.Description,
      );
      if (descriptionSorting !== 0) {
        return descriptionSorting;
      }
      return rowA.Nature.localeCompare(rowB.Nature);
    });
  }, [reportData]);

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

  return !dataExist ? (
    <div className="m-8 flex flex-col items-center gap-4">
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
  ) : (
    <>
      <div className="border bg-black flex p-1">
        <div className="bg-white hover:bg-white/85 active:bg-white/70 | flex border p-1 select-none">
          Download PDF
        </div>
      </div>
      <div className="border font-sans flex flex-col gap-4 p-4 overflow-x-auto">
        <div className="flex flex-col items-center">
          {!dataExist ? "" : render.title(reportType)}
        </div>

        <div className="flex flex-col items-start">
          {!dataExist ? (
            ""
          ) : (
            <>
              <img src={sharp_logo} alt="Sharp Logo" className="h-4" />
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
