import { useState } from "react";
import TextInput from "./TextInput";
import TextInputBetweenLabel from "./TextInputBetweenLabel";
import SelectionInput from "./SelectionInput";

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

const DEPARTMENTS = [
  { code: "101", label: "General Affair / Personal" },
  { code: "102", label: "EXIM" },
  { code: "103", label: "Accounting" },
  { code: "104", label: "EDP" },
  { code: "105", label: "Global Network" },
  { code: "106", label: "Facility Control" },
  { code: "107", label: "FG WHSE" },
  { code: "108", label: "PPC" },
  { code: "109", label: "Purchasing" },
  { code: "110", label: "Cost Control" },
  { code: "111", label: "HRDC / BM" },
  { code: "112", label: "Quality & Reliability Control" },
  { code: "200", label: "OPT Export (Common)" },
  { code: "210", label: "REMOCON Export" },
  { code: "211", label: "New Remocon Export" },
  { code: "212", label: "DDS" },
  { code: "213", label: "Smoke Sensor" },
  { code: "220", label: "Encoder GP Export" },
  { code: "230", label: "Photo Couplar 817 Export" },
  { code: "231", label: "Photo Couplar 357 Export" },
  { code: "232", label: "Photo Couplar 400 Export" },
  { code: "234", label: "Photo Couplar SOP & PIN Export" },
  { code: "240", label: "Regular TO-220 Export" },
  { code: "241", label: "Regulator SOT 23-5, L Export" },
  { code: "242", label: "Regulator SC-63 Export" },
  { code: "243", label: "Regulator New SC-63 Export" },
  { code: "244", label: "Regulator Middle Power SSR Export" },
  { code: "250", label: "Photo Interapter Export" },
  { code: "260", label: "PT / GL Export" },
  { code: "400", label: "Compound Export (Common)" },
  { code: "411", label: "Frame Laser 1.8t Export" },
  { code: "412", label: "Frame Laser 1.3t Wave Length Export" },
  { code: "413", label: "Chip Making" },
  { code: "420", label: "Hologram Laser 3.0 Export" },
  { code: "421", label: "Hologram Laser 4.8 Export" },
  { code: "422", label: "Hologram Laser 4.6 Clarion" },
  { code: "440", label: "Single Laser 3.3 Export" },
  { code: "441", label: "Single Laser 5.6 Export" },
  { code: "450", label: "Frame Holo Export" },
  { code: "600", label: "LED Export (Common)" },
  { code: "601", label: "Production QC Dept" },
  { code: "602", label: "Production Engineering Dept" },
  { code: "603", label: "Process Engineering" },
  { code: "604", label: "Material Warehouse" },
  { code: "605", label: "Production Innovation Dept" },
  { code: "606", label: "Job Innovation" },
  { code: "607", label: "R and D" },
  { code: "610", label: "LED Lamp" },
  { code: "620", label: "LED TAF" },
  { code: "630", label: "Back Light LED" },
  { code: "640", label: "R&D" },
  { code: "700", label: "Process Control Section" },
];

const FirstStep = () => {
  const [deptCode, setDeptCode] = useState<number | undefined>(undefined);
  const [deptLabel, setDeptLabel] = useState<string | undefined>(undefined);

  return (
    <div className="rounded-2xl bg-red-100 p-8 flex flex-col gap-4 flex-1">
      <h1 className="text-3xl font-bold text-red-600">Step 1</h1>
      <TextInput
        label="Your Name"
        name="your-name"
        id="your-name"
        color="red"
        colorIntensity="600"
        requiredInput={true}
      />
      <SelectionInput
        label="Your Section"
        name="your-section"
        id="your-section"
        requiredInput={true}
        color="red"
        colorIntensity="600"
        defaultDisabledValue="Select Section"
        options={SECTIONS}
      />
      <TextInput
        label="Employee No. (NRP)"
        name="your-employee-number"
        id="your-employee-number"
        color="red"
        colorIntensity="600"
        requiredInput={true}
      />
      <TextInput
        label="Ext. No."
        name="your-extension-number"
        id="your-extension-number"
        color="red"
        colorIntensity="600"
        requiredInput={false}
      />
      <TextInputBetweenLabel
        leftLabel="Your E-Mail"
        rightLabel="@ssi.sharp-world.com"
        name="your-email"
        id="your-email"
        color="red"
        colorIntensity="600"
        requiredInput={true}
      />
      <SelectionInput
        label="File Resource"
        name="file-resource"
        id="file-resource"
        requiredInput={true}
        color="red"
        colorIntensity="600"
        defaultDisabledValue="Select File Resource"
        options={FILE_RESOURCES}
      />
      <div className="h-8 lg:h-9 xl:h-10 | flex">
        <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-red-600 bg-red-600 text-white select-none">
          Department*
        </div>
        <select
          name="department"
          id="department"
          className={`text-xs lg:text-sm xl:text-base | flex-1 h-full px-4 border ${deptCode === undefined ? "rounded-r-xl" : ""} border-red-600 text-red-600 bg-white/50 outline-none`}
          onChange={(e) => {
            const newDeptCode = e.target.value;
            setDeptCode(Number(newDeptCode));
            setDeptLabel(
              DEPARTMENTS.find((depts) => depts.code === newDeptCode)?.label,
            );
          }}
        >
          <option value="" disabled selected>
            Select Department Code
          </option>
          {DEPARTMENTS.map((dept, index) => {
            return (
              <option key={index} value={dept.code}>
                {dept.code}
              </option>
            );
          })}
        </select>
        {deptCode === undefined ? (
          ""
        ) : (
          <div className="text-xs lg:text-sm xl:text-base | whitespace-nowrap font-bold rounded-r-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-red-600 bg-red-600 text-white select-none">
            {deptLabel}
          </div>
        )}
      </div>
      <SelectionInput
        label="Select Form"
        name="form"
        id="form"
        requiredInput={true}
        color="red"
        colorIntensity="600"
        defaultDisabledValue="Select Form"
        options={FORMS}
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

export default FirstStep;
