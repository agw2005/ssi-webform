import type { ColorVariant } from "../../helper/tailwindColorResolver.ts";
import { resolveColorMappings } from "../../helper/tailwindColorResolver.ts";

interface PagingButtonProps {
  variant: ColorVariant;
  currentPage: number;
  totalPages: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const PagingButton = ({
  variant,
  currentPage,
  totalPages,
  onIncrement,
  onDecrement,
}: PagingButtonProps) => {
  return (
    <div className="h-8 lg:h-9 xl:h-10 | flex">
      <div
        className={`text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 ${resolveColorMappings(variant, "button")} text-white select-none`}
        onClick={onDecrement}
      >
        -
      </div>
      <div
        className={`text-xs lg:text-sm xl:text-base | h-full justify-self-center border flex items-center px-2 border-r-0 ${resolveColorMappings(variant, "label")} text-white select-none`}
      >
        Page {currentPage} out of {totalPages}
      </div>
      <div
        className={`text-xs lg:text-sm xl:text-base | font-bold rounded-r-xl h-full justify-self-center border flex items-center px-2 border-r-0 ${resolveColorMappings(variant, "button")} text-white select-none`}
        onClick={onIncrement}
      >
        +
      </div>
    </div>
  );
};

export default PagingButton;
