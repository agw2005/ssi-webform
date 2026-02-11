import { useState } from "react";
import Placeholders from "../dummies/NewSubmitFormTable.json";

const CURRENCY = ["IDR", "JPY", "SGD", "USD"];

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

const COLUMNS = [
  "Cost Center",
  "Nature",
  "Description",
  "Qty",
  "Measure",
  "Unit Price",
  "Currency",
  "Rate",
  "Est. Delivery",
  "Vendor",
  "Reason",
  "ID Budget",
];

const ThirdStep = () => {
  const [costCenterCode, setCostCenterCode] = useState<number | undefined>(
    undefined,
  );
  const [costCenterLabel, setCostCenterLabel] = useState<string | undefined>(
    undefined,
  );

  return (
    <div className="rounded-2xl bg-yellow-100 p-8 flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-yellow-600">Step 3</h1>
      <div className="h-8 lg:h-9 xl:h-10 | flex">
        <div className="text-xs lg:text-sm | rounded-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-yellow-900 bg-yellow-900 text-white select-none">
          Do not let your budget get a red light
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-3 lg:h-168">
        <div className="flex flex-col gap-2">
          <div className="h-8 lg:h-9 xl:h-10 | flex">
            <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-yellow-600 bg-yellow-600 text-white select-none">
              Cost Center*
            </div>
            <select
              name="cost-center"
              id="cost-center"
              className={`text-xs lg:text-sm xl:text-base | flex-1 px-4 border rounded-r-xl border-yellow-600 text-yellow-600 bg-white/50 outline-none`}
              onChange={(e) => {
                const newCostCenterCode = e.target.value;
                setCostCenterCode(Number(newCostCenterCode));
                setCostCenterLabel(
                  DEPARTMENTS.find((depts) => depts.code === newCostCenterCode)
                    ?.label,
                );
              }}
            >
              <option value="" disabled selected>
                Select Cost Center
              </option>
              {DEPARTMENTS.map((dept, index) => {
                return (
                  <option key={index} value={dept.code}>
                    {dept.code}
                  </option>
                );
              })}
            </select>
          </div>
          {costCenterCode === undefined ? (
            ""
          ) : (
            <div className="h-8 lg:h-9 xl:h-10 | flex">
              <div className="text-xs lg:text-sm xl:text-base | flex-1 font-bold rounded-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-yellow-900 bg-yellow-900 text-white select-none">
                {costCenterLabel}
              </div>
            </div>
          )}
          <div className="h-8 lg:h-9 xl:h-10 | flex">
            <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-yellow-600 bg-yellow-600 text-white select-none">
              Budget/Nature
            </div>
            <select
              name="budget/nature"
              id="budget/nature"
              className={`text-xs lg:text-sm xl:text-base | flex-1 px-4 border rounded-r-xl border-yellow-600 text-yellow-600 bg-white/50 outline-none`}
            >
              <option value="" disabled selected>
                Select Budget/Nature
              </option>
            </select>
          </div>
          <div className="h-8 lg:h-9 xl:h-10 | flex">
            <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-yellow-600 bg-yellow-600 text-white select-none">
              Periode
            </div>
            <input
              type="text"
              name="periode"
              id="periode"
              className="text-xs lg:text-sm xl:text-base | flex-1 px-4 rounded-r-xl border border-yellow-600 text-yellow-600 bg-white/50 outline-none"
            />
          </div>
          <div className="h-8 lg:h-9 xl:h-10 | flex">
            <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-yellow-600 bg-yellow-600 text-white select-none">
              Balance
            </div>
            <input
              type="text"
              name="balance"
              id="balance"
              className="text-xs lg:text-sm xl:text-base | flex-1 px-4 rounded-r-xl border border-yellow-600 text-yellow-600 bg-white/50 outline-none"
            />
          </div>
          <div className="h-8 lg:h-9 xl:h-10 | flex">
            <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-yellow-600 bg-yellow-600 text-white select-none">
              Description
            </div>
            <input
              type="text"
              name="description"
              id="description"
              className="text-xs lg:text-sm xl:text-base | flex-1 px-4 rounded-r-xl border border-yellow-600 text-yellow-600 bg-white/50 outline-none"
            />
          </div>
          <div className="h-8 lg:h-9 xl:h-10 | flex">
            <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-yellow-600 bg-yellow-600 text-white select-none">
              Quantity
            </div>
            <input
              type="number"
              name="quantity"
              id="quantity"
              className="text-xs lg:text-sm xl:text-base | flex-1 px-4 rounded-r-xl border border-yellow-600 text-yellow-600 bg-white/50 outline-none"
            />
          </div>
          <div className="h-8 lg:h-9 xl:h-10 | flex">
            <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-yellow-600 bg-yellow-600 text-white select-none">
              Unit Price
            </div>
            <input
              type="number"
              name="unit-price"
              id="unit-price"
              className="text-xs lg:text-sm xl:text-base | flex-1 px-4 rounded-r-xl border border-yellow-600 text-yellow-600 bg-white/50 outline-none"
            />
          </div>
          <div className="h-8 lg:h-9 xl:h-10 | flex">
            <div className="text-xs lg:text-sm | flex-1 rounded-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-yellow-900 bg-yellow-900 text-white select-none">
              Jangan gunakan koma. Gunakan titik untuk desimal.
            </div>
          </div>
          <div className="h-8 lg:h-9 xl:h-10 | flex">
            <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-yellow-600 bg-yellow-600 text-white select-none">
              Measure
            </div>
            <input
              type="text"
              name="measure"
              id="measure"
              className="text-xs lg:text-sm xl:text-base | flex-1 px-4 rounded-r-xl border border-yellow-600 text-yellow-600 bg-white/50 outline-none"
            />
          </div>
          <div className="h-8 lg:h-9 xl:h-10 | flex">
            <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-yellow-600 bg-yellow-600 text-white select-none">
              Currency
            </div>
            <select
              name="currency"
              id="currency"
              className={`text-xs lg:text-sm xl:text-base | flex-1 px-4 border rounded-r-xl border-yellow-600 text-yellow-600 bg-white/50 outline-none`}
            >
              <option value="" disabled selected>
                Select Currency
              </option>
              {CURRENCY.map((currency, index) => {
                return (
                  <option key={index} value={currency}>
                    {currency}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="h-8 lg:h-9 xl:h-10 | flex">
            <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-yellow-600 bg-yellow-600 text-white select-none">
              Vendor
            </div>
            <input
              type="text"
              name="vendor"
              id="vendor"
              className="text-xs lg:text-sm xl:text-base | flex-1 px-4 rounded-r-xl border border-yellow-600 text-yellow-600 bg-white/50 outline-none"
            />
          </div>
          <div className="h-8 lg:h-9 xl:h-10 | flex">
            <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-yellow-600 bg-yellow-600 text-white select-none">
              Reason
            </div>
            <input
              type="text"
              name="reason"
              id="reason"
              className="text-xs lg:text-sm xl:text-base | flex-1 px-4 rounded-r-xl border border-yellow-600 text-yellow-600 bg-white/50 outline-none"
            />
          </div>
          <div className="h-8 lg:h-9 xl:h-10 | flex">
            <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center justify-center px-2 border-r-0 border-yellow-600 bg-yellow-600 text-white select-none">
              Estimated Delivery Date
            </div>
            <input
              type="date"
              name="reason"
              id="reason"
              className="text-xs lg:text-sm xl:text-base | flex-1 px-4 rounded-r-xl border border-yellow-600 text-yellow-600 bg-white/50 outline-none"
            />
          </div>
        </div>
        <div className="flex-3 overflow-auto lg:overflow-y-auto max-h-64 lg:max-h-full lg:h-full border">
          <table className="table-auto border-collapse w-full">
            <thead className="sticky top-0 z-1 border">
              <tr>
                {COLUMNS.map((column, index) => {
                  return (
                    <th
                      key={index}
                      className="text-xs border p-2 bg-yellow-800 text-white border-black whitespace-nowrap text-center"
                    >
                      {column}
                    </th>
                  );
                })}
                <th className="text-xs border p-2 bg-yellow-800 text-white border-black whitespace-nowrap text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {Placeholders.map((placeholder, index) => {
                return (
                  <tr key={index}>
                    {COLUMNS.map((column, index) => {
                      return (
                        <td
                          key={index}
                          className="text-xs border p-2 whitespace-nowrap text-center"
                        >
                          {placeholder[column as keyof typeof placeholder]}
                        </td>
                      );
                    })}
                    <td className="bg-red-400 hover:bg-red-500 active:bg-red-600 | text-xs border p-2 whitespace-nowrap text-center select-none">
                      Delete
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <h2 className="text-xl font-bold text-yellow-600">Budget Summary</h2>
      <div className="overflow-auto">
        <table className="border-collapse w-full lg:w-max">
          <thead>
            <tr>
              <th className="text-xs lg:text-sm xl:text-base | border p-2 bg-yellow-800 text-white border-black whitespace-nowrap text-center">
                Cost Center
              </th>
              <th className="text-xs lg:text-sm xl:text-base | border p-2 bg-yellow-800 text-white border-black whitespace-nowrap text-center">
                Nature
              </th>
              <th className="text-xs lg:text-sm xl:text-base | border p-2 bg-yellow-800 text-white border-black whitespace-nowrap text-center">
                Periode
              </th>
              <th className="text-xs lg:text-sm xl:text-base | border p-2 bg-yellow-800 text-white border-black whitespace-nowrap text-center">
                Balance ($)
              </th>
              <th className="text-xs lg:text-sm xl:text-base | border p-2 bg-yellow-800 text-white border-black whitespace-nowrap text-center">
                Usage ($)
              </th>
              <th className="text-xs lg:text-sm xl:text-base | border p-2 bg-yellow-800 text-white border-black whitespace-nowrap text-center">
                Remain ($)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-xs lg:text-sm xl:text-base | border p-2 wditespace-nowrap text-center">
                104
              </td>
              <td className="text-xs lg:text-sm xl:text-base | border p-2 wditespace-nowrap text-center">
                537003000
              </td>
              <td className="text-xs lg:text-sm xl:text-base | border p-2 wditespace-nowrap text-center">
                2025LH02-104-MIS
              </td>
              <td className="text-xs lg:text-sm xl:text-base | border p-2 wditespace-nowrap text-center">
                1.00
              </td>
              <td className="text-xs lg:text-sm xl:text-base | border p-2 wditespace-nowrap text-center">
                0
              </td>
              <td className="text-xs lg:text-sm xl:text-base | border p-2 wditespace-nowrap text-center">
                1.00
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex gap-2 whitespace-nowrap">
        <div className="px-4 py-2 border rounded-lg bg-yellow-800 border-yellow-800 text-white font-bold select-none">
          Total Usage ($) : 0
        </div>
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

export default ThirdStep;
