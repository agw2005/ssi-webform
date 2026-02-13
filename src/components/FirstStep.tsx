import TextInput from "./TextInput";
import TextInputBetweenLabel from "./TextInputBetweenLabel";
import SelectionInput from "./SelectionInput";
import SelectionInputBetweenLabel from "./SelectionInputBetweenLabel";
import DEPARTMENTS from "../dummies/Departments.json";

interface FirstStepProps {
  progressSetter: React.Dispatch<React.SetStateAction<number[]>>;
}

const FORMS = ["PR", "Cash Advance", "Fixed Asset"];

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

const STEP = 1;

const FirstStep = ({ progressSetter }: FirstStepProps) => {
  return (
    <div className="rounded-2xl bg-red-100 p-8 flex flex-col gap-4 flex-1">
      <h1 className="text-3xl font-bold text-red-600">Step 1</h1>
      <TextInput
        label="Your Name"
        name="your-name"
        id="your-name"
        variant="red"
        requiredInput={true}
      />
      <SelectionInput
        label="Your Section"
        name="your-section"
        id="your-section"
        requiredInput={true}
        variant="red"
        defaultDisabledValue="Select Section"
        options={SECTIONS}
      />
      <TextInput
        label="Employee No. (NRP)"
        name="your-employee-number"
        id="your-employee-number"
        variant="red"
        requiredInput={true}
      />
      <TextInput
        label="Ext. No."
        name="your-extension-number"
        id="your-extension-number"
        variant="red"
        requiredInput={false}
      />
      <TextInputBetweenLabel
        leftLabel="Your E-Mail"
        rightLabel="@ssi.sharp-world.com"
        name="your-email"
        id="your-email"
        variant="red"
        requiredInput={true}
      />
      <SelectionInput
        label="File Resource"
        name="file-resource"
        id="file-resource"
        requiredInput={true}
        variant="red"
        defaultDisabledValue="Select File Resource"
        options={FILE_RESOURCES}
      />
      <SelectionInputBetweenLabel
        label="Department"
        name="department"
        id="department"
        requiredInput={true}
        variant="red"
        defaultDisabledValue="Select Department Code"
        mappings={DEPARTMENTS}
      />
      <SelectionInput
        label="Select Form"
        name="form"
        id="form"
        requiredInput={true}
        variant="red"
        defaultDisabledValue="Select Form"
        options={FORMS}
      />
      <div className="flex gap-2">
        <div
          className="bg-black hover:bg-black/70 active:bg-black/85 | px-4 py-2 border rounded-2xl border-black font-bold tracking-wide text-white select-none"
          onClick={() => {
            progressSetter((prev) => prev.filter((num) => num !== STEP));
          }}
        >
          Clear
        </div>
        <div
          className="bg-black hover:bg-black/70 active:bg-black/85 | px-4 py-2 border rounded-2xl border-black font-bold tracking-wide text-white select-none"
          onClick={() => {
            progressSetter((prev) => [...prev, STEP]);
          }}
        >
          Next
        </div>
      </div>
    </div>
  );
};

export default FirstStep;
