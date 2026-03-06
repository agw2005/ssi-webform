import Primitive from "../components/reusable/Primitive.tsx";
import SelectionInput from "../components/reusable/inputs/SelectionInput.tsx";
import NumberInput from "../components/reusable/inputs/NumberInput.tsx";
import DateRangeInput from "../components/reusable/inputs/DateRangeInput.tsx";
import TextInput from "../components/reusable/inputs/TextInput.tsx";
import { Link } from "react-router-dom";
import { useEffect, useState, useMemo, useReducer } from "react";
import type { SectionName, SupervisorNames, FormRequest } from "@scope/server";
import LoadingFallback from "../components/reusable/LoadingFallback.tsx";
import useFetch from "../hooks/useFetch.tsx";
import capitalize from "../helper/capitalize.ts";
import PagingButton from "../components/reusable/PagingButton.tsx";
import Button from "../components/reusable/Button.tsx";
import stringContainsRedLight from "../helper/stringContainsRedLight.ts";
import formatNumberToString from "../helper/formatNumberToString.ts";
import { useDebounce } from "../hooks/useDebounce.tsx";

interface CountResponsePayload {
  COUNT: number;
}

interface SectionInfo {
  IDSection: number;
  SectionName: string;
}

interface SupervisorInfo {
  NameUser: string;
  IDUser: number;
  DisplayLabel: string;
}

interface Filters {
  section: SectionInfo;
  supervisor: SupervisorInfo;
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

const COLUMNS = [
  "ID Trace",
  "Subject",
  "Amount",
  "Requestor",
  "Status",
  "Current Supervisor",
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
const SELECT_ALL_INDEX = -99;
const SECTION_NAMES_URL = "http://localhost:8000/section/names";
const SUPERVISOR_NAMES_URL = "http://localhost:8000/usermaster/names";
const REQUESTS_URL = "http://localhost:8000/trace/requests";
const REQUESTS_COUNT_URL = "http://localhost:8000/trace/requests/count";

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date string value");
    }
    return date.toISOString().split("T")[0];
  } catch (err) {
    console.error(err);
  }
};

const statusStyling = (status: string) => {
  if (status === "Final Approved") {
    return "bg-green-300";
  } else if (status === "In Progress") {
    return "bg-yellow-300";
  } else if (status === "Rejected") {
    return "bg-red-700 font-bold text-white border-black";
  } else if (status === "Cancelled") {
    return "bg-red-950 font-bold text-white border-black";
  } else if (status === "Expired") {
    return "bg-gray-400 font-bold text-gray-900 border-black";
  } else {
    return "bg-black text-black";
  }
};

const DEFAULT_FILTERS: Filters = {
  section: { IDSection: SELECT_ALL_INDEX, SectionName: "" },
  supervisor: { NameUser: "", IDUser: SELECT_ALL_INDEX, DisplayLabel: "" },
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

const Home = () => {
  const [filters, setFilters] = useReducer(FilterReducer, DEFAULT_FILTERS);
  const [totalRequestInstances, setTotalRequestInstances] = useState(0);
  const [requestData, setRequestData] = useState<FormRequest[] | null>(null);
  const [isRequestDataLoading, setIsRequestDataLoading] = useState(false);
  const [isRequestDataError, setIsRequestDataError] = useState<Error | null>(
    null,
  );
  const debouncedSearch = useDebounce(filters.search, 750);

  const {
    data: sectionNames,
    isLoading: isSectionLoading,
    isError: sectionError,
  } = useFetch<SectionName>(SECTION_NAMES_URL);

  const {
    data: supervisorNames,
    isLoading: isSupervisorLoading,
    isError: supervisorError,
  } = useFetch<SupervisorNames>(SUPERVISOR_NAMES_URL);

  const handleDuplicateNameSupervisors = useMemo(() => {
    if (!supervisorNames) return [];

    const nameFrequency = new Map<string, number>();
    for (const supervisor of supervisorNames) {
      const capitalizedName = capitalize(supervisor.NameUser);
      nameFrequency.set(
        capitalizedName,
        (nameFrequency.get(capitalizedName) || 0) + 1,
      );
    }

    return supervisorNames.map((supervisor) => {
      const capitalizedName = capitalize(supervisor.NameUser);
      const isDuplicate = (nameFrequency.get(capitalizedName) || 0) > 1;

      return {
        IDUser: supervisor.IDUser,
        NameUser: capitalizedName,
        displayedName: isDuplicate
          ? `${capitalizedName} (${supervisor.IDUser})`
          : capitalizedName,
      };
    });
  }, [supervisorNames]);

  const applyParams = (url: URL) => {
    if (filters.section.IDSection !== SELECT_ALL_INDEX) {
      url.searchParams.set(
        "requestorsectionid",
        filters.section.IDSection.toString(),
      );
    }
    if (filters.status !== "All Status" && filters.status !== "") {
      url.searchParams.set("status", filters.status);
    }
    if (filters.supervisor.IDUser !== SELECT_ALL_INDEX) {
      url.searchParams.set(
        "currentsupervisorid",
        String(filters.supervisor.IDUser),
      );
    }
    if (filters.startingDate)
      url.searchParams.set("startdate", filters.startingDate);
    if (filters.endingDate) url.searchParams.set("enddate", filters.endingDate);

    if (debouncedSearch) {
      url.searchParams.set("search", debouncedSearch);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      const requestUrl = new URL(REQUESTS_URL);
      const countUrl = new URL(REQUESTS_COUNT_URL);

      applyParams(requestUrl);
      applyParams(countUrl);

      requestUrl.searchParams.set("pagination", String(filters.pagingRange));
      requestUrl.searchParams.set("page", String(filters.currentPage));

      setIsRequestDataLoading(true);

      try {
        const [requestResponse, countResponse] = await Promise.all([
          fetch(requestUrl.toString(), { signal: abortController.signal }),
          fetch(countUrl.toString(), { signal: abortController.signal }),
        ]);

        if (!requestResponse.ok || !countResponse.ok) {
          throw new Error(`HTTP error! status: ${requestResponse.status}`);
        }

        const requestResponseJson: FormRequest[] = await requestResponse.json();
        const countResponseJson: CountResponsePayload[] =
          await countResponse.json();

        setRequestData(requestResponseJson);
        if (countResponseJson && countResponseJson.length > 0) {
          setTotalRequestInstances(countResponseJson[0].COUNT);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        const error: Error = new Error(
          `Encountered an error when fetching API. Please ensure your connection is stable.\n(${err}).`,
        );
        setIsRequestDataError(error);
      } finally {
        setIsRequestDataLoading(false);
      }
    };

    fetchData();

    return () => abortController.abort();
  }, [
    filters.section,
    filters.status,
    filters.supervisor,
    filters.pagingRange,
    filters.currentPage,
    filters.startingDate,
    filters.endingDate,
    debouncedSearch,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(totalRequestInstances / filters.pagingRange),
  );

  if (isSectionLoading || isSupervisorLoading) {
    return <LoadingFallback />;
  }

  if (sectionError || supervisorError) {
    return (
      <div className="m-4">
        <div>Something unexpected happened.</div>
        {sectionError ? sectionError.message : ""}
        {supervisorError ? supervisorError.message : ""}
        {isRequestDataError ? isRequestDataError.message : ""}
      </div>
    );
  }

  return (
    <Primitive>
      <div className="flex gap-2 flex-wrap">
        <SelectionInput
          label="Section"
          name="filter-section"
          id="filter-section"
          variant="black"
          requiredInput={false}
          defaultDisabledValue="All Section"
          options={[
            "All Section",
            ...(!sectionNames
              ? []
              : sectionNames.map((section) => section.SectionName)),
          ]}
          value={filters.section.SectionName}
          onChangeHandler={(e) => {
            const selectedSectionName = e.target.value;
            const matchedSection = sectionNames?.find(
              (section) => section.SectionName === selectedSectionName,
            );
            setFilters({
              type: "SET_FIELD",
              field: "section",
              value: matchedSection || DEFAULT_FILTERS.section,
            });
          }}
        />
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
        <SelectionInput
          label="Supervisor"
          name="filter-supervisor"
          id="filter-supervisor"
          variant="black"
          requiredInput={false}
          defaultDisabledValue="All Supervisor"
          options={[
            "All Supervisor",
            ...handleDuplicateNameSupervisors.map(
              (supervisor) => supervisor.displayedName,
            ),
          ]}
          value={filters.supervisor.DisplayLabel}
          onChangeHandler={(e) => {
            const newSupervisor = e.target.value;
            const matchedSupervisor = handleDuplicateNameSupervisors.find(
              (supervisor) => supervisor.displayedName === newSupervisor,
            );

            setFilters({
              type: "SET_FIELD",
              field: "supervisor",
              value: matchedSupervisor
                ? {
                    NameUser: matchedSupervisor.NameUser,
                    IDUser: matchedSupervisor.IDUser,
                    DisplayLabel: matchedSupervisor.displayedName,
                  }
                : DEFAULT_FILTERS.supervisor,
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
            minimumValue={0}
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

      {isRequestDataLoading ? (
        <LoadingFallback />
      ) : requestData && requestData.length === 0 ? (
        <div className="mt-4 font-bold text-2xl">
          There is no requests with the selected filters
        </div>
      ) : (
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
            {requestData &&
              requestData.map((request, index) => {
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
                    <td className="text-xs lg:text-sm xl:text-base | whitespace-nowrap border break-all p-2">
                      {
                        handleDuplicateNameSupervisors.find(
                          (supervisor) =>
                            supervisor.IDUser === request.CurrentSupervisorId,
                        )?.displayedName
                      }
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

export default Home;
