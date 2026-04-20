import { Link } from "react-router-dom";
import LoadingFallback from "../components/reusable/LoadingFallback.tsx";
import Primitive from "../components/reusable/Primitive.tsx";
import useAuth from "../hooks/useAuth.tsx";
import type { TraceApproveRequests, TraceRequestsCount } from "@scope/server";
import { useReducer } from "react";
import stringContainsRedLight from "../helper/stringContainsRedLight.ts";
import formatNumberToString from "../helper/formatNumberToString.ts";
import capitalize from "../helper/capitalize.ts";
import { formatDate } from "../helper/formatDate.ts";
import { resultStyling } from "../helper/resultStyling.ts";
import Button from "../components/reusable/Button.tsx";
import TextInput from "../components/reusable/inputs/TextInput.tsx";
import PagingButton from "../components/reusable/PagingButton.tsx";
import NumberInput from "../components/reusable/inputs/NumberInput.tsx";
import DateRangeInput from "../components/reusable/inputs/DateRangeInput.tsx";
import SelectionInput from "../components/reusable/inputs/SelectionInput.tsx";
import { useDebounce } from "../hooks/useDebounce.tsx";
import usePurchasingRequests from "../hooks/usePurchasingRequests.tsx";
import { webformAPI } from "../helper/apis.ts";

const COLUMNS = [
  "ID Trace",
  "Subject",
  "Amount",
  "Requestor",
  "Type",
  "Step",
  "Status",
  "Submit Date",
  "Remarks",
];

const RESULTS = ["All Results", "Approved", "In Progress", "Rejected"];

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

const SupervisorType = (type: "A" | "R" | "ADM") => {
  switch (type) {
    case "A":
      return "Approver";
    case "R":
      return "Releaser";
    case "ADM":
      return "Administrator";
    default:
      return "";
  }
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

  const [filters, setFilters] = useReducer(FilterReducer, DEFAULT_FILTERS);

  const debouncedSearch = useDebounce(filters.search, 750);

  const params = new URLSearchParams();
  if (filters.status !== "All Results" && filters.status !== "") {
    params.set("status", filters.status);
  }
  if (filters.startingDate) params.set("startdate", filters.startingDate);
  if (filters.endingDate) params.set("enddate", filters.endingDate);
  if (authInfo) params.set("nrp", authInfo.nrp);
  if (debouncedSearch) params.set("search", debouncedSearch);
  params.set("page", String(filters.currentPage));
  params.set("pagination", String(filters.pagingRange));

  const {
    requestIsLoading,
    requestIsError,
    totalRequestsAtDatabase,
    requests,
  } = usePurchasingRequests<TraceApproveRequests, TraceRequestsCount>(
    webformAPI.ApproversRequest,
    webformAPI.ApproversRequestCount,
    params.toString(),
  );

  const totalPages = Math.max(
    1,
    Math.ceil(totalRequestsAtDatabase / filters.pagingRange),
  );

  return (
    <Primitive
      isLoading={[authIsLoading]}
      isErr={[requestIsError]}
      componentName="Approve.tsx"
      pageTitle="Approval Menu"
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 flex-wrap">
          <SelectionInput
            label="Status"
            name="filter-status"
            id="filter-status"
            variant="black"
            requiredInput={false}
            defaultDisabledValue="All Results"
            options={RESULTS}
            value={filters.status}
            onChangeHandler={(e) => {
              const newResult = e.target.value;
              setFilters({
                type: "SET_FIELD",
                field: "status",
                value: newResult,
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
              setFilters({ type: "SET_PAGE", page: Number(e.target.value) })}
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
        {requestIsLoading
          ? <LoadingFallback />
          : requests && requests.length === 0
          ? (
            <div className="font-bold text-2xl">
              There is no requests with You as the supervisor.
            </div>
          )
          : (
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
                          {stringContainsRedLight(String(request.Subject)) ||
                              stringContainsRedLight(String(request.Remarks))
                            ? (
                              <span className="text-red-500 font-bold drop-shadow">
                                Red Light
                              </span>
                            )
                            : (
                              ""
                            )}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | whitespace-nowrap border break-all p-2">
                          {formatNumberToString(request.Amount)}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | whitespace-nowrap border break-all p-2">
                          {capitalize(request.Requestor)}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | whitespace-nowrap border text-center break-all p-2">
                          {SupervisorType(
                            request.SupervisorType as "A" | "R" | "ADM",
                          )}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | whitespace-nowrap border text-center break-all p-2">
                          {request.SupervisorStep}
                        </td>
                        <td
                          className={`text-xs lg:text-sm xl:text-base | whitespace-nowrap border text-center p-2 ${
                            resultStyling(request.Result)
                          }`}
                        >
                          {request.Result === ""
                            ? "Awaiting Turn"
                            : request.Result}
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
