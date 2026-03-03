import Primitive from "../components/reusable/Primitive.tsx";
import SelectionInput from "../components/reusable/inputs/SelectionInput.tsx";
import NumberInput from "../components/reusable/inputs/NumberInput.tsx";
import DateRangeInput from "../components/reusable/inputs/DateRangeInput.tsx";
import TextInput from "../components/reusable/inputs/TextInput.tsx";
import { Link } from "react-router-dom";
import { useState } from "react";
import type { SectionNames, SupervisorNames, FormRequest } from "@scope/server";
import LoadingFallback from "../components/reusable/LoadingFallback.tsx";
import useFetch from "../hooks/useFetch.tsx";
import capitalize from "../helper/capitalize.ts";

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

const SECTION_NAMES_URL = "http://localhost:8000/section/names";
const SUPERVISOR_NAMES_URL = "http://localhost:8000/usermaster/names";
const REQUESTS_URL = "http://localhost:8000/trace/requests/100/1";

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

const Home = () => {
  const [sectionFilter, setSectionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [supervisorFilter, setSupervisorFilter] = useState("");
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
  } = useFetch<SectionNames>(SECTION_NAMES_URL);

  const {
    data: supervisorNames,
    isLoading: isSupervisorLoading,
    isError: supervisorError,
  } = useFetch<SupervisorNames>(SUPERVISOR_NAMES_URL);

  const {
    data: requests,
    isLoading: isRequestsLoading,
    isError: isRequestsError,
  } = useFetch<FormRequest>(REQUESTS_URL);

  if (isSectionLoading || isSupervisorLoading || isRequestsLoading) {
    return <LoadingFallback />;
  }

  if (sectionError || supervisorError || isRequestsError) {
    return (
      <div className="m-4">
        <div>Something unexpected happened.</div>
        {sectionError ? sectionError.message : ""}
        {supervisorError ? supervisorError.message : ""}
        {isRequestsError ? isRequestsError.message : ""}
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
          value={sectionFilter}
          onChangeHandler={(e) => setSectionFilter(e.target.value)}
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
            ...(!supervisorNames
              ? []
              : supervisorNames.map((supervisor) =>
                  capitalize(supervisor.NameUser),
                )),
          ]}
          value={supervisorFilter}
          onChangeHandler={(e) => setSupervisorFilter(e.currentTarget.value)}
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
                    {capitalize(request.CurrentSupervisor)}
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
    </Primitive>
  );
};

export default Home;
