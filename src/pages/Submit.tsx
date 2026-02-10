import { useRef, useState } from "react";
import Primitive from "../components/Primitive.tsx";
import Step1Form from "../components/submit/step1/Step1Form.tsx";

import Step2Header from "../components/submit/step2/Step2Header.tsx";
import Step2Attention from "../components/submit/step2/Step2Attention.tsx";
import Step2Form from "../components/submit/step2/Step2Form.tsx";

import Step3Header from "../components/submit/step3/Step3Header.tsx";
import Step3Attention from "../components/submit/step3/Step3Attention.tsx";

import { generateFormNumber } from "../components/Date.tsx";
import Step3Form from "../components/submit/step3/Step3Form.tsx";

import Step4Form from "../components/submit/step4/Step4Form.tsx";

import LastStepForm from "../components/submit/step5/LastStepForm.tsx";

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

const OPTIONS = ["EXIM", "FCS", "GA", "MC", "MIS"];

const Submit = () => {
  const [formNumber] = useState(() => generateFormNumber());

  // refs untuk scroll
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  const step5Ref = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const [deptCode, setDeptCode] = useState<number | undefined>(undefined);
  const [deptLabel, setDeptLabel] = useState<string | undefined>(undefined);

  return (
    <Primitive>
      <div className="rounded-2xl bg-red-100 p-8 flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-red-600">Step 1</h1>
        <div className="h-8 lg:h-9 xl:h-10 | flex">
          <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-red-600 bg-red-600 text-white select-none">
            Your Name*
          </div>
          <input
            type="text"
            name="your-name"
            id="your-name"
            className="text-xs lg:text-sm xl:text-base | h-full px-4 rounded-r-xl border border-red-600 text-red-600 bg-white/50 outline-none"
          />
        </div>
        <div className="h-8 lg:h-9 xl:h-10 | flex">
          <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-red-600 bg-red-600 text-white select-none">
            Your Section*
          </div>
          <select
            name="your-section"
            id="your-section"
            className="text-xs lg:text-sm xl:text-base | max-w-32 lg:max-w-40 xl:max-w-48 | h-full px-4 rounded-r-xl border border-red-600 text-red-600 bg-white/50 outline-none"
          >
            <option value="" disabled selected>
              Select Section
            </option>
            {SECTIONS.map((section, index) => {
              return (
                <option key={index} value={section}>
                  {section}
                </option>
              );
            })}
          </select>
        </div>
        <div className="h-8 lg:h-9 xl:h-10 | flex">
          <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-red-600 bg-red-600 text-white select-none">
            Employee No. (NRP)*
          </div>
          <input
            type="text"
            name="your-employee-number"
            id="your-employee-number"
            className="text-xs lg:text-sm xl:text-base | h-full px-4 rounded-r-xl border border-red-600 text-red-600 bg-white/50 outline-none"
          />
        </div>
        <div className="h-8 lg:h-9 xl:h-10 | flex">
          <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-red-600 bg-red-600 text-white select-none">
            Ext. No.
          </div>
          <input
            type="text"
            name="your-extension-number"
            id="your-extension-number"
            className="text-xs lg:text-sm xl:text-base | h-full px-4 rounded-r-xl border border-red-600 text-red-600 bg-white/50 outline-none"
          />
        </div>
        <div className="h-8 lg:h-9 xl:h-10 | flex">
          <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-red-600 bg-red-600 text-white select-none">
            Your E-Mail*
          </div>
          <input
            type="text"
            name="your-email"
            id="your-email"
            className="text-xs lg:text-sm xl:text-base | h-full px-4 border border-red-600 text-red-600 bg-white/50 outline-none"
          />
          <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-r-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-red-600 bg-red-600 text-white select-none">
            @ssi.sharp-world.com
          </div>
        </div>
        <div className="h-8 lg:h-9 xl:h-10 | flex">
          <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-red-600 bg-red-600 text-white select-none">
            File Resource*
          </div>
          <select
            name="file-resource"
            id="file-resource"
            className="text-xs lg:text-sm xl:text-base | max-w-40 lg:max-w-48 xl:max-w-64 | h-full px-4 rounded-r-xl border border-red-600 text-red-600 bg-white/50 outline-none"
          >
            <option value="" disabled selected>
              Select File Resource
            </option>
            {OPTIONS.map((section, index) => {
              return (
                <option key={index} value={section}>
                  {section}
                </option>
              );
            })}
          </select>
        </div>
        <div className="h-8 lg:h-9 xl:h-10 | flex">
          <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-red-600 bg-red-600 text-white select-none">
            Department*
          </div>
          <select
            name="department"
            id="department"
            className={`text-xs lg:text-sm xl:text-base | max-w-32 lg:max-w-40 xl:max-w-48 | h-full px-4 border ${deptCode === undefined ? "rounded-r-xl" : ""} border-red-600 text-red-600 bg-white/50 outline-none`}
            onChange={(e) => {
              const newDeptCode = e.target.value;
              setDeptCode(Number(newDeptCode));
              setDeptLabel(
                DEPARTMENTS.find((depts) => depts.code === newDeptCode)?.label,
              );
            }}
          >
            <option value="" disabled selected>
              Select Dept.
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
            <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-r-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-red-600 bg-red-600 text-white select-none">
              {deptLabel}
            </div>
          )}
        </div>
        <div className="h-8 lg:h-9 xl:h-10 | flex">
          <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-red-600 bg-red-600 text-white select-none">
            File Resource*
          </div>
          <select
            name="form"
            id="form"
            className="text-xs lg:text-sm xl:text-base | max-w-40 lg:max-w-48 xl:max-w-64 | h-full px-4 rounded-r-xl border border-red-600 text-red-600 bg-white/50 outline-none"
          >
            <option value="" disabled selected>
              Select Form
            </option>
            <option value="PR">PR</option>
            <option value="Cash Advance">Cash Advance</option>
            <option value="Fixed Asset">Fixed Asset</option>
          </select>
        </div>
        <div className="flex gap-2">
          <div className="bg-red-800 hover:bg-red-800/70 active:bg-red-800/85 | px-4 py-2 border rounded-2xl border-red-800 font-bold tracking-wide text-white select-none">
            Clear
          </div>
          <div className="bg-blue-800 hover:bg-blue-800/70 active:bg-blue-800/85 | px-4 py-2 border rounded-2xl border-blue-800 font-bold tracking-wide text-white select-none">
            Next
          </div>
        </div>
      </div>

      {/* STEP 1 */}
      <div ref={step1Ref} className="bg-white rounded-xl p-8 shadow-sm">
        <h1 className="text-xl font-bold mb-2">
          Fill Your Data <span className="text-sm font-normal">Step 1</span>
        </h1>
        <div className="bg-gray-200 text-gray-700 p-3 mb-6 text-sm">
          <b>ATTENTION</b> You must fill your data correctly
        </div>
        <Step1Form onNext={() => scrollTo(step2Ref)} />
      </div>

      {/* STEP 2 */}
      <div ref={step2Ref} className="bg-white rounded-xl p-8 shadow-sm">
        <Step2Header />
        <Step2Attention />
        <Step2Form
          formNumber={formNumber}
          onNext={() => scrollTo(step3Ref)}
          onBack={() => scrollTo(step1Ref)}
        />
      </div>

      {/* STEP 3 */}
      <div ref={step3Ref} className="bg-white rounded-xl p-8 shadow-sm">
        <Step3Header />
        <Step3Attention />
        <Step3Form
          onNext={() => scrollTo(step4Ref)}
          onBack={() => scrollTo(step2Ref)}
        />
      </div>

      {/* STEP 4 */}
      <div ref={step4Ref} className="bg-white rounded-xl p-8 shadow-sm mt-8">
        <Step4Form
          onBack={() => scrollTo(step3Ref)}
          onNext={() => scrollTo(step5Ref)}
        />
      </div>

      {/* Last Step */}
      <div ref={step5Ref} className="bg-white rounded-xl p-8 shadow-sm mt-8">
        <LastStepForm onBack={() => scrollTo(step4Ref)} />
      </div>
    </Primitive>
  );
};

export default Submit;
