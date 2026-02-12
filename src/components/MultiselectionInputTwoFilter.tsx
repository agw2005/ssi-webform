import { useState } from "react";
import RemovableSelections from "./RemovableSelections";

interface TwoFilterStringToStringMapping {
  section: string;
  members: string[];
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
}: MultiselectionInputTwoFilterProps) => {
  const [selections, setSelections] = useState<string[]>([]);
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
        >
          <option value="" disabled selected>
            {defaultFilterDefaultValue}
          </option>
          {mappings.map((mapping, index) => {
            return (
              <option key={index} value={mapping.section}>
                {mapping.section}
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
            setSelections([...selections, newRevealedFilter]);
          }}
          value={revealedFilter}
        >
          <option value="" disabled selected>
            {revealedFilterDefaultValue}
          </option>
          {mappings
            .find((mapping) => mapping.section === defaultFilter)
            ?.members.map((member, index) => {
              return (
                <option key={index} value={member}>
                  {member}
                </option>
              );
            })}
        </select>
      </div>
      <RemovableSelections
        color="green"
        colorIntensity="600"
        array={selections}
        arraySetter={setSelections}
        getLabel={(inputString) => inputString}
      />
    </div>
  );
};

export default MultiselectionInputTwoFilter;
