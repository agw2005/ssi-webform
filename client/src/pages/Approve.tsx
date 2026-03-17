import { Link } from "react-router-dom";
import LoadingFallback from "../components/reusable/LoadingFallback.tsx";
import Primitive from "../components/reusable/Primitive.tsx";
import serverDomain from "../helper/serverDomain.ts";
import useAuth from "../hooks/useAuth.tsx";
import type { TraceApproveRequests, TraceRequestsCount } from "@scope/server";
import { useEffect, useReducer, useState } from "react";
import stringContainsRedLight from "../helper/stringContainsRedLight.ts";
import formatNumberToString from "../helper/formatNumberToString.ts";
import capitalize from "../helper/capitalize.ts";
import { formatDate } from "../helper/formatDate.ts";
import { statusStyling } from "../helper/statusStyling.ts";
import Button from "../components/reusable/Button.tsx";
import TextInput from "../components/reusable/inputs/TextInput.tsx";
import PagingButton from "../components/reusable/PagingButton.tsx";
import NumberInput from "../components/reusable/inputs/NumberInput.tsx";
import DateRangeInput from "../components/reusable/inputs/DateRangeInput.tsx";
import SelectionInput from "../components/reusable/inputs/SelectionInput.tsx";
import { useDebounce } from "../hooks/useDebounce.tsx";

const REQUESTS_URL = `${serverDomain}/trace/approve`;
const REQUESTS_COUNT_URL = `${serverDomain}/trace/approve/count`;

const COLUMNS = [
  "ID Trace",
  "Subject",
  "Amount",
  "Requestor",
  "Status",
  "Submit Date",
  "Remarks",
];

const STATUSES = [
  "All Status",
  "Final Approved",
  "In Progress",
  "Rejected",
  "Cancelled",
  "Expired",
];

interface Filters {
  status: string;
  pagingRange: number;
  startingDate: string;
  endingDate: string;
  search: string;
  currentPage: number;
}

type FilterAction =
  | { type: "SET_FIELD"; field: keyof Filters; value: unknown }
  | { type: "RESET_FILTERS" }
  | { type: "SET_PAGE"; page: number };

const DEFAULT_FILTERS: Filters = {
  status: "",
  pagingRange: 20,
  startingDate: "",
  endingDate: "",
  search: "",
  currentPage: 1,
};

const FilterReducer = (state: Filters, action: FilterAction) => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
        currentPage: 1,
      };
    case "SET_PAGE":
      return { ...state, currentPage: action.page };
    case "RESET_FILTERS":
      return DEFAULT_FILTERS;
    default:
      return state;
  }
};

const Approve = () => {
  const { authInfo, authIsLoading } = useAuth();

  const [requests, setRequests] = useState<TraceApproveRequests[]>([]);
  const [isRequestsLoading, setIsRequestsLoading] = useState(false);
  const [isRequestsError, setIsRequestsError] = useState<Error | null>(null);
  const [totalRequests, setTotalRequests] = useState(0);

  const [filters, setFilters] = useReducer(FilterReducer, DEFAULT_FILTERS);

  const debouncedSearch = useDebounce(filters.search, 750);

  const applyParams = (url: URL) => {
    if (filters.status !== "All Status" && filters.status !== "") {
      url.searchParams.set("status", filters.status);
    }

    if (filters.startingDate)
      url.searchParams.set("startdate", filters.startingDate);

    if (filters.endingDate) url.searchParams.set("enddate", filters.endingDate);

    if (debouncedSearch) {
      url.searchParams.set("search", debouncedSearch);
    }

    url.searchParams.set("page", String(filters.currentPage));
    url.searchParams.set("pagination", String(filters.pagingRange));

    if (authInfo) url.searchParams.set("nrp", authInfo.nrp);
  };

  useEffect(() => {
    setIsRequestsLoading(true);
    const abortController = new AbortController();

    const fetchData = async () => {
      const requestUrl = new URL(REQUESTS_URL);
      const requestCountUrl = new URL(REQUESTS_COUNT_URL);

      applyParams(requestUrl);
      applyParams(requestCountUrl);

      try {
        const [requestResponse, countResponse] = await Promise.all([
          fetch(requestUrl.toString(), { signal: abortController.signal }),
          fetch(requestCountUrl.toString(), { signal: abortController.signal }),
        ]);

        if (!requestResponse.ok) {
          throw new Error(`HTTP error! status: ${requestResponse.status}`);
        }

        const requestResponseJson: TraceApproveRequests[] =
          await requestResponse.json();
        const countResponseJson: TraceRequestsCount[] =
          await countResponse.json();

        setRequests(requestResponseJson);
        if (countResponseJson && countResponseJson.length > 0) {
          setTotalRequests(countResponseJson[0].Count);
        }
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
  }, [
    authInfo,
    filters.status,
    filters.pagingRange,
    filters.currentPage,
    filters.startingDate,
    filters.endingDate,
    debouncedSearch,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(totalRequests / filters.pagingRange),
  );

  return (
    <Primitive
      isLoading={[authIsLoading]}
      isErr={[isRequestsError]}
      componentName="Approve.tsx"
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 flex-wrap">
          <SelectionInput
            label="Status"
            name="filter-status"
            id="filter-status"
            variant="black"
            requiredInput={false}
            defaultDisabledValue="All Status"
            options={STATUSES}
            value={filters.status}
            onChangeHandler={(e) => {
              const newStatus = e.target.value;
              setFilters({
                type: "SET_FIELD",
                field: "status",
                value: newStatus,
              });
            }}
          />
          <DateRangeInput
            name="filter-date-range"
            id="filter-date-range"
            variant="black"
            firstDateRequiredInput={false}
            secondDateRequiredInput={false}
            startingDateValue={filters.startingDate}
            endingDateValue={filters.endingDate}
            startingDateOnChangeHandler={(e) => {
              setFilters({
                type: "SET_FIELD",
                field: "startingDate",
                value: e.target.value,
              });
            }}
            endingOnDateChangeHandler={(e) => {
              setFilters({
                type: "SET_FIELD",
                field: "endingDate",
                value: e.target.value,
              });
            }}
          />
          <div className="flex w-32">
            <NumberInput
              label="Items"
              name="paging-range"
              id="paging-range"
              requiredInput={false}
              variant="black"
              minimumValue={1}
              value={String(filters.pagingRange)}
              onChangeHandler={(e) => {
                setFilters({
                  type: "SET_FIELD",
                  field: "pagingRange",
                  value: Number(e.target.value),
                });
              }}
            />
          </div>
          <PagingButton
            name="paging-button"
            id="paging-button"
            variant="black"
            currentPage={filters.currentPage}
            totalPages={totalPages}
            onInputChangeHandler={(e) =>
              setFilters({ type: "SET_PAGE", page: Number(e.target.value) })
            }
          />
          <TextInput
            label="Search"
            name="search"
            id="search"
            variant="black"
            requiredInput={false}
            value={filters.search}
            onChangeHandler={(e) => {
              setFilters({
                type: "SET_FIELD",
                field: "search",
                value: e.target.value,
              });
            }}
          />
          <div
            onClick={() => {
              setFilters({ type: "RESET_FILTERS" });
            }}
          >
            <Button id="reset-filters" variant="black" label="Reset" />
          </div>
        </div>
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
      </div>
    </Primitive>
  );
};

export default Approve;
