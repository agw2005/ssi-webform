import { Link, useSearchParams } from "react-router-dom";
import sharp_logo from "../assets/svg/sharp_logo.svg";
import { useMemo } from "react";
import LoadingFallback from "../components/reusable/LoadingFallback.tsx";
import GeneralReport from "../components/non-reusable/report/GeneralReport.tsx";
import extractMonthFromFullPeriode from "../helper/extractMonthFromFullPeriode.ts";
import extractYearFromFullPeriode from "../helper/extractYearFromFullPeriode.ts";
import Titles from "../components/non-reusable/report/Titles.tsx";
import Description from "../components/non-reusable/report/Description.tsx";
import getPeriodHalves from "../helper/getPeriodHalves.ts";
import Button from "../components/reusable/Button.tsx";
import QuarterlyReport from "../components/non-reusable/report/QuarterlyReport.tsx";
import NatureReport from "../components/non-reusable/report/NatureReport.tsx";
import SectionReport from "../components/non-reusable/report/SectionReport.tsx";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import type { CellHookData } from "jspdf-autotable";
import getCurrentPeriod from "../helper/getCurrentPeriod.ts";
import capitalize from "../helper/capitalize.ts";
import useReport from "../hooks/useReport.tsx";
import type { ReportResponse } from "@scope/server";

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
const MONTH_SUBCOLS = ["BUDGET", "USAGE", "BALANCE"];

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

  const render = {
    title: (
      typeOfReport:
        | "general"
        | "byquarter"
        | "bysection"
        | "bynature"
        | "empty"
        | "",
    ) => {
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
    description: (
      typeOfReport:
        | "general"
        | "byquarter"
        | "bysection"
        | "bynature"
        | "empty"
        | "",
    ) => {
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
    table: (
      typeOfReport:
        | "general"
        | "byquarter"
        | "bysection"
        | "bynature"
        | "empty"
        | "",
    ) => {
      switch (typeOfReport) {
        case "general":
          return (
            <GeneralReport
              SubMonthIndex={comparePeriodHalves(
                FH_MONTHS_INDEX,
                LH_MONTHS_INDEX,
              )}
              SubMonth={comparePeriodHalves(FH_MONTHS, LH_MONTHS)}
              MonthSubColumn={MONTH_SUBCOLS}
              ReportData={reportData || []}
              RowData={byCostCenterAndNatureRows}
            />
          );
        case "byquarter":
          return (
            <QuarterlyReport
              Months={MONTHS}
              MonthSubColumn={[...MONTH_SUBCOLS, "%"]}
              ReportData={reportData || []}
              Month={reportMonth}
              RowData={byCostCenterAndNatureRows}
            />
          );
        case "bysection":
          return (
            <SectionReport
              SubMonthIndex={comparePeriodHalves(
                FH_MONTHS_INDEX,
                LH_MONTHS_INDEX,
              )}
              SubMonth={comparePeriodHalves(FH_MONTHS, LH_MONTHS)}
              MonthSubColumn={[...MONTH_SUBCOLS, "%"]}
              ReportData={reportData || []}
              RowData={byDeptAndNatureRows}
              Period={reportPeriod}
            />
          );
        case "bynature":
          return (
            <NatureReport
              SubMonthIndex={comparePeriodHalves(
                FH_MONTHS_INDEX,
                LH_MONTHS_INDEX,
              )}
              SubMonth={comparePeriodHalves(FH_MONTHS, LH_MONTHS)}
              MonthSubColumn={[...MONTH_SUBCOLS, "%"]}
              ReportData={reportData || []}
              RowData={byNatureAndAdmOrProdRows}
              Period={reportPeriod}
            />
          );
        default:
          return "";
      }
    },
    pdf: (
      typeOfReport:
        | "general"
        | "byquarter"
        | "bysection"
        | "bynature"
        | "empty"
        | "",
    ) => {
      const space = { title: 6.5, other: 4 };
      const initialYAxis = { title: 12.5, logo: 30, other: 38.5 };
      const initialXAxis = 5;
      const a4PortraitSize = { x: 210, y: 297 };
      const titleFontSize = 12;
      const descriptionFontSize = 8;
      const tableFontSize = 3;
      const tableCellPadding = 0.75;
      const tableLineWidth = 0.1;
      const logoHeight = 3.5;
      const reportFontFamily = "times";
      const reportFontStyle = "normal";
      const isCellNegative = (cell: CellHookData): boolean => {
        const element = cell.cell.raw as HTMLTableCellElement;
        const cellText = cell.cell.text[0];

        return (
          element.classList.contains("bg-red-700") || cellText.startsWith("(")
        );
      };
      const rgbRed700: [number, number, number] = [185, 28, 28];
      const reportPdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
        precision: 16,
        floatPrecision: 16,
      });
      switch (typeOfReport) {
        case "general":
          return async () => {
            reportPdf.setFont(reportFontFamily, reportFontStyle, "bold");
            reportPdf.setFontSize(titleFontSize);
            reportPdf.text(
              "BUDGET USAGE SUPPLIES, FIX AND REPAIR",
              a4PortraitSize.x / 2,
              initialYAxis.title,
              {
                align: "center",
              },
            );

            reportPdf.text(
              reportPeriod,
              a4PortraitSize.x / 2,
              initialYAxis.title + space.title * 1,
              {
                align: "center",
              },
            );

            try {
              interface ImagePayload {
                base64Png: string;
                aspectRatio: number;
              }

              const logoData = await new Promise<ImagePayload>(
                (resolve, reject) => {
                  const img = new Image();
                  img.onload = () => {
                    const canvas = globalThis.document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                      ctx.drawImage(img, 0, 0);
                      resolve({
                        base64Png: canvas.toDataURL("image/png"),
                        aspectRatio: img.width / img.height,
                      });
                    } else {
                      reject(new Error("Failed to initialize canvas context"));
                    }
                  };
                  img.onerror = () =>
                    reject(new Error("Failed to load SVG resource"));
                  img.src = sharp_logo;
                },
              );
              const logoWidth = logoHeight * logoData.aspectRatio;

              reportPdf.addImage(
                logoData.base64Png,
                "PNG",
                initialXAxis,
                initialYAxis.logo,
                logoWidth,
                logoHeight,
              );
            } catch (error) {
              console.error("Error generating company logo:", error);
            }

            reportPdf.setFontSize(descriptionFontSize);
            reportPdf.text(
              COMPANY_NAME,
              initialXAxis,
              initialYAxis.other, //38.5
              {
                align: "left",
              },
            );

            reportPdf.text(
              "File Resource :",
              initialXAxis,
              initialYAxis.other + space.other,
              {
                align: "left",
              },
            );

            reportPdf.text(
              reportFileResource === "Show All" ? "%" : reportFileResource,
              initialXAxis + 20,
              initialYAxis.other + space.other,
              {
                align: "left",
              },
            );

            autoTable(reportPdf, {
              html: "#report",
              theme: "grid",
              startY: initialYAxis.other + space.other * 2,
              styles: {
                fontSize: tableFontSize,
                cellPadding: tableCellPadding,
                halign: "center",
                valign: "middle",
                textColor: "black",
                lineColor: "black",
                fillColor: "white",
                lineWidth: tableLineWidth,
              },
              margin: {
                left: initialXAxis,
                right: initialXAxis,
              },
              didParseCell: (cellContent) => {
                if (isCellNegative(cellContent)) {
                  cellContent.cell.styles.fillColor = rgbRed700;
                  cellContent.cell.styles.textColor = "white";
                }
              },
            });

            reportPdf.save(
              `General_${
                reportFileResource === "Show All" ? "All" : reportFileResource
              }_${reportPeriod}_A4.pdf`,
            );
          };
        case "byquarter":
          return async () => {
            reportPdf.setFont(reportFontFamily, reportFontStyle, "bold");
            reportPdf.setFontSize(titleFontSize);
            reportPdf.text(
              `REPORT BUDGET ${
                reportData && reportData.length !== 0
                  ? reportData[0].ResourceName.toUpperCase()
                  : "..."
              }`,
              a4PortraitSize.x / 2,
              initialYAxis.title,
              {
                align: "center",
              },
            );

            reportPdf.text(
              getCurrentPeriod(
                Number(extractYearFromFullPeriode(reportMonth)),
                Number(extractMonthFromFullPeriode(reportMonth)),
              ).substring(0, 5),
              a4PortraitSize.x / 2,
              initialYAxis.title + space.title * 1,
              {
                align: "center",
              },
            );

            try {
              interface ImagePayload {
                base64Png: string;
                aspectRatio: number;
              }

              const logoData = await new Promise<ImagePayload>(
                (resolve, reject) => {
                  const img = new Image();
                  img.onload = () => {
                    const canvas = globalThis.document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                      ctx.drawImage(img, 0, 0);
                      resolve({
                        base64Png: canvas.toDataURL("image/png"),
                        aspectRatio: img.width / img.height,
                      });
                    } else {
                      reject(new Error("Failed to initialize canvas context"));
                    }
                  };
                  img.onerror = () =>
                    reject(new Error("Failed to load SVG resource"));
                  img.src = sharp_logo;
                },
              );
              const logoWidth = logoHeight * logoData.aspectRatio;

              reportPdf.addImage(
                logoData.base64Png,
                "PNG",
                initialXAxis,
                initialYAxis.logo,
                logoWidth,
                logoHeight,
              );
            } catch (error) {
              console.error("Error generating company logo:", error);
            }

            reportPdf.setFontSize(descriptionFontSize);
            reportPdf.text(COMPANY_NAME, initialXAxis, initialYAxis.other, {
              align: "left",
            });

            reportPdf.text(
              "File Resource :",
              initialXAxis,
              initialYAxis.other + space.other,
              {
                align: "left",
              },
            );

            reportPdf.text(
              reportFileResource === "Show All" ? "%" : reportFileResource,
              initialXAxis + 20,
              initialYAxis.other + space.other,
              {
                align: "left",
              },
            );

            reportPdf.text(
              "Month :",
              initialXAxis,
              initialYAxis.other + space.other * 2,
              {
                align: "left",
              },
            );

            reportPdf.text(
              capitalize(
                MONTHS[Number(extractMonthFromFullPeriode(reportMonth)) - 1],
              ),
              initialXAxis + 20,
              initialYAxis.other + space.other * 2,
              {
                align: "left",
              },
            );

            autoTable(reportPdf, {
              html: "#report",
              theme: "grid",
              startY: initialYAxis.other + space.other * 3,
              styles: {
                fontSize: tableFontSize,
                cellPadding: tableCellPadding,
                halign: "center",
                valign: "middle",
                textColor: "black",
                lineColor: "black",
                fillColor: "white",
                lineWidth: tableLineWidth,
              },
              margin: {
                left: initialXAxis,
                right: initialXAxis,
              },
              didParseCell: (cellContent) => {
                if (isCellNegative(cellContent)) {
                  cellContent.cell.styles.fillColor = rgbRed700;
                  cellContent.cell.styles.textColor = "white";
                }
              },
            });

            reportPdf.save(
              `ByQuarter_${reportFileResource}_${reportMonth}_A4.pdf`,
            );
          };
        case "bysection":
          return async () => {
            reportPdf.setFont(reportFontFamily, reportFontStyle, "bold");
            reportPdf.setFontSize(titleFontSize);
            reportPdf.text(
              "EXPENSES BUDGET REPORT",
              a4PortraitSize.x / 2,
              initialYAxis.title,
              {
                align: "center",
              },
            );

            reportPdf.text(
              reportPeriod,
              a4PortraitSize.x / 2,
              initialYAxis.title + space.title * 1,
              {
                align: "center",
              },
            );

            try {
              interface ImagePayload {
                base64Png: string;
                aspectRatio: number;
              }

              const logoData = await new Promise<ImagePayload>(
                (resolve, reject) => {
                  const img = new Image();
                  img.onload = () => {
                    const canvas = globalThis.document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                      ctx.drawImage(img, 0, 0);
                      resolve({
                        base64Png: canvas.toDataURL("image/png"),
                        aspectRatio: img.width / img.height,
                      });
                    } else {
                      reject(new Error("Failed to initialize canvas context"));
                    }
                  };
                  img.onerror = () =>
                    reject(new Error("Failed to load SVG resource"));
                  img.src = sharp_logo;
                },
              );
              const logoWidth = logoHeight * logoData.aspectRatio;

              reportPdf.addImage(
                logoData.base64Png,
                "PNG",
                initialXAxis,
                initialYAxis.logo,
                logoWidth,
                logoHeight,
              );
            } catch (error) {
              console.error("Error generating company logo:", error);
            }

            reportPdf.setFontSize(descriptionFontSize);
            reportPdf.text(COMPANY_NAME, initialXAxis, initialYAxis.other, {
              align: "left",
            });

            autoTable(reportPdf, {
              html: "#report",
              theme: "grid",
              startY: initialYAxis.other + space.other,
              styles: {
                fontSize: 2.5,
                cellPadding: tableCellPadding,
                halign: "center",
                valign: "middle",
                textColor: "black",
                lineColor: "black",
                fillColor: "white",
                lineWidth: tableLineWidth,
              },
              margin: {
                left: initialXAxis,
                right: initialXAxis,
              },
              didParseCell: (cellContent) => {
                if (isCellNegative(cellContent)) {
                  cellContent.cell.styles.fillColor = rgbRed700;
                  cellContent.cell.styles.textColor = "white";
                }
              },
            });

            reportPdf.save(`BySection_${reportPeriod}_A4.pdf`);
          };
        case "bynature":
          return async () => {
            reportPdf.setFont(reportFontFamily, reportFontStyle, "bold");
            reportPdf.setFontSize(titleFontSize);
            reportPdf.text(
              "EXPENSES BUDGET REPORT",
              a4PortraitSize.x / 2,
              initialYAxis.title,
              {
                align: "center",
              },
            );

            reportPdf.text(
              reportPeriod,
              a4PortraitSize.x / 2,
              initialYAxis.title + space.title * 1,
              {
                align: "center",
              },
            );

            try {
              interface ImagePayload {
                base64Png: string;
                aspectRatio: number;
              }

              const logoData = await new Promise<ImagePayload>(
                (resolve, reject) => {
                  const img = new Image();
                  img.onload = () => {
                    const canvas = globalThis.document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                      ctx.drawImage(img, 0, 0);
                      resolve({
                        base64Png: canvas.toDataURL("image/png"),
                        aspectRatio: img.width / img.height,
                      });
                    } else {
                      reject(new Error("Failed to initialize canvas context"));
                    }
                  };
                  img.onerror = () =>
                    reject(new Error("Failed to load SVG resource"));
                  img.src = sharp_logo;
                },
              );
              const logoWidth = logoHeight * logoData.aspectRatio;

              reportPdf.addImage(
                logoData.base64Png,
                "PNG",
                initialXAxis,
                initialYAxis.logo,
                logoWidth,
                logoHeight,
              );
            } catch (error) {
              console.error("Error generating company logo:", error);
            }

            reportPdf.setFontSize(descriptionFontSize);
            reportPdf.text(COMPANY_NAME, initialXAxis, initialYAxis.other, {
              align: "left",
            });

            autoTable(reportPdf, {
              html: "#report",
              theme: "grid",
              startY: initialYAxis.other + space.other,
              styles: {
                fontSize: 2.5,
                cellPadding: tableCellPadding,
                halign: "center",
                valign: "middle",
                textColor: "black",
                lineColor: "black",
                fillColor: "white",
                lineWidth: tableLineWidth,
              },
              margin: {
                left: initialXAxis,
                right: initialXAxis,
              },
              didParseCell: (cellContent) => {
                if (isCellNegative(cellContent)) {
                  cellContent.cell.styles.fillColor = rgbRed700;
                  cellContent.cell.styles.textColor = "white";
                }
              },
            });

            reportPdf.save(`ByNature_${reportPeriod}_A4.pdf`);
          };
        default:
          return () => void 0;
      }
    },
  };

  const dataExist = reportData !== null && reportData.length !== 0;

  const comparePeriodHalves = <T, U>(fhValue: T[], lhValue: U[]) => {
    return getPeriodHalves(reportPeriod) === "FH" ? fhValue : lhValue;
  };

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
          Months: {},
          TotalBudget: 0,
          TotalBalance: 0,
        };
        map.set(key, row);
      }

      const monthKey = data.Periode.substring(6, 8);
      const budget = Number(data.Budget || 0);
      const balance = Number(data.Balance || 0);

      row.Months[monthKey] = {
        Budget: budget,
        Balance: balance,
        Usage: budget - balance,
      };

      row.TotalBudget += budget;
      row.TotalBalance += balance;
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
          Months: {},
          TotalBudget: 0,
          TotalBalance: 0,
        };
        map.set(key, row);
      }

      const monthKey = data.Periode.substring(6, 8);
      const budget = Number(data.Budget || 0);
      const balance = Number(data.Balance || 0);
      const usage = budget - balance;

      if (!row.Months[monthKey]) {
        row.Months[monthKey] = { Budget: 0, Balance: 0, Usage: 0 };
      }

      row.Months[monthKey].Budget += budget;
      row.Months[monthKey].Balance += balance;
      row.Months[monthKey].Usage += usage;

      row.TotalBudget += budget;
      row.TotalBalance += balance;
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

  const byNatureAndAdmOrProdRows = useMemo(() => {
    const map = new Map<string, Row>();

    reportData?.forEach((data) => {
      const key = `${data.Nature}`;
      let row = map.get(key);

      if (!row) {
        row = {
          Department: data.Department,
          CostCenter: data.CostCenter,
          Nature: data.Nature,
          DepartmentGroup: data.DepartmentGroup,
          Description: data.Description,
          Months: {},
          TotalBudget: 0,
          TotalBalance: 0,
        };
        map.set(key, row);
      }

      const monthKey = data.Periode.substring(6, 8);
      const budget = Number(data.Budget || 0);
      const balance = Number(data.Balance || 0);
      const usage = budget - balance;

      if (!row.Months[monthKey]) {
        row.Months[monthKey] = { Budget: 0, Balance: 0, Usage: 0 };
      }

      row.Months[monthKey].Budget += budget;
      row.Months[monthKey].Balance += balance;
      row.Months[monthKey].Usage += usage;

      row.TotalBudget += budget;
      row.TotalBalance += balance;
    });

    return Array.from(map.values()).sort((rowA, rowB) => {
      const categoryA = rowA.Description.includes("(ADM)")
        ? "Administration"
        : "Production";
      const categoryB = rowB.Description.includes("(ADM)")
        ? "Administration"
        : "Production";

      if (categoryA !== categoryB) {
        return categoryA.localeCompare(categoryB);
      }

      const natureSorting = rowA.Nature.localeCompare(rowB.Nature);
      if (natureSorting !== 0) {
        return natureSorting;
      }

      if (rowA.Department !== rowB.Department) {
        return Number(rowA.Department) - Number(rowB.Department);
      }

      return rowA.Description.localeCompare(rowB.Description);
    });
  }, [reportData]);

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
