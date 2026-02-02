import Primitive from "../components/Primitive";
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
  return (
    <Primitive>
      <div className="flex flex-col gap-2 w-max items-end">
        <div className="h-8 lg:h-9 xl:h-10 | flex gap-3 items-center w-max">
          <label>File Resource</label>
          <select
            name="file-resource"
            id="file-resource"
            className="text-xs lg:text-sm xl:text-base | h-full px-4 rounded-xl border"
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
        <div className="h-8 lg:h-9 xl:h-10 | flex gap-3 items-center w-max">
          <label>Period</label>
          <select
            name="file-resource"
            id="file-resource"
            className="text-xs lg:text-sm xl:text-base | h-full px-4 rounded-xl border"
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
          <p className="select-none">Search</p>
        </div>
      </div>

      <div className="overflow-x-auto h-192 mt-4">
        <table className="table-auto border-collapse min-w-full max-w-full mt-4">
          <thead className="sticky top-0 z-10 border">
            <tr>
              {COLUMNS.map((column, index) => {
                return (
                  <th
                    key={index}
                    className="text-xs lg:text-sm xl:text-base | min-w-32 border p-2 bg-blue-800 text-white border-black"
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
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["File Resource"]}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["Dept"]}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["Sec Req"]}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["Nature"]}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["Description"]}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["Bud_01"]}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["Usage01"]}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["Bud_02"]}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["Usage02"]}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["Bud_03"]}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["Usage03"]}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["Bud_04"]}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["Usage04"]}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["Bud_05"]}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["Usage05"]}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["Bud_06"]}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["Usage06"]}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["Bud_07"]}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["Usage07"]}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["Bud_08"]}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["Usage08"]}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["Bud_09"]}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["Usage09"]}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["Bud_10"]}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["Usage10"]}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["Bud_11"]}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["Usage11"]}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["Bud_12"]}
                  </td>
                  <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                    {placeholder["Usage12"]}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Primitive>
  );
};

export default Budget;
