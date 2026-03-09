import { useSearchParams } from "react-router-dom";
import sharp_logo from "../assets/svg/sharp_logo.svg";
import capitalize from "../helper/capitalize.ts";
import getCurrentPeriod from "../helper/getCurrentPeriod.ts";

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
const FH_MONTHS = ["APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER"];
const LH_MONTHS = [
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
  "JANUARY",
  "FEBRUARY",
  "MARCH",
];
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

  return (
    <>
      <div className="border bg-black flex p-1">
        <div className="bg-white hover:bg-white/85 active:bg-white/70 | flex border p-1 select-none">
          Download PDF
        </div>
      </div>
      <div className="border font-sans flex flex-col gap-4 p-4">
        <div className="flex flex-col items-center">
          {reportType === "general"
            ? TITLES.general(reportPeriod)
            : reportType === "byquarter"
              ? TITLES.byQuarter("[desc]", reportMonth)
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

        <table className="table-auto border-collapse w-full text-xs">
          <thead className="sticky top-0 z-10 border">
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
              {(getCurrentPeriod(
                Number(extractYear(reportMonth)),
                Number(extractMonth(reportMonth)),
              ).substring(4, 6) === "FH"
                ? FH_MONTHS
                : LH_MONTHS
              ).map((month, index) => {
                return (
                  <th key={index} colSpan={3} className="border p-1">
                    {month}
                  </th>
                );
              })}
              <th colSpan={3} className="border p-1">
                TOTAL
              </th>
            </tr>
            <tr>
              {[...Array(6)].map((_, index) => {
                return MONTH_SUBCOLS.map((subcolumn, subindex) => {
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
            <tr>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Report;
