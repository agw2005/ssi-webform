const FilterPagingRange = () => {
  return (
    <div className="flex">
      <div className="border rounded-l-xl h-10 py-2 px-4 bg-black text-white border-black text-center select-none">
        Show items
      </div>
      <input
        type="number"
        id="items-quantity"
        name="items-quantity"
        min={1}
        value={1}
        step={1}
        className="rounded-r-xl py-2 px-4 h-10 border outline-none max-w-24 text-center"
      />
    </div>
  );
};

export default FilterPagingRange;
