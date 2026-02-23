import EmployeeSectionMappings from "../../../dummies/Approval.json" with { type: "json" };

import TipBox from "../../reusable/TipBox.tsx";
import MultiselectionInputTwoFilter from "../../reusable/inputs/MultiselectionInputTwoFilter.tsx";
import type { FourthStepInputs } from "../../../pages/Submit.tsx";

const STEP = 4;

interface FifthStepProps {
  progressSetter: React.Dispatch<React.SetStateAction<number[]>>;
  fourthStepInputsGetter: FourthStepInputs;
  fourthStepInputsSetter: React.Dispatch<
    React.SetStateAction<FourthStepInputs>
  >;
  fourthStepInputsDefaultValue: FourthStepInputs;
}

const FourthStep = ({
  progressSetter,
  fourthStepInputsGetter,
  fourthStepInputsSetter,
  fourthStepInputsDefaultValue,
}: FifthStepProps) => {
  const onChangeHandler =
    (field: keyof FourthStepInputs) => (newSelections: string[]) => {
      fourthStepInputsSetter((prev) => ({
        ...prev,
        [field]: newSelections,
      }));
    };

  return (
    <div className="rounded-2xl bg-green-100 p-8 flex flex-col gap-4 flex-1 w-full">
      <h1 className="text-3xl font-bold text-green-600">Step 4</h1>
      <TipBox
        label={`Special Releaser will available if you have \"Red Light\"`}
        variant="green"
      />
      <TipBox
        label={`Check again your approver before you submit your PR Form`}
        variant="green"
      />
      <MultiselectionInputTwoFilter
        label="Approver"
        defaultFilterName="approver-section"
        defaultFilterId="approver-section"
        revealedFilterName="approver-name"
        revealedFilterId="approver-name"
        requiredInput
        color="green"
        colorIntensity="600"
        defaultFilterDefaultValue="Select Section"
        revealedFilterDefaultValue="Select Approver"
        mappings={EmployeeSectionMappings}
        selections={fourthStepInputsGetter.approver}
        onSelectionsChange={onChangeHandler("approver")}
      />
      <MultiselectionInputTwoFilter
        label="Releaser"
        defaultFilterName="releaser-section"
        defaultFilterId="releaser-section"
        revealedFilterName="releaser-name"
        revealedFilterId="releaser-name"
        requiredInput
        color="green"
        colorIntensity="600"
        defaultFilterDefaultValue="Select Section"
        revealedFilterDefaultValue="Select Releaser"
        mappings={EmployeeSectionMappings}
        selections={fourthStepInputsGetter.releaser}
        onSelectionsChange={onChangeHandler("releaser")}
      />
      <MultiselectionInputTwoFilter
        label="Administrator"
        defaultFilterName="administrator-section"
        defaultFilterId="administrator-section"
        revealedFilterName="administrator-name"
        revealedFilterId="administrator-name"
        requiredInput
        color="green"
        colorIntensity="600"
        defaultFilterDefaultValue="Select Section"
        revealedFilterDefaultValue="Select Administrator"
        mappings={EmployeeSectionMappings}
        selections={fourthStepInputsGetter.administrator}
        onSelectionsChange={onChangeHandler("administrator")}
      />
      <div className="flex gap-2">
        <div
          className="bg-black hover:bg-black/70 active:bg-black/85 | px-4 py-2 border rounded-2xl border-black font-bold tracking-wide text-white select-none"
          onClick={() => {
            progressSetter((prev) => prev.filter((num) => num !== STEP));
            fourthStepInputsSetter(fourthStepInputsDefaultValue);
            console.log(fourthStepInputsGetter);
          }}
        >
          Clear
        </div>
        <div
          className="bg-black hover:bg-black/70 active:bg-black/85 | px-4 py-2 border rounded-2xl border-black font-bold tracking-wide text-white select-none"
          onClick={() => {
            progressSetter((prev) => [...prev, STEP]);
            console.log(fourthStepInputsGetter);
          }}
        >
          Next
        </div>
      </div>
    </div>
  );
};

export default FourthStep;
