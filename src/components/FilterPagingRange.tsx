import { useState } from "react";

const FilterPagingRange = () => {
  const [pagingLimit, setPagingLimit] = useState(1);

  return (
    <div className="flex">
      <div className="text-xs lg:text-sm xl:text-base | h-8 lg:h-9 xl:h-10 | border rounded-l-xl flex items-center px-4 bg-black text-white border-black text-center select-none">
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
        className="text-xs lg:text-sm xl:text-base | h-8 lg:h-9 xl:h-10 | rounded-r-xl px-4 border outline-none max-w-24 text-center"
      />
    </div>
  );
};

export default FilterPagingRange;
