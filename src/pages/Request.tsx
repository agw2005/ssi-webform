import { useParams } from "react-router-dom";
import Primitive from "../components/Primitive.tsx";
import RequestPlaceholders from "../dummies/HomeTable.json";

interface Request {
  ID?: number;
  FormNumber: string;
  Requestor?: string;
  RequestorNRP: string;
  RequestorSection: string;
  PRNumber: string;
  Subject?: string;
  Amount?: number;
  ReturnOnOutgoing: string;
  Remarks?: string | null;
}

const Request = () => {
  const params = useParams();
  const rawRequest = RequestPlaceholders.find(
    (request) => request.ID === Number(params.requestId),
  );

  const displayedInformation: Request = {
    ID: rawRequest?.ID,
    FormNumber: "123456789",
    Requestor: rawRequest?.Requestor,
    RequestorNRP: "[NRP]",
    RequestorSection: "[Section]",
    PRNumber: "1010101010101",
    Subject: rawRequest?.Subject,
    Amount: Number(rawRequest?.Amount),
    ReturnOnOutgoing: "[Return On Outgoing]",
    Remarks: rawRequest?.Remarks,
  };

  return (
    <Primitive>
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
    </Primitive>
  );
};

export default Request;
