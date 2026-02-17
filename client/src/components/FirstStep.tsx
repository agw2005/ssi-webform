import TextInput from "./TextInput.tsx";
import TextInputBetweenLabel from "./TextInputBetweenLabel.tsx";
import SelectionInput from "./SelectionInput.tsx";
import SelectionInputBetweenLabel from "./SelectionInputBetweenLabel.tsx";
import DEPARTMENTS from "../dummies/Departments.json" with { type: "json" };
import type { FirstStepInputs } from "../pages/Submit.tsx";
import { createGenericChangeHandler } from "../helper/genericInputHandler.ts";

const SECTIONS = [
  "MIS",
  "GA & Personnel",
  "Accounting",
  "Purchasing",
  "PSC",
  "BM (HRDC)",
  "RnD",
  "EC QA-QC",
  "EXIM",
  "Material-Control",
  "FG WHSE",
  "EC Equipment Engineering OPTO",
  "EC Production OPTO",
  "EC Process Engineering OPTO",
  "FCS",
  "Process Control",
  "Job Innovation",
  "Product Innovation",
  "Management",
  "EC Equipment Engineering Compound",
  "EC Process Engineering Compound",
  "EC Production Compound",
];
const FILE_RESOURCES = ["EXIM", "FCS", "GA", "MC", "MIS"];
const FORMS = ["PR", "Cash Advance", "Fixed Asset"];
const STEP = 1;

interface FirstStepProps {
  progressSetter: React.Dispatch<React.SetStateAction<number[]>>;
  firstStepInputsGetter: FirstStepInputs;
  firstStepInputsInputsSetter: React.Dispatch<
    React.SetStateAction<FirstStepInputs>
  >;
  firstStepInputsDefaultValue: FirstStepInputs;
}

const FirstStep = ({
  progressSetter,
  firstStepInputsGetter,
  firstStepInputsInputsSetter,
  firstStepInputsDefaultValue,
}: FirstStepProps) => {
  const genericChangeHandler = createGenericChangeHandler(
    firstStepInputsInputsSetter,
  );

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
        options={SECTIONS}
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
        options={FILE_RESOURCES}
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
        mappings={DEPARTMENTS}
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
            progressSetter((prev) => [...prev, STEP]);
            console.log(firstStepInputsGetter);
          }}
        >
          Next
        </div>
      </div>
    </div>
  );
};

export default FirstStep;
