import Primitive from "../components/reusable/Primitive.tsx";
import Placeholders from "../dummies/HomeTable.json" with { type: "json" };
import SelectionInput from "../components/reusable/inputs/SelectionInput.tsx";
import NumberInput from "../components/reusable/inputs/NumberInput.tsx";
import DateRangeInput from "../components/reusable/inputs/DateRangeInput.tsx";
import TextInput from "../components/reusable/inputs/TextInput.tsx";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import type { SectionNames } from "@scope/server";
import LoadingFallback from "../components/reusable/LoadingFallback.tsx";

const COLUMNS = [
  "ID Trace",
  "Red Light",
  "Subject",
  "Amount",
  "Requestor",
  "Status",
  "Supervisor",
  "Submit Date",
  "Remarks",
];

const STATUSES = ["All Status", "Final Approved", "In Progress", "Rejected"];
const EMPLOYEES = [
  "All Supervisor",
  "Administrator",
  "Person 1",
  "Person 2",
  "Person 3",
];

const SECTION_NAMES_URL = "http://localhost:8000/section/names";

const Home = () => {
  const [sectionFilter, setSectionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [supervisorFilter, setSupervisorFilter] = useState("");
  const [pagingRange, setPagingRange] = useState(20);
  const [startingDate, setStartingDate] = useState("");
  const [endingDate, setEndingDate] = useState("");
  const [searchField, setSearchField] = useState("");

  const abortControllerRef = useRef<AbortController | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sectionNames, setSectionNames] = useState<SectionNames[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      setIsLoading(true);
      try {
        const response = await fetch(SECTION_NAMES_URL, {
          signal: abortControllerRef.current?.signal,
        });
        const sectionNames: SectionNames[] = await response.json();
        setSectionNames(sectionNames);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        const error: Error = new Error(
          `Encountered an error when fetching API. Please ensure your connection is stable.\n(${err}).`,
        );
        setError(error);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (error) {
    return (
      <div className="m-4">
        <div>Something unexpected happened.</div>
        <div>Error message : {error?.message}</div>
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
          options={sectionNames.map((section) => section.SectionName)}
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
          options={EMPLOYEES}
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
          {Placeholders.map((placeholder, index) => {
            return (
              <tr key={index}>
                <td className="text-xs lg:text-sm xl:text-base | text-center border break-all p-2">
                  {placeholder["ID Trace"]}
                </td>
                <td className="text-xs lg:text-sm xl:text-base | min-w-12 lg:min-w-16 xl:min-w-20 2xl:min-w-28 | border text-center p-2">
                  {placeholder["Red Light Status"]}
                </td>
                <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                  <Link
                    className="text-blue-700 underline"
                    to={`/request/${placeholder["ID"]}`}
                  >
                    {placeholder["Subject"]}
                  </Link>
                </td>
                <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                  {placeholder["Amount"]}
                </td>
                <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                  {placeholder["Requestor"]}
                </td>
                <td className="text-xs lg:text-sm xl:text-base | border min-w-full text-center p-2">
                  {placeholder["Status"]}
                </td>
                <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                  {placeholder["Supervisor"]}
                </td>
                <td className="text-xs lg:text-sm xl:text-base | border text-center p-2">
                  {placeholder["Submit Date"]}
                </td>
                <td className="text-xs lg:text-sm xl:text-base | border min-w-16 text-center p-2">
                  {placeholder["Remarks"]}
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
