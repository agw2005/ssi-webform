import { useState } from "react";
import Primitive from "../components/reusable/Primitive.tsx";
import Placeholders from "../dummies/BudgetSearchTable.json" with { type: "json" };
import BudgetViewFilters from "../components/non-reusable/budget/BudgetViewFilters.tsx";
import Switch from "../components/reusable/Switch.tsx";

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
const FILE_RESOURCES = ["EXIM", "FCS", "GA", "MC", "MIS"];
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
  const [fileResource, setFileResource] = useState("");
  const [period, setPeriod] = useState("");

  return (
    <Primitive>
      <div className="flex gap-2 w-max">
        <Switch
          id="budget-report-view-switch"
          variant="red"
          onValue="Report"
          offValue="Budget"
          onLabel="View Report"
          offLabel="View Budget"
          setter={setViewMode}
          getter={viewMode}
        />
        {viewMode === "Budget" ? (
          <BudgetViewFilters
            fileResources={FILE_RESOURCES}
            periods={PERIODS}
            fileResourceValue={fileResource}
            periodValue={period}
            fileResourceOnChange={(e) => {
              setFileResource(e.currentTarget.value);
            }}
            periodOnChange={(e) => {
              setPeriod(e.currentTarget.value);
            }}
          />
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

      {viewMode === "Report" ? (
        <div className="mt-4 flex gap-4 flex-wrap">
          <div className="flex flex-col p-8 bg-gray-100 rounded-2xl items-start flex-1 justify-between">
            <div className="flex flex-col gap-4 items-start">
              <h2 className="text-3xl font-bold text-gray-600">
                General Report
              </h2>
              <div className="text-xs tracking-wide bg-gray-600 text-white p-2 rounded-lg">
                Budget Table
              </div>
              <div className="h-8 lg:h-9 xl:h-10 | flex items-center w-max self-end">
                <div className="text-xs lg:text-sm xl:text-base | rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-gray-600 bg-gray-600 text-white select-none">
                  File Resource
                </div>
                <select
                  name="general-report-file-resource"
                  id="general-report-file-resource"
                  className="text-xs lg:text-sm xl:text-base | h-full px-4 rounded-r-xl border border-gray-600 text-gray-600 bg-white outline-none"
                >
                  <option value="Show All">Show All</option>
                  {FILE_RESOURCES.map((option, index) => {
                    return (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="h-8 lg:h-9 xl:h-10 | flex items-center w-max self-end">
                <div className="text-xs lg:text-sm xl:text-base | rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-gray-600 bg-gray-600 text-white select-none">
                  Period
                </div>
                <select
                  name="general-report-period"
                  id="general-report-period"
                  className="text-xs lg:text-sm xl:text-base | h-full px-4 rounded-r-xl border border-gray-600 text-gray-600 bg-white outline-none"
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
            </div>
            <div className="mt-4 xl:mt-8 | hover:shadow-xl | bg-black/5 hover:bg-black/25 active:bg-white | active:text-black | shadow-md self-center px-4 py-2 border rounded-4xl select-none">
              Show Report
            </div>
          </div>

          <div className="flex flex-col p-8 bg-yellow-100 rounded-2xl items-start flex-1 justify-between">
            <div className="flex flex-col gap-4 items-start">
              <h2 className="text-3xl font-bold text-yellow-600">
                Report by Quarter
              </h2>
              <div className="text-xs tracking-wide bg-yellow-600 text-white p-2 rounded-lg">
                Summary Budget
              </div>
              <div className="h-8 lg:h-9 xl:h-10 | flex items-center w-max self-end">
                <div className="text-xs lg:text-sm xl:text-base | rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-yellow-600 bg-yellow-600 text-white select-none">
                  Month
                </div>
                <input
                  type="month"
                  name="month"
                  id="month"
                  className="text-xs lg:text-sm xl:text-base | h-full px-4 rounded-r-xl text-center border border-yellow-600 text-yellow-600 bg-white outline-none"
                />
              </div>
              <div className="h-8 lg:h-9 xl:h-10 | flex items-center w-max self-end">
                <div className="text-xs lg:text-sm xl:text-base | rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-yellow-600 bg-yellow-600 text-white select-none">
                  File Resource
                </div>
                <select
                  name="report-by-quarter-file-resource"
                  id="report-by-quarter-file-resource"
                  className="text-xs lg:text-sm xl:text-base | h-full px-4 rounded-r-xl border border-yellow-600 text-yellow-600 bg-white outline-none"
                >
                  <option value="Show All">Show All</option>
                  {FILE_RESOURCES.map((option, index) => {
                    return (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="mt-4 xl:mt-8 | hover:shadow-xl | bg-black/5 hover:bg-black/25 active:bg-white | active:text-black | shadow-md self-center px-4 py-2 border rounded-4xl select-none">
              Show Report
            </div>
          </div>

          <div className="flex flex-col p-8 bg-blue-100 rounded-2xl items-start flex-1 justify-between">
            <div className="flex flex-col gap-4 items-start">
              <h2 className="text-3xl font-bold text-blue-600">
                Report by Section
              </h2>
              <div className="text-xs tracking-wide bg-blue-600 text-white p-2 rounded-lg">
                Summary Budget
              </div>
              <div className="h-8 lg:h-9 xl:h-10 | flex items-center w-max self-center">
                <div className="text-xs lg:text-sm xl:text-base | rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-blue-600 bg-blue-600 text-white select-none">
                  Period
                </div>
                <select
                  name="report-by-section-period"
                  id="report-by-section-period"
                  className="text-xs lg:text-sm xl:text-base | h-full px-4 rounded-r-xl border border-blue-600 text-blue-600 bg-white outline-none"
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
            </div>
            <div className="mt-4 xl:mt-8 | hover:shadow-xl | bg-black/5 hover:bg-black/25 active:bg-white | active:text-black | shadow-md self-center px-4 py-2 border rounded-4xl select-none">
              Show Report
            </div>
          </div>

          <div className="flex flex-col p-8 bg-green-100 rounded-2xl items-start flex-1 justify-between">
            <div className="flex flex-col gap-4 items-start">
              <h2 className="text-3xl font-bold text-green-600">
                Report by Nature
              </h2>
              <div className="text-xs tracking-wide bg-green-600 text-white p-2 rounded-lg">
                Summary Budget
              </div>
              <div className="h-8 lg:h-9 xl:h-10 | flex items-center w-max self-center">
                <div className="text-xs lg:text-sm xl:text-base | rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-green-600 bg-green-600 text-white select-none">
                  Period
                </div>
                <select
                  name="report-by-nature-period"
                  id="report-by-nature-period"
                  className="text-xs lg:text-sm xl:text-base | h-full px-4 rounded-r-xl border border-green-600 text-green-600 bg-white outline-none"
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
            </div>
            <div className="mt-4 xl:mt-8 | hover:shadow-xl | bg-black/5 hover:bg-black/25 active:bg-white | active:text-black | shadow-md self-center px-4 py-2 border rounded-4xl select-none">
              Show Report
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </Primitive>
  );
};

export default Budget;
