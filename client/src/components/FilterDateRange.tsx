const FilterDateRange = () => {
  return (
    <div className="flex">
      <div className="text-xs lg:text-sm xl:text-base | h-8 lg:h-9 xl:h-10 | px-2 lg:px-3 xl:px-4 | flex items-center border rounded-l-xl py-2 bg-black text-white border-black text-center select-none">
        <p>Date from</p>
      </div>
      <input
        type="date"
        id="datefrom"
        name="datefrom"
        className="text-xs lg:text-sm xl:text-base | h-8 lg:h-9 xl:h-10 | px-2 lg:px-3 xl:px-4 | border outline-none"
      />
      <div className="text-xs lg:text-sm xl:text-base | h-8 lg:h-9 xl:h-10 | px-2 lg:px-3 xl:px-4 | flex items-center border py-2 bg-black text-white border-black text-center select-none">
        <p>to</p>
      </div>
      <input
        type="date"
        id="dateto"
        name="dateto"
        className="text-xs lg:text-sm xl:text-base | h-8 lg:h-9 xl:h-10 | px-2 lg:px-3 xl:px-4 | rounded-r-xl border outline-none select-none"
      />
    </div>
  );
};

export default FilterDateRange;
