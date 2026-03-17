import { Link } from "react-router-dom";
import LoadingFallback from "../components/reusable/LoadingFallback.tsx";
import Primitive from "../components/reusable/Primitive.tsx";
import serverDomain from "../helper/serverDomain.ts";
import useAuth from "../hooks/useAuth.tsx";
import type { TraceApproveRequests } from "@scope/server";
import { useEffect, useState } from "react";
import stringContainsRedLight from "../helper/stringContainsRedLight.ts";
import formatNumberToString from "../helper/formatNumberToString.ts";
import capitalize from "../helper/capitalize.ts";
import { formatDate } from "../helper/formatDate.ts";
import { statusStyling } from "../helper/statusStyling.ts";

const REQUESTS_URL = `${serverDomain}/trace/approve`;

const COLUMNS = [
  "ID Trace",
  "Subject",
  "Amount",
  "Requestor",
  "Status",
  "SubmitDate",
  "Remarks",
];

const Approve = () => {
  const { authInfo, authIsLoading } = useAuth();

  const [requests, setRequests] = useState<TraceApproveRequests[]>([]);
  const [isRequestsLoading, setIsRequestsLoading] = useState(false);
  const [isRequestsError, setIsRequestsError] = useState<Error | null>(null);

  const applyParams = (url: URL) => {
    url.searchParams.set("page", "1");
    url.searchParams.set("pagination", "50");
    if (authInfo) url.searchParams.set("nrp", authInfo.nrp);
  };

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      const requestUrl = new URL(REQUESTS_URL);
      applyParams(requestUrl);
      setIsRequestsLoading(true);

      try {
        const [requestResponse] = await Promise.all([
          fetch(requestUrl.toString(), { signal: abortController.signal }),
        ]);

        if (!requestResponse.ok) {
          throw new Error(`HTTP error! status: ${requestResponse.status}`);
        }

        const requestResponseJson: TraceApproveRequests[] =
          await requestResponse.json();

        setRequests(requestResponseJson);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        const error: Error = new Error(
          `Encountered an error when fetching API. Please ensure your connection is stable.\n(${err}).`,
        );
        setIsRequestsError(error);
      } finally {
        setIsRequestsLoading(false);
      }
    };

    fetchData();

    return () => abortController.abort();
  }, [authInfo]);

  return (
    <Primitive
      isLoading={[isRequestsLoading, authIsLoading]}
      isErr={[isRequestsError]}
      componentName="Approve.tsx"
    >
      {isRequestsLoading ? (
        <LoadingFallback />
      ) : requests && requests.length === 0 ? (
        <div className="font-bold text-2xl">
          There is no requests with You as the supervisor.
        </div>
      ) : (
        <table className="table-auto border-collapse min-w-full max-w-full">
          <thead>
            <tr>
              {COLUMNS.map((column, index) => {
                return (
                  <th
                    key={index}
                    className="text-xs lg:text-sm xl:text-base | whitespace-nowrap border p-2 bg-blue-800 text-white border-black"
                  >
                    {column}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {requests &&
              requests.map((request, index) => {
                return (
                  <tr key={index}>
                    <td className="text-xs lg:text-sm xl:text-base | whitespace-nowrap text-center border break-all p-2">
                      {request.IDTrace}
                    </td>
                    <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                      <Link
                        className="text-blue-700 underline"
                        to={`/request/${request.IDTrace}`}
                      >
                        {request.Subject}
                      </Link>{" "}
                      {stringContainsRedLight(request.Subject) ||
                      stringContainsRedLight(request.Remarks) ? (
                        <span className="text-red-500 font-bold drop-shadow">
                          Red Light
                        </span>
                      ) : (
                        ""
                      )}
                    </td>
                    <td className="text-xs lg:text-sm xl:text-base | whitespace-nowrap border break-all p-2">
                      {formatNumberToString(request.Amount)}
                    </td>
                    <td className="text-xs lg:text-sm xl:text-base | whitespace-nowrap border break-all p-2">
                      {capitalize(request.Requestor)}
                    </td>
                    <td
                      className={`text-xs lg:text-sm xl:text-base | whitespace-nowrap border text-center p-2 ${statusStyling(request.Status)}`}
                    >
                      {request.Status}
                    </td>
                    <td className="text-xs lg:text-sm xl:text-base | whitespace-nowrap border text-center p-2">
                      {formatDate(request.SubmitDate)}
                    </td>
                    <td className="text-xs lg:text-sm xl:text-base | whitespace-nowrap border min-w-16 text-center p-2">
                      {request.Remarks}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
    </Primitive>
  );
};

export default Approve;
