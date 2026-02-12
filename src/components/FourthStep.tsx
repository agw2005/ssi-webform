import EmployeeSectionMappings from "../dummies/Approval.json";
import TipBox from "./TipBox";
import MultiselectionInputTwoFilter from "./MultiselectionInputTwoFilter";

const FourthStep = () => {
  return (
    <div className="rounded-2xl bg-green-100 p-8 flex flex-col gap-4 flex-1 w-full">
      <h1 className="text-3xl font-bold text-green-600">Step 4</h1>
      <TipBox
        label={`Special Releaser will available if you have \"Red Light\"`}
        color="green"
        colorIntensity="900"
      />
      <TipBox
        label={`Check again your approver before you submit your PR Form`}
        color="green"
        colorIntensity="900"
      />
      <MultiselectionInputTwoFilter
        label="Approver"
        defaultFilterName="approver-section"
        defaultFilterId="approver-section"
        revealedFilterName="approver-name"
        revealedFilterId="approver-name"
        requiredInput={true}
        color="green"
        colorIntensity="600"
        defaultFilterDefaultValue="Select Section"
        revealedFilterDefaultValue="Select Approver"
        mappings={EmployeeSectionMappings}
      />
      <MultiselectionInputTwoFilter
        label="Releaser"
        defaultFilterName="releaser-section"
        defaultFilterId="releaser-section"
        revealedFilterName="releaser-name"
        revealedFilterId="releaser-name"
        requiredInput={true}
        color="green"
        colorIntensity="600"
        defaultFilterDefaultValue="Select Section"
        revealedFilterDefaultValue="Select Releaser"
        mappings={EmployeeSectionMappings}
      />
      <MultiselectionInputTwoFilter
        label="Administrator"
        defaultFilterName="administrator-section"
        defaultFilterId="administrator-section"
        revealedFilterName="administrator-name"
        revealedFilterId="administrator-name"
        requiredInput={true}
        color="green"
        colorIntensity="600"
        defaultFilterDefaultValue="Select Section"
        revealedFilterDefaultValue="Select Administrator"
        mappings={EmployeeSectionMappings}
      />
      <div className="flex gap-2">
        <div className="bg-black hover:bg-black/70 active:bg-black/85 | px-4 py-2 border rounded-2xl border-black font-bold tracking-wide text-white select-none">
          Clear
        </div>
        <div className="bg-black hover:bg-black/70 active:bg-black/85 | px-4 py-2 border rounded-2xl border-black font-bold tracking-wide text-white select-none">
          Next
        </div>
      </div>
    </div>
  );
};

export default FourthStep;
