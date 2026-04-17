import TipBox from "../../reusable/TipBox.tsx";
import MultiselectionInputTwoFilter from "../../reusable/inputs/MultiselectionInputTwoFilter.tsx";
import userSectionReducer from "../../../helper/userSectionReducer.ts";
import type { FourthStepInputs, UserSection } from "@scope/server-ssms";

const STEP = 4;

interface FifthStepProps {
  progressSetter: React.Dispatch<React.SetStateAction<number[]>>;
  fourthStepInputsGetter: FourthStepInputs;
  fourthStepInputsSetter: React.Dispatch<
    React.SetStateAction<FourthStepInputs>
  >;
  fourthStepInputsDefaultValue: FourthStepInputs;
  userSectionMappings: UserSection[] | null;
  alertUnfilledForm: () => void;
  unremovableApprovers: string[];
  unremovableReleasers: string[];
  unremovableAdministrators: string[];
}

const FourthStep = ({
  progressSetter,
  fourthStepInputsGetter,
  fourthStepInputsSetter,
  fourthStepInputsDefaultValue,
  userSectionMappings,
  alertUnfilledForm,
  unremovableApprovers,
  unremovableReleasers,
  unremovableAdministrators,
}: FifthStepProps) => {
  const onChangeHandler =
    (field: keyof FourthStepInputs) => (newSelections: string[]) => {
      fourthStepInputsSetter((prev) => ({
        ...prev,
        [field]: newSelections,
      }));
    };

  const requiredFieldsAreEmpty = () => {
    const hasNoApprover = fourthStepInputsGetter.approver.length === 0;
    const hasNoReleaser = fourthStepInputsGetter.releaser.length === 0;
    const hasNoAdmin = fourthStepInputsGetter.administrator.length === 0;
    return hasNoApprover || hasNoReleaser || hasNoAdmin;
  };

  return (
    <div className="rounded-2xl bg-green-100 p-8 flex flex-col gap-4 flex-1 w-full">
      <h1 className="text-3xl font-bold text-green-600">Step 4</h1>
      {
        /* <TipBox
        label={`Special Releaser will available if you have \"Red Light\"`}
        variant="green"
      /> */
      }
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
        mappings={!userSectionMappings
          ? []
          : userSectionReducer(userSectionMappings).map((mapping) => ({
            filter: mapping.domain,
            subfilters: mapping.subdomain,
          }))}
        selections={fourthStepInputsGetter.approver}
        defaultSelections={unremovableApprovers}
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
        mappings={!userSectionMappings
          ? []
          : userSectionReducer(userSectionMappings).map((mapping) => ({
            filter: mapping.domain,
            subfilters: mapping.subdomain,
          }))}
        selections={fourthStepInputsGetter.releaser}
        defaultSelections={unremovableReleasers}
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
        mappings={!userSectionMappings
          ? []
          : userSectionReducer(userSectionMappings).map((mapping) => ({
            filter: mapping.domain,
            subfilters: mapping.subdomain,
          }))}
        selections={fourthStepInputsGetter.administrator}
        defaultSelections={unremovableAdministrators}
        onSelectionsChange={onChangeHandler("administrator")}
      />
      <div className="flex gap-2">
        <div
          className="bg-black hover:bg-black/70 active:bg-black/85 | px-4 py-2 border rounded-2xl border-black font-bold tracking-wide text-white select-none"
          onClick={() => {
            progressSetter((prev) => prev.filter((num) => num !== STEP));
            fourthStepInputsSetter(fourthStepInputsDefaultValue);
          }}
        >
          Clear
        </div>
        <div
          className="bg-black hover:bg-black/70 active:bg-black/85 | px-4 py-2 border rounded-2xl border-black font-bold tracking-wide text-white select-none"
          onClick={() => {
            if (!requiredFieldsAreEmpty()) {
              progressSetter((prev) => [...prev, STEP]);
            } else {
              alertUnfilledForm();
            }
          }}
        >
          Next
        </div>
      </div>
    </div>
  );
};

export default FourthStep;
