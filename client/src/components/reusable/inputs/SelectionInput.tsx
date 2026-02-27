import type { ColorVariant } from "../../../helper/tailwindColorResolver.ts";
import { resolveColorMappings } from "../../../helper/tailwindColorResolver.ts";

interface SelectionInputProps {
  label: string;
  name: string;
  id: string;
  requiredInput: boolean;
  variant: ColorVariant;
  isDisabled?: boolean;
  defaultDisabledValue: string;
  options: string[];
  value: string;
  onChangeHandler: (input: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectionInput = ({
  label,
  name,
  id,
  variant,
  isDisabled = false,
  requiredInput,
  defaultDisabledValue,
  options,
  value,
  onChangeHandler,
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
        className={`text-xs lg:text-sm xl:text-base | flex-1 h-full px-4 rounded-r-xl border ${resolveColorMappings(variant, "input")} ${isDisabled ? "bg-black/10" : "bg-white/50"} outline-none`}
        value={value}
        onChange={onChangeHandler}
        disabled={isDisabled}
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
