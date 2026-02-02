import { useState } from "react";

const SubmitWorkInfo = () => {
  const SECTIONS = [
    "PROD",
    "PURC",
    "EXIM",
    "PGA",
    "PI",
    "QA",
    "PSM",
    "BM",
    "FCS",
    "MC",
    "GA",
    "ENG",
    "QC",
    "WHFG",
    "JI",
    "FG",
    "SGA",
    "Welfare form",
    "ACC",
    "RnD",
    "PROD for ENG",
    "R&amp;D",
    "MIS",
  ];

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

  const [deptCode, setDeptCode] = useState("");

  const selectedDept = DEPARTMENTS.find(
    (dept) => dept.code === deptCode
  );

  return (
    <div className="space-y-4">
      {/* File Resource */}
      <div className="flex items-center gap-4">
        <label className="w-40">
          File Resource <span className="text-red-600">*</span>
        </label>
        <select
          required
          className="border p-2 w-64 | px-4 rounded-xl border"
        >
          <option value="">Select One</option>
          {SECTIONS.map((section) => (
            <option key={section} value={section}>
              {section}
            </option>
          ))}
        </select>
      </div>

      {/* Dept */}
      <div className="flex items-center gap-4 ">
        <label className="w-40">
          Dept <span className="text-red-600">*</span>
        </label>

        <select
          required
          className="border p-2 w-32 | px-4 rounded-xl border"
          value={deptCode}
          onChange={(e) => setDeptCode(e.target.value)}
        >
          <option value="">---</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept.code} value={dept.code}>
              {dept.code}
            </option>
          ))}
        </select>

        <input
          type="text"
          readOnly
          className="border p-2 w-96 bg-[#eeeeee] text-gray-700 cursor-not-allowed | px-4 rounded-xl border"
          placeholder="Department description"
          value={selectedDept?.label || ""}
        />
      </div>
    </div>
  );
};

export default SubmitWorkInfo;