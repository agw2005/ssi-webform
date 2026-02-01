const FilterDateRange = () => {
  return (
    <div className="flex">
      <div className="border rounded-l-xl h-10 py-2 px-4 bg-black text-white border-black text-center select-none">
        Date from
      </div>
      <input
        type="date"
        id="datefrom"
        name="datefrom"
        className="py-2 px-4 h-10 border outline-none"
      />
      <div className="border h-10 py-2 px-4 bg-black text-white border-black text-center select-none">
        to
      </div>
      <input
        type="date"
        id="dateto"
        name="dateto"
        className="rounded-r-xl py-2 px-4 h-10 border outline-none select-none"
      />
    </div>
  );
};

export default FilterDateRange;
