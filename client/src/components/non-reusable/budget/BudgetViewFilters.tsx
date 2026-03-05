import {
  resolveColorMappings,
  type ColorVariant,
} from "../../../helper/tailwindColorResolver.ts";
import SelectionInput from "../../reusable/inputs/SelectionInput.tsx";

interface BudgetViewFiltersProps {
  variants: ColorVariant;
  fileResources: string[];
  periods: string[];
  fileResourceValue: string;
  periodValue: string;
  fileResourceOnChange: (input: React.ChangeEvent<HTMLSelectElement>) => void;
  periodOnChange: (input: React.ChangeEvent<HTMLSelectElement>) => void;
}

const BudgetViewFilters = ({
  variants,
  fileResources,
  periods,
  fileResourceValue,
  periodValue,
  fileResourceOnChange,
  periodOnChange,
}: BudgetViewFiltersProps) => {
  return (
    <>
      <div className="h-8 lg:h-9 xl:h-10 | flex items-center w-max gap-2">
        <SelectionInput
          label="File Resource"
          name="budget-view-file-resource"
          id="budget-view-file-resource"
          variant={variants}
          requiredInput={false}
          defaultDisabledValue="Show All"
          options={["Show All", ...fileResources]}
          value={fileResourceValue}
          onChangeHandler={fileResourceOnChange}
        />
        <div className="h-8 lg:h-9 xl:h-10 | flex">
          <div
            className={`text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 ${resolveColorMappings(variants, "label")} text-white select-none`}
          >
            Period
          </div>
          <select
            name="budget-view-period"
            id="budget-view-period"
            className={`text-xs lg:text-sm xl:text-base | flex-1 h-full px-4 rounded-r-xl border ${resolveColorMappings(variants, "input")} outline-none`}
            value={periodValue}
            onChange={periodOnChange}
          >
            {periods.map((period: string, index: number) => {
              return (
                <option key={index} value={period}>
                  {period}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </>
  );
};

export default BudgetViewFilters;
