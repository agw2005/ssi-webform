import Primitive from "../components/Primitive.tsx";
import Placeholders from "../dummies/HomeTable.json" with { type: "json" };
import SelectionInput from "../components/SelectionInput.tsx";
import NumberInput from "../components/NumberInput.tsx";
import DateRangeInput from "../components/DateRangeInput.tsx";
import TextInput from "../components/TextInput.tsx";
import { Link } from "react-router-dom";
import { useState } from "react";

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

const SECTIONS = [
  "All Section",
  "MIS",
  "GA & Personnel",
  "Accounting",
  "Purchasing",
  "PSC",
  "BM (HRDC)",
  "RnD",
  "EC QA-QC",
  "EXIM",
  "Material-Control",
  "FG WHSE",
  "EC Equipment Engineering OPTO",
  "EC Production OPTO",
  "EC Process Engineering OPTO",
  "FCS",
  "Process Control",
  "Job Innovation",
  "Product Innovation",
  "Management",
  "EC Equipment Engineering Compound",
  "EC Process Engineering Compound",
  "EC Production Compound",
];

const STATUSES = ["All Status", "Final Approved", "In Progress", "Rejected"];
const EMPLOYEES = [
  "All Supervisor",
  "Administrator",
  "Person 1",
  "Person 2",
  "Person 3",
];

const Home = () => {
  const [sectionFilter, setSectionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [supervisorFilter, setSupervisorFilter] = useState("");
  const [pagingRange, setPagingRange] = useState(20);
  const [startingDate, setStartingDate] = useState("");
  const [endingDate, setEndingDate] = useState("");
  const [searchField, setSearchField] = useState("");

  return (
    <Primitive>
      <div className="flex gap-2 flex-wrap">
        <SelectionInput
          label="Section"
          name="filter-section"
          id="filter-section"
          variant="red"
          requiredInput={false}
          defaultDisabledValue="All Section"
          options={SECTIONS}
          value={sectionFilter}
          onChangeHandler={(e) => setSectionFilter(e.target.value)}
        />
        <SelectionInput
          label="Status"
          name="filter-status"
          id="filter-status"
          variant="red"
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
          variant="red"
          requiredInput={false}
          defaultDisabledValue="All Supervisor"
          options={EMPLOYEES}
          value={supervisorFilter}
          onChangeHandler={(e) => setSupervisorFilter(e.currentTarget.value)}
        />
        <DateRangeInput
          name="filter-date-range"
          id="filter-date-range"
          variant="red"
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
          variant="red"
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
          variant="red"
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
