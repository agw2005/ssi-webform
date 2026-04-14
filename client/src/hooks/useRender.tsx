import Description from "../components/non-reusable/report/Description.tsx";
import Titles from "../components/non-reusable/report/Titles.tsx";
import type { ReportResponse } from "@scope/server-ssms";
import {
  COMPANY_NAME,
  FH_MONTHS,
  FH_MONTHS_INDEX,
  LH_MONTHS,
  LH_MONTHS_INDEX,
  MONTH_SUBCOLS,
  MONTHS,
} from "../pages/Report.tsx";
import getPeriodHalves from "../helper/getPeriodHalves.ts";
import GeneralReport from "../components/non-reusable/report/GeneralReport.tsx";
import { useReportRows } from "./useReportRows.tsx";
import NatureReport from "../components/non-reusable/report/NatureReport.tsx";
import SectionReport from "../components/non-reusable/report/SectionReport.tsx";
import QuarterlyReport from "../components/non-reusable/report/QuarterlyReport.tsx";
import { autoTable, type CellHookData } from "jspdf-autotable/es";
import jsPDF from "jspdf";
import sharp_logo from "../assets/svg/sharp_logo.svg";
import getCurrentPeriod from "../helper/getCurrentPeriod.ts";
import extractYearFromFullPeriode from "../helper/extractYearFromFullPeriode.ts";
import extractMonthFromFullPeriode from "../helper/extractMonthFromFullPeriode.ts";
import capitalize from "../helper/capitalize.ts";

const useRender = (
  reportPeriod: string,
  reportMonth: string,
  reportFileResource: string,
  reportData: ReportResponse[] | null,
) => {
  const comparePeriodHalves = <T, U>(fhValue: T[], lhValue: U[]) => {
    return getPeriodHalves(reportPeriod) === "FH" ? fhValue : lhValue;
  };

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
              RowData={useReportRows(reportData, ["CostCenter", "Nature"])}
            />
          );
        case "byquarter":
          return (
            <QuarterlyReport
              Months={MONTHS}
              MonthSubColumn={[...MONTH_SUBCOLS, "%"]}
              ReportData={reportData || []}
              Month={reportMonth}
              RowData={useReportRows(reportData, ["CostCenter", "Nature"])}
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
              RowData={useReportRows(reportData, ["Dept", "Nature"])}
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
              RowData={useReportRows(reportData, ["AdmOrProd", "Nature"])}
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

  return render;
};

export default useRender;
