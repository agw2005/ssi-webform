import Primitive from "../components/Primitive";

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
    </Primitive>
  );
};

export default Budget;
