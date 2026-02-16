import { useParams } from "react-router-dom";
import Primitive from "../components/Primitive.tsx";
import RequestPlaceholders from "../dummies/HomeTable.json";

interface Request {
  ID?: number;
  "Form Number": string;
  Requestor?: string;
  "Requestor NRP": string;
  "Requestor Section": string;
  "PR Number": string;
  Subject?: string;
  Amount?: number;
  "Return On Outgoing": string;
  Remarks?: string;
  "Cost Center": string;
  Nature: string;
  "ID Budget": string;
  Rate: string;
}

const ITEMS_COLUMNS = [
  "Description",
  "Quantity",
  "Measure",
  "Unit Price",
  "Currency",
  "Estimated Delivery",
  "Vendor",
  "Reason",
  "Rejected",
  "Supplier",
  "Net Price",
  "Delivery Date",
];

const PLACEHOLDER_ITEMS = [
  {
    description: "Voucher stock trading clean paper warna pink",
    quantity: 16,
    measure: "Buku",
    unitPrice: "30,000.00",
    currency: "IDR",
    estimatedDeliveryDate: "2/25/2026",
    vendor: "CV IRENA",
    reason:
      "Voucher Stock taking clean paper Merah for support stock taking in produksi",
    rejected: false,
    rejectedBy: null,
    supplier: "-",
    netPrice: "-",
    deliveryDate: "-",
  },
  {
    description: "Voucher stock trading clean paper warna pink",
    quantity: 16,
    measure: "Buku",
    unitPrice: "30,000.00",
    currency: "IDR",
    estimatedDeliveryDate: "2/25/2026",
    vendor: "CV IRENA",
    reason:
      "Voucher Stock taking clean paper Merah for support stock taking in produksi",
    rejected: false,
    rejectedBy: null,
    supplier: "-",
    netPrice: "-",
    deliveryDate: "-",
  },
  {
    description: "Voucher stock trading clean paper warna pink",
    quantity: 16,
    measure: "Buku",
    unitPrice: "30,000.00",
    currency: "IDR",
    estimatedDeliveryDate: "2/25/2026",
    vendor: "CV IRENA",
    reason:
      "Voucher Stock taking clean paper Merah for support stock taking in produksi",
    rejected: false,
    rejectedBy: null,
    supplier: "-",
    netPrice: "-",
    deliveryDate: "-",
  },
];

const PROGRESS_COLUMNS = [
  "Status",
  "Type",
  "NRP",
  "Name",
  "Result",
  "Verdict Date",
];

const ProgressColors = {
  Approved: "bg-green-500/20 hover:bg-green-500/35 active:bg-green-500/25",
  Rejected: "bg-red-500/10 hover:bg-red-500/35 active:bg-red-500/25",
  InProgress: "bg-blue-500/25 hover:bg-blue-500/35 active:bg-blue-500/50",
  InQueue: "bg-white hover:bg-black/10 active:bg-black/5",
} as const;

const progressColor = (
  progressType: "Approved" | "Rejected" | "In Progress" | "In Queue",
) => {
  try {
    if (progressType === "Approved") {
      return ProgressColors.Approved;
    } else if (progressType === "Rejected") {
      return ProgressColors.Rejected;
    } else if (progressType === "In Progress") {
      return ProgressColors.InProgress;
    } else if (progressType === "In Queue") {
      return ProgressColors.InQueue;
    } else {
      throw Error(
        "Progress type is not in the scope of the defined progress types",
      );
    }
  } catch (err) {
    console.error(err);
  }
};

type ProgressStatus = "Approved" | "Rejected" | "In Progress" | "In Queue";

interface ProgressItem {
  status: ProgressStatus;
  type: string;
  nrp: string;
  name: string;
  result: string;
  verdictDate: string;
}

const PLACEHOLDER_PROGRESS: ProgressItem[] = [
  {
    status: "Approved",
    type: "Approver",
    nrp: "000066",
    name: "HENDRY HARIADI",
    result: "Approved",
    verdictDate: "2/11/2026 9:30:36 AM",
  },
  {
    status: "In Progress",
    type: "Releaser",
    nrp: "002162",
    name: "RAHMAT PRIYO UTOMO",
    result: "-",
    verdictDate: "-",
  },
  {
    status: "In Queue",
    type: "Releaser",
    nrp: "000032R",
    name: "RIDWAN WALANGADI",
    result: "-",
    verdictDate: "-",
  },
  {
    status: "In Queue",
    type: "Administrator",
    nrp: "000308",
    name: "SUWARSIH",
    result: "-",
    verdictDate: "-",
  },
];

const Request = () => {
  const params = useParams();
  const rawRequest = RequestPlaceholders.find(
    (request) => request.ID === Number(params.requestId),
  );

  const displayedInformation: Request = {
    ID: rawRequest?.ID,
    "Form Number": "123456789",
    Requestor: rawRequest?.Requestor,
    "Requestor NRP": "[NRP]",
    "Requestor Section": "[Section]",
    "PR Number": "1010101010101",
    Subject: rawRequest?.Subject,
    Amount: Number(rawRequest?.Amount),
    "Return On Outgoing": "[Return On Outgoing]",
    Remarks: rawRequest?.Remarks,
    "Cost Center": "[Cost Center]",
    Nature: "[Nature]",
    "ID Budget": "[ID Budget]",
    Rate: "[Rate]",
  };

  return (
    <Primitive>
      <div className="flex flex-col gap-8">
        <div className="border">
          {Object.entries(displayedInformation).map(([key, value], index) => (
            <div
              key={key}
              className={`flex border-b border-black/50 ${
                index % 2 === 0
                  ? "bg-black/10 hover:bg-black/15 active:bg-black/12.5"
                  : "bg-black/0 hover:bg-black/5 active:bg-black/2.5"
              }`}
            >
              <div className="flex-1 px-4 py-2">{key}</div>
              <div className="flex-1 px-4 py-2">{value}</div>
              <div className="flex-8"></div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-2xl">Request Items</h2>
          <table className="table-auto border-collapse w-full">
            <thead>
              <tr>
                {ITEMS_COLUMNS.map((column, index) => {
                  return (
                    <th
                      key={index}
                      className="bg-blue-900 hover:bg-blue-800 active:bg-blue-800/80 | text-white border border-black py-2 select-none"
                    >
                      {column}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {PLACEHOLDER_ITEMS.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="bg-white hover:bg-black/10 active:bg-black/5 | w-32 break-normal border text-center px-4 py-2">
                      {item.description}
                    </td>
                    <td className="bg-white hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2">
                      {item.quantity}
                    </td>
                    <td className="bg-white hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2">
                      {item.measure}
                    </td>
                    <td className="bg-white hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2">
                      {item.unitPrice}
                    </td>
                    <td className="bg-white hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2">
                      {item.currency}
                    </td>
                    <td className="bg-white hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2">
                      {item.estimatedDeliveryDate}
                    </td>
                    <td className="bg-white hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2">
                      {item.vendor}
                    </td>
                    <td className="bg-white hover:bg-black/10 active:bg-black/5 | w-64 border text-center px-4 py-2">
                      {item.reason}
                    </td>
                    <td className="bg-white hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2">
                      {item.rejected ? "Yes" : "No"}
                    </td>
                    <td className="bg-white hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2">
                      {item.supplier}
                    </td>
                    <td className="bg-white hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2">
                      {item.netPrice}
                    </td>
                    <td className="bg-white hover:bg-black/10 active:bg-black/5 | border text-center px-4 py-2">
                      {item.deliveryDate}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-2xl">Request Progress</h2>
          <table className="table-auto border-collapse w-full">
            <thead>
              <tr>
                {PROGRESS_COLUMNS.map((column, index) => {
                  return (
                    <th
                      key={index}
                      className="bg-blue-900 hover:bg-blue-800 active:bg-blue-800/80 | text-white border border-black py-2 select-none"
                    >
                      {column}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {PLACEHOLDER_PROGRESS.map((row, index) => {
                return (
                  <tr key={index}>
                    <td
                      className={`${progressColor(row.status)} active:bg-black/5 | border text-center px-4 py-2`}
                    >
                      {row.status}
                    </td>
                    <td
                      className={`${progressColor(row.status)} active:bg-black/5 | border text-center px-4 py-2`}
                    >
                      {row.type}
                    </td>
                    <td
                      className={`${progressColor(row.status)} active:bg-black/5 | border text-center px-4 py-2`}
                    >
                      {row.nrp}
                    </td>
                    <td
                      className={`${progressColor(row.status)} active:bg-black/5 | border text-center px-4 py-2`}
                    >
                      {row.name}
                    </td>
                    <td
                      className={`${progressColor(row.status)} active:bg-black/5 | border text-center px-4 py-2`}
                    >
                      {row.result}
                    </td>
                    <td
                      className={`${progressColor(row.status)} active:bg-black/5 | border text-center px-4 py-2`}
                    >
                      {row.verdictDate}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Primitive>
  );
};

export default Request;
