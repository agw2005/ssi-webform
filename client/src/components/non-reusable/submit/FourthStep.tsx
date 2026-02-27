import TipBox from "../../reusable/TipBox.tsx";
import MultiselectionInputTwoFilter from "../../reusable/inputs/MultiselectionInputTwoFilter.tsx";
import type { FourthStepInputs } from "../../../pages/Submit.tsx";
import type { UserSection } from "../../../../../server/models/Section.d.ts";
import useFetch from "../../../hooks/useFetch.tsx";
import LoadingFallback from "../../reusable/LoadingFallback.tsx";
import userSectionReducer from "../../../helper/userSectionReducer.ts";

const STEP = 4;

const USER_SECTION_MAPPINGS_URL = "http://localhost:8000/section/users";

const EMPTY_FIELDS_WARNING =
  "One or more required fields are empty. Please fill them out before proceeding.";

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

  const requiredFieldsAreEmpty = () => {
    const hasNoApprover = fourthStepInputsGetter.approver.length === 0;
    const hasNoReleaser = fourthStepInputsGetter.releaser.length === 0;
    const hasNoAdmin = fourthStepInputsGetter.administrator.length === 0;
    return hasNoApprover || hasNoReleaser || hasNoAdmin;
  };

  const {
    data: userSectionMappings,
    isLoading: isUserSectionMappingsLoading,
    isError: isUserSectionMappingsError,
  } = useFetch<UserSection>(USER_SECTION_MAPPINGS_URL);

  if (isUserSectionMappingsLoading) {
    return <LoadingFallback />;
  }

  if (isUserSectionMappingsError) {
    return (
      <div className="m-4">
        <div>Something unexpected happened.</div>
        {isUserSectionMappingsError ? isUserSectionMappingsError.message : ""}
      </div>
    );
  }

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
        mappings={
          !userSectionMappings
            ? []
            : userSectionReducer(userSectionMappings).map((mapping) => ({
                filter: mapping.domain,
                subfilters: mapping.subdomain,
              }))
        }
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
        mappings={
          !userSectionMappings
            ? []
            : userSectionReducer(userSectionMappings).map((mapping) => ({
                filter: mapping.domain,
                subfilters: mapping.subdomain,
              }))
        }
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
        mappings={
          !userSectionMappings
            ? []
            : userSectionReducer(userSectionMappings).map((mapping) => ({
                filter: mapping.domain,
                subfilters: mapping.subdomain,
              }))
        }
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
            if (!requiredFieldsAreEmpty()) {
              progressSetter((prev) => [...prev, STEP]);
              console.log(fourthStepInputsGetter);
            } else {
              globalThis.confirm(EMPTY_FIELDS_WARNING);
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
