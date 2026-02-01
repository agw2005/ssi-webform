const EMPLOYEES = ["Administrator", "Person 1", "Person 2", "Person 3"];

const FilterEmployee = () => {
  return (
    <select
      name="filter-in-charge"
      id="filter-in-charge"
      className="text-xs lg:text-sm xl:text-base | max-w-36 lg:max-w-42 xl:max-w-48 | h-8 lg:h-9 xl:h-10 | py-2 px-4 rounded-xl border"
    >
      <option value="All Supervisor">All Supervisor</option>
      {EMPLOYEES.map((employee, index) => {
        return (
          <option key={index} value={employee}>
            {employee}
          </option>
        );
      })}
    </select>
  );
};

export default FilterEmployee;
