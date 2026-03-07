import TextInput from "../../reusable/inputs/TextInput.tsx";
import TextInputBetweenLabel from "../../reusable/inputs/TextInputBetweenLabel.tsx";
import SelectionInput from "../../reusable/inputs/SelectionInput.tsx";
import SelectionInputBetweenLabel from "../../reusable/inputs/SelectionInputBetweenLabel.tsx";
import type { FirstStepInputs } from "../../../pages/Submit.tsx";
import { createGenericChangeHandler } from "../../../helper/genericInputHandler.ts";
import fileResourceFetchHandler from "../../../helper/fileResourceFetchHandler.ts";
import type { Department, FileResource, SectionName } from "@scope/server";

const FORMS = ["PR", "Cash Advance", "Fixed Asset"];
const STEP = 1;

const EMPTY_FIELDS_WARNING =
  "One or more required fields are empty. Please fill them out before proceeding.";

interface FirstStepProps {
  progressSetter: React.Dispatch<React.SetStateAction<number[]>>;
  firstStepInputsGetter: FirstStepInputs;
  firstStepInputsInputsSetter: React.Dispatch<
    React.SetStateAction<FirstStepInputs>
  >;
  firstStepInputsDefaultValue: FirstStepInputs;
  sectionNames: SectionName[] | null;
  fileResources: FileResource[] | null;
  departments: Department[] | null;
}

const FirstStep = ({
  progressSetter,
  firstStepInputsGetter,
  firstStepInputsInputsSetter,
  firstStepInputsDefaultValue,
  sectionNames,
  fileResources,
  departments,
}: FirstStepProps) => {
  const genericChangeHandler = createGenericChangeHandler(
    firstStepInputsInputsSetter,
  );

  const requiredFieldsAreEmpty = () => {
    if (
      firstStepInputsGetter.name === firstStepInputsDefaultValue.name ||
      firstStepInputsGetter.section === firstStepInputsDefaultValue.section ||
      firstStepInputsGetter.nrp === firstStepInputsDefaultValue.nrp ||
      firstStepInputsGetter.email === firstStepInputsDefaultValue.email ||
      firstStepInputsGetter.fileResource ===
        firstStepInputsDefaultValue.fileResource ||
      firstStepInputsGetter.department ===
        firstStepInputsDefaultValue.department ||
      firstStepInputsGetter.form === firstStepInputsDefaultValue.form
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="rounded-2xl bg-red-100 p-8 flex flex-col gap-4 flex-1">
      <h1 className="text-3xl font-bold text-red-600">Step 1</h1>
      <TextInput
        label="Your Name"
        name="your-name"
        id="your-name"
        variant="red"
        requiredInput
        value={firstStepInputsGetter.name}
        onChangeHandler={genericChangeHandler("name")}
      />
      <SelectionInput
        label="Your Section"
        name="your-section"
        id="your-section"
        requiredInput
        variant="red"
        defaultDisabledValue="Select Section"
        options={
          !sectionNames
            ? []
            : sectionNames?.map((section) => section.SectionName)
        }
        value={firstStepInputsGetter.section}
        onChangeHandler={genericChangeHandler("section")}
      />
      <TextInput
        label="Employee No. (NRP)"
        name="your-employee-number"
        id="your-employee-number"
        variant="red"
        requiredInput
        value={firstStepInputsGetter.nrp}
        onChangeHandler={genericChangeHandler("nrp")}
      />
      <TextInput
        label="Ext. No."
        name="your-extension-number"
        id="your-extension-number"
        variant="red"
        requiredInput={false}
        value={firstStepInputsGetter.ext}
        onChangeHandler={genericChangeHandler("ext")}
      />
      <TextInputBetweenLabel
        leftLabel="Your E-Mail"
        rightLabel="@ssi.sharp-world.com"
        name="your-email"
        id="your-email"
        variant="red"
        requiredInput
        value={firstStepInputsGetter.email}
        onChangeHandler={genericChangeHandler("email")}
      />
      <SelectionInput
        label="File Resource"
        name="file-resource"
        id="file-resource"
        requiredInput
        variant="red"
        defaultDisabledValue="Select File Resource"
        options={fileResourceFetchHandler(fileResources)}
        value={firstStepInputsGetter.fileResource}
        onChangeHandler={genericChangeHandler("fileResource")}
      />
      <SelectionInputBetweenLabel
        label="Department"
        name="department"
        id="department"
        requiredInput
        variant="red"
        defaultDisabledValue="Select Department Code"
        mappings={
          !departments
            ? []
            : departments.map((department) => ({
                code: department.CostCenter,
                label: department.Description,
              }))
        }
        value={firstStepInputsGetter.department}
        onChangeHandler={genericChangeHandler("department")}
      />
      <SelectionInput
        label="Select Form"
        name="form"
        id="form"
        requiredInput
        variant="red"
        defaultDisabledValue="Select Form"
        options={FORMS}
        value={firstStepInputsGetter.form}
        onChangeHandler={genericChangeHandler("form")}
      />
      <div className="flex gap-2">
        <div
          className="bg-black hover:bg-black/70 active:bg-black/85 | px-4 py-2 border rounded-2xl border-black font-bold tracking-wide text-white select-none"
          onClick={() => {
            progressSetter((prev) => prev.filter((num) => num !== STEP));
            firstStepInputsInputsSetter(firstStepInputsDefaultValue);
            console.log(firstStepInputsGetter);
          }}
        >
          Clear
        </div>
        <div
          className="bg-black hover:bg-black/70 active:bg-black/85 | px-4 py-2 border rounded-2xl border-black font-bold tracking-wide text-white select-none"
          onClick={() => {
            if (!requiredFieldsAreEmpty()) {
              progressSetter((prev) => [...prev, STEP]);
              console.log(firstStepInputsGetter);
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

export default FirstStep;
