import Primitive from "../components/Primitive.tsx";
import FilterSection from "../components/FilterSection.tsx";
import FilterStatus from "../components/FilterStatus.tsx";
import FilterEmployee from "../components/FilterEmployee.tsx";
import FilterDateRange from "../components/FilterDateRange.tsx";
import FilterPagingRange from "../components/FilterPagingRange.tsx";
import Search from "../components/Search.tsx";
import Placeholders from "../dummies/HomeTable.json";

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

const NUM_CONTENT = Placeholders.length;

const Home = () => {
  return (
    <Primitive>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <FilterSection />
          <FilterStatus />
          <FilterEmployee />
          <FilterDateRange />
          <FilterPagingRange />
        </div>
        <Search />
      </div>
      <table className="table-auto border-collapse min-w-full max-w-full mt-4">
        <thead>
          <tr>
            {COLUMNS.map((column, index) => {
              return (
                <th
                  key={index}
                  className="border p-2 bg-blue-800 text-white border-black"
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
                <td className="break-all border p-2">
                  {placeholder["ID Trace"]}
                </td>
                <td className="border p-2 min-w-28 text-center">
                  {placeholder["Red Light Status"]}
                </td>
                <td className="break-all border p-2">
                  {placeholder["Subject"]}
                </td>
                <td className="break-all border p-2">
                  {placeholder["Amount"]}
                </td>
                <td className="break-all border p-2">
                  {placeholder["Requestor"]}
                </td>
                <td className="border min-w-full text-center p-2">
                  {placeholder["Status"]}
                </td>
                <td className="break-all border p-2">
                  {placeholder["Supervisor"]}
                </td>
                <td className="border text-center min-w-32 p-2">
                  {placeholder["Submit Date"]}
                </td>
                <td className="border text-center min-w-16 p-2">
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
