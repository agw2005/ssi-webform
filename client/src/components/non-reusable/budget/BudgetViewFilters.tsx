import type { ColorVariant } from "../../../helper/tailwindColorResolver.ts";
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
        <SelectionInput
          label="Period"
          name="budget-view-period"
          id="budget-view-period"
          variant={variants}
          requiredInput={false}
          defaultDisabledValue="Show All"
          options={["Show All", ...periods]}
          value={periodValue}
          onChangeHandler={periodOnChange}
        />
      </div>
    </>
  );
};

export default BudgetViewFilters;
