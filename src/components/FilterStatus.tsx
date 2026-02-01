const STATUSES = ["Final Approved", "In Progress", "Rejected"];

const FilterStatus = () => {
  return (
    <select
      name="filter-status"
      id="filter-status"
      className="text-xs lg:text-sm xl:text-base | max-w-32 lg:max-w-40 xl:max-w-48 | py-2 px-4 h-10 rounded-xl border"
    >
      <option value="All Status">All Status</option>
      {STATUSES.map((status, index) => {
        return (
          <option key={index} value={status}>
            {status}
          </option>
        );
      })}
    </select>
  );
};

export default FilterStatus;
