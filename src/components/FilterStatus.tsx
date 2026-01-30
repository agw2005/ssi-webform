const STATUSES = ["Final Approved", "In Progress", "Rejected"];

const FilterStatus = () => {
  return (
    <select
      name="filter-status"
      id="filter-status"
      className="py-2 px-4 h-10 rounded-xl border max-w-48"
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
