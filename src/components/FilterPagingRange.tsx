import { useState } from "react";

const FilterPagingRange = () => {
  const [pagingLimit, setPagingLimit] = useState(1);

  return (
    <div className="flex">
      <div className="text-xs lg:text-sm xl:text-base | h-8 lg:h-9 xl:h-10 | px-2 lg:px-3 xl:px-4 | border rounded-l-xl flex items-center bg-black text-white border-black text-center select-none">
        <p>Show items</p>
      </div>
      <input
        type="number"
        id="items-quantity"
        name="items-quantity"
        min={1}
        value={pagingLimit}
        onChange={(newLimit) =>
          setPagingLimit(Number(newLimit.currentTarget.value))
        }
        className="text-xs lg:text-sm xl:text-base | h-8 lg:h-9 xl:h-10 | px-2 lg:px-3 xl:px-4 | max-w-14 lg:max-w-16 xl:max-w-24 | rounded-r-xl border outline-none text-center"
      />
    </div>
  );
};

export default FilterPagingRange;
