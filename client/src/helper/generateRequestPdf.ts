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

  const maxContentWidth = a4PortraitSize.x - initialXAxis.overviewData -
    initialXAxis.main;
  let offset = 1;

  for (const [key, value] of Object.entries(overviewWithAttachments)) {
    if (key === "Attachment") {
      const attachments = value as string[];

      requestPdf.text(
        key,
        initialXAxis.main,
        initialYAxis.overview + space * offset,
        {
          align: "left",
        },
      );

      for (const attachment of attachments) {
        const wrappedAttachment = requestPdf.splitTextToSize(
          attachment,
          maxContentWidth,
        );
        requestPdf.text(
          wrappedAttachment,
          initialXAxis.overviewData,
          initialYAxis.overview + space * offset,
          {
            align: "left",
          },
        );
        offset += wrappedAttachment.length;
      }

      offset -= 1.5;

      requestPdf.line(
        initialXAxis.main,
        initialYAxis.overviewUnderline + space * offset,
        a4PortraitSize.x - initialXAxis.main,
        initialYAxis.overviewUnderline + space * offset,
      );
    } else {
      const stringValue = String(value);
      const wrappedText = requestPdf.splitTextToSize(
        stringValue,
        maxContentWidth,
      );

      requestPdf.text(
        key,
        initialXAxis.main,
        initialYAxis.overview + space * offset,
        {
          align: "left",
        },
      );

      requestPdf.text(
        wrappedText,
        initialXAxis.overviewData,
        initialYAxis.overview + space * offset,
        {
          align: "left",
        },
      );

      offset += wrappedText.length - 1;

      requestPdf.line(
        initialXAxis.main,
        initialYAxis.overviewUnderline + space * offset,
        a4PortraitSize.x - initialXAxis.main,
        initialYAxis.overviewUnderline + space * offset,
      );
    }

    offset++;
  }

  offset += 1;

  autoTable(requestPdf, {
    html: "#request-items",
    theme: "grid",
    startY: initialYAxis.overview + space * offset,
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

  const lastTableFinalYAxis = requestPdf.lastAutoTable.finalY || 0;

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
