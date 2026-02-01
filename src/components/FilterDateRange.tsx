const FilterDateRange = () => {
  return (
    <div className="flex">
      <div className="text-xs lg:text-sm xl:text-base | h-8 lg:h-9 xl:h-10 | border rounded-l-xl py-2 px-4 bg-black text-white border-black text-center select-none">
        Date from
      </div>
      <input
        type="date"
        id="datefrom"
        name="datefrom"
        className="text-xs lg:text-sm xl:text-base | h-8 lg:h-9 xl:h-10 | py-2 px-4 border outline-none"
      />
      <div className="text-xs lg:text-sm xl:text-base | h-8 lg:h-9 xl:h-10 | border py-2 px-4 bg-black text-white border-black text-center select-none">
        to
      </div>
      <input
        type="date"
        id="dateto"
        name="dateto"
        className="text-xs lg:text-sm xl:text-base | h-8 lg:h-9 xl:h-10 | rounded-r-xl py-2 px-4 border outline-none select-none"
      />
    </div>
  );
};

export default FilterDateRange;
