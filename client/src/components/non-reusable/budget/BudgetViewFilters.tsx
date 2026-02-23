import SelectionInput from "../../reusable/inputs/SelectionInput.tsx";

interface BudgetViewFiltersProps {
  fileResources: string[];
  periods: string[];
  fileResourceValue: string;
  periodValue: string;
  fileResourceOnChange: (input: React.ChangeEvent<HTMLSelectElement>) => void;
  periodOnChange: (input: React.ChangeEvent<HTMLSelectElement>) => void;
}

const BudgetViewFilters = ({
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
          variant="black"
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
          variant="black"
          requiredInput={false}
          defaultDisabledValue="Show All"
          options={["Show All", ...periods]}
          value={periodValue}
          onChangeHandler={periodOnChange}
        />
        <div className="h-8 lg:h-9 xl:h-10 | text-black hover:text-white active:text-black | bg-white hover:bg-black active:bg-white | border-black hover:border-blue-900 active:border-red-900 | flex items-center border px-4 rounded-xl">
          <p className="text-xs lg:text-sm xl:text-base | select-none">
            Search
          </p>
        </div>
      </div>
    </>
  );
};

export default BudgetViewFilters;
