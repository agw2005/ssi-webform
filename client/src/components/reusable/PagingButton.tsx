import type { ColorVariant } from "../../helper/tailwindColorResolver.ts";
import { resolveColorMappings } from "../../helper/tailwindColorResolver.ts";

interface PagingButtonProps {
  name: string;
  id: string;
  variant: ColorVariant;
  currentPage: number;
  totalPages: number;
  onInputChangeHandler: (input: React.ChangeEvent<HTMLInputElement>) => void;
}

const PagingButton = ({
  name,
  id,
  variant,
  currentPage,
  totalPages,
  onInputChangeHandler,
}: PagingButtonProps) => {
  return (
    <div className="h-8 lg:h-9 xl:h-10 | flex">
      <div
        className={`text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 ${
          resolveColorMappings(variant, "label")
        } text-white select-none`}
      >
        Page
      </div>
      <input
        min={1}
        max={totalPages}
        type="number"
        name={name}
        id={id}
        className={`text-xs lg:text-sm xl:text-base | flex-1 px-4 text-center border ${
          resolveColorMappings(variant, "input")
        } bg-white/50 outline-none w-24`}
        value={currentPage}
        onChange={onInputChangeHandler}
      />
      <div
        className={`text-xs lg:text-sm xl:text-base | font-bold h-full rounded-r-xl justify-self-center border flex items-center px-2 border-r-0 ${
          resolveColorMappings(variant, "label")
        } text-white select-none`}
      >
        out of {totalPages}
      </div>
    </div>
  );
};

export default PagingButton;
