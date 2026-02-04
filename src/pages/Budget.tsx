import { useState } from "react";
import Primitive from "../components/Primitive.tsx";
import Placeholders from "../dummies/BudgetSearchTable.json";

const COLUMNS = [
  "File Resource",
  "Dept",
  "Sec Req",
  "Nature",
  "Description",
  "Bud_01",
  "Usage01",
  "Bud_02",
  "Usage02",
  "Bud_03",
  "Usage03",
  "Bud_04",
  "Usage04",
  "Bud_05",
  "Usage05",
  "Bud_06",
  "Usage06",
  "Bud_07",
  "Usage07",
  "Bud_08",
  "Usage08",
  "Bud_09",
  "Usage09",
  "Bud_10",
  "Usage10",
  "Bud_11",
  "Usage11",
  "Bud_12",
  "Usage12",
];
const OPTIONS = ["EXIM", "FCS", "GA", "MC", "MIS"];
const PERIODS = [
  "2025LH",
  "2025FH",
  "2024LH",
  "2024FH",
  "2023LH",
  "2023FH",
  "2022LH",
  "2022FH",
  "2021LH",
  "2021FH",
  "2020LH",
  "2020FH",
];

const Budget = () => {
  const [viewMode, setViewMode] = useState<"Budget" | "Report">("Budget");

  return (
    <Primitive>
      <div className="flex gap-2 w-max">
        <div className="h-8 lg:h-9 xl:h-10 | flex items-center w-max">
          <div
            onClick={() => {
              setViewMode("Report");
            }}
            className={`text-xs lg:text-sm xl:text-base | ${viewMode !== "Budget" ? "bg-black text-white" : "bg-white text-black hover:text-white hover:bg-gray-700"} rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-black select-none`}
          >
            View Report
          </div>
          <div
            onClick={() => {
              setViewMode("Budget");
            }}
            className={`text-xs lg:text-sm xl:text-base | ${viewMode !== "Report" ? "bg-black text-white" : "bg-white text-black hover:text-white hover:bg-gray-700"} rounded-r-xl h-full justify-self-center border flex items-center px-2 border-black select-none`}
          >
            View Budget
          </div>
        </div>
        {viewMode === "Budget" ? (
          <>
            <div className="h-8 lg:h-9 xl:h-10 | flex items-center w-max">
              <div className="text-xs lg:text-sm xl:text-base | rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-black bg-black text-white select-none">
                File Resource
              </div>
              <select
                name="file-resource"
                id="file-resource"
                className="text-xs lg:text-sm xl:text-base | h-full px-4 rounded-r-xl border outline-none"
              >
                <option value="Show All">Show All</option>
                {OPTIONS.map((option, index) => {
                  return (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="h-8 lg:h-9 xl:h-10 | flex items-center w-max">
              <div className="text-xs lg:text-sm xl:text-base | rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-black bg-black text-white select-none">
                Period
              </div>
              <select
                name="file-resource"
                id="file-resource"
                className="text-xs lg:text-sm xl:text-base | h-full px-4 rounded-r-xl border outline-none"
              >
                <option value="Show All">Show All</option>
                {PERIODS.map((option, index) => {
                  return (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="h-8 lg:h-9 xl:h-10 | text-black hover:text-white active:text-black | bg-white hover:bg-black active:bg-white | border-black hover:border-blue-900 active:border-red-900 | flex items-center border px-4 rounded-xl">
              <p className="text-xs lg:text-sm xl:text-base | select-none">
                Search
              </p>
            </div>
          </>
        ) : (
          ""
        )}
      </div>

      {viewMode === "Budget" ? (
        <div className="overflow-x-auto h-160 mt-4">
          <table className="table-auto border-collapse mt-4">
            <thead className="sticky top-0 z-10 border">
              <tr>
                {COLUMNS.map((column, index) => {
                  return (
                    <th
                      key={index}
                      className="text-xs lg:text-sm xl:text-base | border p-2 bg-blue-800 text-white border-black whitespace-nowrap text-center"
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
                    {COLUMNS.map((column, index) => {
                      return (
                        <td
                          key={index}
                          className="text-xs lg:text-sm xl:text-base | border p-2 whitespace-nowrap text-center"
                        >
                          {placeholder[column as keyof typeof placeholder]}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        ""
      )}
    </Primitive>
  );
};

export default Budget;
