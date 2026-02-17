import type { ColorVariant } from "../helper/tailwindColorResolver.ts";
import { resolveColorMappings } from "../helper/tailwindColorResolver.ts";

interface StringToStringMapping {
  code: string;
  label: string;
}

interface SelectionInputSeparateLabelProps {
  label: string;
  name: string;
  id: string;
  requiredInput: boolean;
  variant: ColorVariant;
  defaultDisabledValue: string;
  mappings: StringToStringMapping[];
  value: string;
  onChangeHandler: (input: React.ChangeEvent<HTMLSelectElement>) => void;
}

/**
 * Selection input that shows a label below its component according to the user selection.
 *
 * Currently, it only supports string-string mappings where the strings are both the options and the revealed labels.
 *
 */
const SelectionInputSeparateLabel = ({
  label,
  name,
  id,
  requiredInput,
  variant,
  defaultDisabledValue,
  mappings,
  value,
  onChangeHandler,
}: SelectionInputSeparateLabelProps) => {
  const selectedMapping = mappings.find((mapping) => mapping.code === value);
  const selectedLabel = selectedMapping?.label;

  return (
    <div className="flex flex-col gap-2">
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
          className={`text-xs lg:text-sm xl:text-base | flex-1 px-4 border rounded-r-xl ${resolveColorMappings(variant, "input")} bg-white/50 outline-none`}
          value={value}
          onChange={onChangeHandler}
        >
          <option value="" disabled>
            {defaultDisabledValue}
          </option>
          {mappings.map((mapping, index) => {
            return (
              <option key={index} value={mapping.code}>
                {mapping.code}
              </option>
            );
          })}
        </select>
      </div>
      {value === "" ? (
        ""
      ) : (
        <div className="h-8 lg:h-9 xl:h-10 | flex">
          <div
            className={`text-xs lg:text-sm xl:text-base | flex-1 font-bold rounded-xl h-full justify-self-center border flex items-center px-2 border-r-0 ${resolveColorMappings(variant, "label")} text-white select-none`}
          >
            {selectedLabel}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectionInputSeparateLabel;
