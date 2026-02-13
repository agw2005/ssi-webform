import type { ColorVariant } from "../helper/tailwindColorResolver.ts";
import { resolveColorMappings } from "../helper/tailwindColorResolver.ts";

interface RemovableSelectionsProps<T> {
  variant: ColorVariant;
  array: T[];
  arraySetter: (newArray: T[]) => void;
  getLabel: (item: T) => string;
}

const RemovableSelections = <T,>({
  variant,
  array,
  arraySetter,
  getLabel,
}: RemovableSelectionsProps<T>) => {
  return (
    <div
      className={`text-xs lg:text-sm xl:text-base | w-full flex flex-wrap gap-2 min-h-10 font-bold rounded-b-xl justify-self-center border ${resolveColorMappings(variant, "itemsStorage")} text-white select-none p-2`}
    >
      {array.map((selection, index) => {
        return (
          <div className="flex" key={index}>
            <div
              className={`text-xs lg:text-sm | font-normal ${resolveColorMappings(variant, "label")} rounded-l-xl p-2 flex items-center | to-handle-long-texts:( min-w-0 truncate max-w-64 )`}
            >
              {getLabel(selection)}
            </div>
            <div
              className="text-xs lg:text-sm | bg-red-900 hover:bg-red-900/85 active:bg-red-900/70 | font-normal rounded-r-xl p-2 text-white"
              onClick={() => {
                const newSelections = array.filter((_, idx) => idx !== index);
                arraySetter(newSelections);
              }}
            >
              X
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RemovableSelections;
