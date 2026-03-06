import { useState } from "react";
import RemovableSelections from "../RemovableSelections.tsx";

interface TwoFilterStringToStringMapping {
  filter: string;
  subfilters: string[];
}

interface MultiselectionInputTwoFilterProps {
  label: string;
  defaultFilterName: string;
  defaultFilterId: string;
  revealedFilterName: string;
  revealedFilterId: string;
  requiredInput: boolean;
  color: string;
  colorIntensity: string;
  defaultFilterDefaultValue: string;
  revealedFilterDefaultValue: string;
  mappings: TwoFilterStringToStringMapping[];
  selections: string[];
  onSelectionsChange: (newSelections: string[]) => void;
}

const MultiselectionInputTwoFilter = ({
  label,
  defaultFilterName,
  defaultFilterId,
  revealedFilterName,
  revealedFilterId,
  requiredInput,
  color,
  colorIntensity,
  defaultFilterDefaultValue,
  revealedFilterDefaultValue,
  mappings,
  selections,
  onSelectionsChange,
}: MultiselectionInputTwoFilterProps) => {
  const [defaultFilter, setDefaultFilter] = useState<string | undefined>(
    undefined,
  );
  const [revealedFilter, setRevealedFilter] = useState<string | undefined>(
    undefined,
  );

  return (
    <div className="flex flex-col">
      <div className="h-8 lg:h-9 xl:h-10 | flex">
        <div
          className={`text-xs lg:text-sm xl:text-base | font-bold rounded-tl-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-${color}-${colorIntensity} bg-${color}-${colorIntensity} text-white select-none`}
        >
          {label}
          {requiredInput ? "*" : ""}
        </div>
        <select
          name={defaultFilterName}
          id={defaultFilterId}
          className={`text-xs lg:text-sm xl:text-base | w-full h-full px-4 border border-${color}-${colorIntensity} text-${color}-${colorIntensity} bg-white/50 outline-none flex-1`}
          onChange={(e) => {
            if (revealedFilter !== undefined) {
              setRevealedFilter("");
            }
            const newDefaultFilter = e.target.value;
            setDefaultFilter(newDefaultFilter);
          }}
          value={defaultFilter}
          defaultValue=""
        >
          <option value="" disabled>
            {defaultFilterDefaultValue}
          </option>
          {mappings.map((mapping, index) => {
            return (
              <option key={index} value={mapping.filter}>
                {mapping.filter}
              </option>
            );
          })}
        </select>
        <select
          name={revealedFilterName}
          id={revealedFilterId}
          className={`text-xs lg:text-sm xl:text-base | w-full rounded-tr-xl h-full px-4 border border-${color}-${colorIntensity} text-${color}-${colorIntensity} bg-white/50 outline-none flex-1`}
          onChange={(e) => {
            const newRevealedFilter = e.target.value;
            setRevealedFilter("");
            onSelectionsChange([...selections, newRevealedFilter]);
          }}
          value={revealedFilter}
          defaultValue=""
        >
          <option value="" disabled>
            {revealedFilterDefaultValue}
          </option>
          {mappings
            .find((mapping) => mapping.filter === defaultFilter)
            ?.subfilters.filter((member) => !selections.includes(member))
            .map((member, index) => {
              return (
                <option key={index} value={member}>
                  {member}
                </option>
              );
            })}
        </select>
      </div>
      <RemovableSelections
        variant="green"
        array={selections}
        arraySetter={onSelectionsChange}
        getLabel={(inputString) => inputString}
      />
    </div>
  );
};

export default MultiselectionInputTwoFilter;
