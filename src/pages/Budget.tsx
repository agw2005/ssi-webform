import Primitive from "../components/Primitive";

const OPTIONS = ["EXIM", "FCS", "GA", "MC", "MIS"];

const Budget = () => {
  return (
    <Primitive>
      <div className="h-8 lg:h-9 xl:h-10 | flex gap-3 items-center">
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
    </Primitive>
  );
};

export default Budget;
