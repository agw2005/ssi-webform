import type { ColorVariant } from "../helper/tailwindColorResolver.ts";
import { resolveColorMappings } from "../helper/tailwindColorResolver.ts";

interface SelectionInputProps {
  label: string;
  name: string;
  id: string;
  requiredInput: boolean;
  variant: ColorVariant;
  defaultDisabledValue: string;
  options: string[];
}

const SelectionInput = ({
  label,
  name,
  id,
  variant,
  requiredInput,
  defaultDisabledValue,
  options,
}: SelectionInputProps) => {
  return (
    <div className="h-8 lg:h-9 xl:h-10 | flex">
      <div
        className={`text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 ${resolveColorMappings(variant, "label")} text-white select-none`}
      >
        {label}
        {requiredInput ? "*" : ""}
      </div>
      <select
        name={name}
        id={id}
        className={`text-xs lg:text-sm xl:text-base | flex-1 h-full px-4 rounded-r-xl border ${resolveColorMappings(variant, "input")} bg-white/50 outline-none`}
        defaultValue=""
      >
        <option value="" disabled>
          {defaultDisabledValue}
        </option>
        {options.map((section: string, index: number) => {
          return (
            <option key={index} value={section}>
              {section}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default SelectionInput;
