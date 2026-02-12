import { useState } from "react";

interface StringToStringMapping {
  code: string;
  label: string;
}

interface SelectionInputBetweenLabelProps {
  label: string;
  name: string;
  id: string;
  requiredInput: boolean;
  color: string;
  colorIntensity: string;
  defaultDisabledValue: string;
  mappings: StringToStringMapping[];
}

/**
 * Selection input that shows a right-side label according to the user selection.
 *
 * Currently, it only supports string-string mappings where the strings are both the options and the revealed labels.
 *
 */
const SelectionInputBetweenLabel = ({
  label,
  name,
  id,
  requiredInput,
  color,
  colorIntensity,
  defaultDisabledValue,
  mappings,
}: SelectionInputBetweenLabelProps) => {
  const [codeSelection, setCodeSelection] = useState<string | undefined>(
    undefined,
  );
  const [labelSelection, setLabelSelection] = useState<string | undefined>(
    undefined,
  );
  return (
    <div className="h-8 lg:h-9 xl:h-10 | flex">
      <div
        className={`text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-${color}-${colorIntensity} bg-${color}-${colorIntensity} text-white select-none`}
      >
        {label}
        {requiredInput ? "*" : ""}
      </div>
      <select
        name={name}
        id={id}
        className={`text-xs lg:text-sm xl:text-base | flex-1 h-full px-4 border ${codeSelection === undefined ? "rounded-r-xl" : ""} border-${color}-${colorIntensity} text-${color}-${colorIntensity} bg-white/50 outline-none`}
        onChange={(e) => {
          const newCodeSelection = e.target.value;
          setCodeSelection(newCodeSelection);
          setLabelSelection(
            mappings.find((mapping) => mapping.code === newCodeSelection)
              ?.label,
          );
        }}
        defaultValue=""
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
      {codeSelection === undefined ? (
        ""
      ) : (
        <div
          className={`text-xs lg:text-sm xl:text-base | whitespace-nowrap font-bold rounded-r-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-${color}-${colorIntensity} bg-${color}-${colorIntensity} text-white select-none`}
        >
          {labelSelection}
        </div>
      )}
    </div>
  );
};

export default SelectionInputBetweenLabel;
