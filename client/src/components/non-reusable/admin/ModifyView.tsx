import type {
  FormRequest,
  SupervisorNames,
  TraceRequestsCount,
} from "@scope/server";
import { useDuplicateSupervisors } from "../../../hooks/useDuplicateSupervisors.tsx";
import useFetch from "../../../hooks/useFetch.tsx";
import Button from "../../reusable/Button.tsx";
import DateRangeInput from "../../reusable/inputs/DateRangeInput.tsx";
import NumberInput from "../../reusable/inputs/NumberInput.tsx";
import TextInput from "../../reusable/inputs/TextInput.tsx";
import LoadingFallback from "../../reusable/LoadingFallback.tsx";
import PagingButton from "../../reusable/PagingButton.tsx";
import { useReducer, useState } from "react";
import { useDebounce } from "../../../hooks/useDebounce.tsx";
import usePurchasingRequests from "../../../hooks/usePurchasingRequests.tsx";
import stringContainsRedLight from "../../../helper/stringContainsRedLight.ts";
import { Link } from "react-router-dom";
import formatNumberToString from "../../../helper/formatNumberToString.ts";
import capitalize from "../../../helper/capitalize.ts";
import { statusStyling } from "../../../helper/statusStyling.ts";
import { formatDate } from "../../../helper/formatDate.ts";
import TipBox from "../../reusable/TipBox.tsx";
import { webformAPI } from "../../../helper/apis.ts";

interface ModifyViewProps {
  toggleDialog: (
    option: "empty" | "success" | "error" | "modify",
    errMessage?: Error | null,
  ) => void;
}

const COLUMNS = [
  "ID Trace",
  "Subject",
  "Amount",
  "Requestor",
  "Status",
  "Current Supervisor",
  "Submit Date",
];

interface Filters {
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

const DEFAULT_FILTERS: Filters = {
  pagingRange: 20,
  startingDate: "",
  endingDate: "",
  search: "",
  currentPage: 1,
};

const ModifyView = ({ toggleDialog }: ModifyViewProps) => {
  const [modificationIsLoading, setModificationIsLoading] = useState(false);
  const [modificationIsError, setModificationIsError] = useState<Error | null>(
    null,
  );
  const [filters, setFilters] = useReducer(FilterReducer, DEFAULT_FILTERS);
  const debouncedSearch = useDebounce(filters.search, 750);

  const params = new URLSearchParams();
  if (debouncedSearch) params.set("search", debouncedSearch);
  if (filters.startingDate) params.set("startdate", filters.startingDate);
  if (filters.endingDate) params.set("enddate", filters.endingDate);
  params.set("page", String(filters.currentPage));
  params.set("pagination", String(filters.pagingRange));

  const {
    requestIsLoading,
    requestIsError: _requestIsError,
    totalRequestsAtDatabase,
    requests,
    refetch: refetchRequest,
  } = usePurchasingRequests<FormRequest, TraceRequestsCount>(
    webformAPI.Request,
    webformAPI.RequestCount,
    params.toString(),
  );

  const {
    data: supervisorNames,
    isLoading: _isSupervisorLoading,
    isError: _supervisorError,
    refetch: refetchSupervisor,
  } = useFetch<SupervisorNames>(webformAPI.SupervisorNames);

  const totalPages = Math.max(
    1,
    Math.ceil(totalRequestsAtDatabase / filters.pagingRange),
  );

  const duplicateSupervisorNames = useDuplicateSupervisors(
    supervisorNames,
  );

  const editRequest = () => {
    toggleDialog("modify");
  };

  const deleteRequest = async (traceId: number) => {
    setModificationIsLoading(true);
    setModificationIsError(null);
    const abortController = new AbortController();
    try {
      const response = await fetch(
        webformAPI.DeleteRequest(traceId),
        { method: "DELETE", signal: abortController.signal },
      );
      if (response.ok) {
        refetchRequest();
        refetchSupervisor();
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      const error: Error = new Error(
        `Encountered an error when deleting data from the database. Please ensure your connection is stable.\n(${err}).`,
      );
      setModificationIsError(error);
      console.error(error);
      toggleDialog("error", error);
    } finally {
      setModificationIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="h-8 lg:h-9 xl:h-10 | flex items-center w-max gap-2 mt-4">
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
      {modificationIsError && (
        <div className="max-w-full">
          <TipBox
            label="Encountered an error when modifying data from the database. Please ensure your connection is stable"
            variant="red"
          />
        </div>
      )}
      {requestIsLoading && modificationIsLoading
        ? <LoadingFallback />
        : requests && requests.length === 0
        ? (
          <div className="mt-4 font-bold text-2xl">
            There is no requests with the selected filters
          </div>
        )
        : (
          <table className="table-auto border-collapse min-w-full max-w-full mt-4">
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
                            stringContainsRedLight(request.Remarks)
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
                      <td
                        className={`text-xs lg:text-sm xl:text-base | whitespace-nowrap border text-center p-2 ${
                          statusStyling(request.Status)
                        }`}
                      >
                        {request.Status}
                      </td>
                      <td className="text-xs lg:text-sm xl:text-base | whitespace-nowrap border break-all p-2">
                        {duplicateSupervisorNames.find(
                          (supervisor) =>
                            supervisor.IDUser ===
                              request.CurrentSupervisorId,
                        )?.displayedName}
                      </td>
                      <td className="text-xs lg:text-sm xl:text-base | whitespace-nowrap border text-center p-2">
                        {formatDate(request.SubmitDate)}
                      </td>
                      <td
                        className="bg-yellow-500/50 hover:bg-yellow-500 active:bg-yellow-800 | text-black active:text-white | border-black active:border-black | text-xs lg:text-sm xl:text-base | whitespace-nowrap border min-w-16 text-center p-2 select-none"
                        onClick={editRequest}
                      >
                        Edit
                      </td>
                      <td
                        className="bg-red-500/50 hover:bg-red-500 active:bg-red-800 | text-black active:text-white | border-black active:border-black | text-xs lg:text-sm xl:text-base | whitespace-nowrap border min-w-16 text-center p-2 select-none"
                        onClick={() => deleteRequest(request.IDTrace)}
                      >
                        Delete
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
    </div>
  );
};

export default ModifyView;
