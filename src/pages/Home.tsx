import Primitive from "../components/Primitive.tsx";
import FilterSection from "../components/FilterSection.tsx";
import FilterStatus from "../components/FilterStatus.tsx";
import FilterEmployee from "../components/FilterEmployee.tsx";
import FilterDateRange from "../components/FilterDateRange.tsx";
import FilterPagingRange from "../components/FilterPagingRange.tsx";
import Search from "../components/Search.tsx";
import Placeholders from "../dummies/HomeTable.json";
import { Link } from "react-router-dom";

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

const Home = () => {
  return (
    <Primitive>
      <div className="flex justify-between gap-2 flex-wrap">
        <div className="flex flex-wrap gap-2">
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
