import jsPDF from "jspdf";
import { autoTable, type CellHookData } from "jspdf-autotable/es";
import type { Overview } from "../pages/Request.tsx";
import type { UploadedFile } from "@scope/server";

const generateRequestPdf = (
  requestId: string,
  overview: Overview,
  attachments: UploadedFile[] | null,
) => {
  const overviewWithAttachments = {
    ...overview,
    Attachment: attachments?.map((attachment, index) =>
      `${index > 0 ? " " : ""}${attachment.Filename}`
    ),
  };
  const a4PortraitSize = { x: 210, y: 297 };
  const initialXAxis = {
    main: 15,
    overviewData: 45,
  };
  const initialYAxis = {
    overview: 15,
    overviewUnderline: 17,
  };
  const space = 6;
  const requestPdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
    precision: 16,
    floatPrecision: 16,
  }) as jsPDF & { lastAutoTable: { finalY: number } };

  const isCellNoWrap = (cell: CellHookData): boolean => {
    const element = cell.cell.raw as HTMLTableCellElement;
    return element.classList.contains("whitespace-nowrap");
  };
  requestPdf.setFontSize(8);
  requestPdf.setFont("times", "normal", "bold");

  requestPdf.text(
    "ID Trace",
    initialXAxis.main,
    initialYAxis.overview,
    {
      align: "left",
    },
  );

  requestPdf.text(
    requestId || "",
    initialXAxis.overviewData,
    initialYAxis.overview,
    {
      align: "left",
    },
  );

  requestPdf.line(
    initialXAxis.main,
    initialYAxis.overviewUnderline,
    a4PortraitSize.x - initialXAxis.main,
    initialYAxis.overviewUnderline,
  );

  let index = 1;
  for (const [key, value] of Object.entries(overviewWithAttachments)) {
    requestPdf.text(
      String(key),
      initialXAxis.main,
      initialYAxis.overview + space * index,
      {
        align: "left",
      },
    );

    requestPdf.text(
      String(value),
      initialXAxis.overviewData,
      initialYAxis.overview + space * index,
      {
        align: "left",
      },
    );

    requestPdf.line(
      initialXAxis.main,
      initialYAxis.overviewUnderline + space * index,
      a4PortraitSize.x - initialXAxis.main,
      initialYAxis.overviewUnderline + space * index,
    );

    index++;
  }

  index += 1;

  autoTable(requestPdf, {
    html: "#request-items",
    theme: "grid",
    startY: initialYAxis.overview + space * index,
    styles: {
      fontSize: 6,
      cellPadding: 1.5,
      halign: "center",
      valign: "middle",
      textColor: "black",
      lineColor: "black",
      fillColor: "white",
      lineWidth: 0.1,
    },
    margin: {
      left: initialXAxis.main,
      right: initialXAxis.main,
    },
    didParseCell: (cellContent) => {
      if (isCellNoWrap(cellContent)) {
        cellContent.cell.styles.cellWidth = "wrap";
      }
    },
  });

  const lastTableFinalYAxis = requestPdf.lastAutoTable.finalY ||
    0;

  autoTable(requestPdf, {
    html: "#supervisor-path",
    theme: "grid",
    startY: lastTableFinalYAxis + space * 1,
    styles: {
      fontSize: 6,
      cellPadding: 1.5,
      halign: "center",
      valign: "middle",
      textColor: "black",
      lineColor: "black",
      fillColor: "white",
      lineWidth: 0.1,
    },
    margin: {
      left: initialXAxis.main,
      right: initialXAxis.main,
    },
    didParseCell: (cellContent) => {
      if (isCellNoWrap(cellContent)) {
        cellContent.cell.styles.cellWidth = "wrap";
      }
    },
  });

  requestPdf.save(
    `Request_${requestId}_A4.pdf`,
  );
};

export default generateRequestPdf;
