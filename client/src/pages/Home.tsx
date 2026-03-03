import Primitive from "../components/reusable/Primitive.tsx";
import SelectionInput from "../components/reusable/inputs/SelectionInput.tsx";
import NumberInput from "../components/reusable/inputs/NumberInput.tsx";
import DateRangeInput from "../components/reusable/inputs/DateRangeInput.tsx";
import TextInput from "../components/reusable/inputs/TextInput.tsx";
import { Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import type { SectionName, SupervisorNames, FormRequest } from "@scope/server";
import LoadingFallback from "../components/reusable/LoadingFallback.tsx";
import useFetch from "../hooks/useFetch.tsx";
import capitalize from "../helper/capitalize.ts";

interface SectionPayload {
  IDSection: number;
  SectionName: string;
}

interface SupervisorPayload {
  NameUser: string;
  IDUser: number;
  DisplayLabel: string;
}

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

const STATUSES = ["All Status", "Final Approved", "In Progress", "Rejected"];
const SELECT_ALL_INDEX = -99;
const SECTION_NAMES_URL = "http://localhost:8000/section/names";
const SUPERVISOR_NAMES_URL = "http://localhost:8000/usermaster/names";
const REQUESTS_URL = "http://localhost:8000/trace/requests";

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

const DEFAULT_SECTION_FILTER: SectionPayload = {
  IDSection: SELECT_ALL_INDEX,
  SectionName: "",
};

const DEFAULT_SUPERVISOR_FILTER: SupervisorPayload = {
  NameUser: "",
  IDUser: SELECT_ALL_INDEX,
  DisplayLabel: "",
};

const Home = () => {
  const [sectionFilter, setSectionFilter] = useState<SectionPayload>(
    DEFAULT_SECTION_FILTER,
  );
  const [statusFilter, setStatusFilter] = useState("");
  const [supervisorFilter, setSupervisorFilter] = useState<SupervisorPayload>(
    DEFAULT_SUPERVISOR_FILTER,
  );
  const [pagingRange, setPagingRange] = useState(20);
  const [startingDate, setStartingDate] = useState("");
  const [endingDate, setEndingDate] = useState("");
  const [searchField, setSearchField] = useState("");

  const statusStyling = (status: string) => {
    if (status === "Final Approved") {
      return "bg-green-300";
    } else if (status === "In Progress") {
      return "bg-yellow-300";
    } else {
      return "bg-red-700 font-bold text-white border-black";
    }
  };

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

  const [requestData, setRequestData] = useState<FormRequest[] | null>(null);
  const [isRequestDataLoading, setIsRequestDataLoading] = useState(false);
  const [isRequestDataError, setIsRequestDataError] = useState<Error | null>(
    null,
  );

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

  useEffect(() => {
    const requestUrl = new URL(REQUESTS_URL);
    const abortController = new AbortController();
    setIsRequestDataLoading(true);

    if (sectionFilter.IDSection !== SELECT_ALL_INDEX) {
      requestUrl.searchParams.set(
        "requestorsectionid",
        sectionFilter.IDSection.toString(),
      );
    }
    if (statusFilter !== "All Status" && statusFilter !== "") {
      requestUrl.searchParams.set("status", statusFilter);
    }
    if (supervisorFilter.IDUser !== SELECT_ALL_INDEX) {
      requestUrl.searchParams.set(
        "currentsupervisorid",
        String(supervisorFilter.IDUser),
      );
    }
    if (startingDate) requestUrl.searchParams.set("startdate", startingDate);
    if (endingDate) requestUrl.searchParams.set("enddate", endingDate);

    requestUrl.searchParams.set("pagination", String(pagingRange));

    const fetchData = async () => {
      try {
        const response = await fetch(requestUrl.toString(), {
          signal: abortController.signal,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseJson: FormRequest[] = await response.json();
        setRequestData(responseJson);
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

    return () => {
      abortController.abort();
    };
  }, [
    sectionFilter,
    statusFilter,
    supervisorFilter,
    pagingRange,
    startingDate,
    endingDate,
  ]);

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
          value={sectionFilter.SectionName}
          onChangeHandler={(e) => {
            const selectedSectionName = e.target.value;

            if (
              selectedSectionName === "All Section" ||
              selectedSectionName === ""
            ) {
              setSectionFilter(DEFAULT_SECTION_FILTER);
            } else {
              const matchedSection = sectionNames?.find(
                (section) => section.SectionName === selectedSectionName,
              );
              if (matchedSection) {
                setSectionFilter({
                  IDSection: matchedSection.IDSection,
                  SectionName: matchedSection.SectionName,
                });
              }
            }
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
          value={statusFilter}
          onChangeHandler={(e) => setStatusFilter(e.currentTarget.value)}
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
          value={
            supervisorFilter.DisplayLabel === ""
              ? ""
              : supervisorFilter.DisplayLabel
          }
          onChangeHandler={(e) => {
            const selectedLabel = e.target.value;

            if (selectedLabel === "All Supervisor" || selectedLabel === "") {
              setSupervisorFilter(DEFAULT_SUPERVISOR_FILTER);
            } else {
              const matchedSupervisor = handleDuplicateNameSupervisors.find(
                (supervisor) => supervisor.displayedName === selectedLabel,
              );
              if (matchedSupervisor) {
                setSupervisorFilter({
                  NameUser: matchedSupervisor.NameUser,
                  IDUser: matchedSupervisor.IDUser,
                  DisplayLabel: matchedSupervisor.displayedName,
                });
              }
            }
          }}
        />
        <DateRangeInput
          name="filter-date-range"
          id="filter-date-range"
          variant="black"
          firstDateRequiredInput={false}
          secondDateRequiredInput={false}
          startingDateValue={startingDate}
          endingDateValue={endingDate}
          startingDateOnChangeHandler={(e) =>
            setStartingDate(e.currentTarget.value)
          }
          endingOnDateChangeHandler={(e) =>
            setEndingDate(e.currentTarget.value)
          }
        />
        <NumberInput
          label="Items"
          name="paging-range"
          id="paging-range"
          requiredInput={false}
          variant="black"
          minimumValue={0}
          value={String(pagingRange)}
          onChangeHandler={(e) => {
            setPagingRange(Number(e.currentTarget.value));
          }}
        />
        <TextInput
          label="Search"
          name="search"
          id="search"
          variant="black"
          requiredInput={false}
          value={searchField}
          onChangeHandler={(e) => {
            setSearchField(e.currentTarget.value);
          }}
        />
      </div>
      {isRequestDataLoading ? (
        <LoadingFallback />
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
                      {/* {"True" === "True" ? (
                      <span className="text-red-500 font-bold drop-shadow">
                        Red Light
                      </span>
                    ) : (
                      ""
                    )} */}
                    </td>
                    <td className="text-xs lg:text-sm xl:text-base | whitespace-nowrap border break-all p-2">
                      {request.Amount}
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
