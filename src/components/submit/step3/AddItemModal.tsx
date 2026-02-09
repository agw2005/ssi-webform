import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

  const costCenter = [
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

const AddItemModal = ({ isOpen, onClose }: Props) => {
  const [form, setForm] = useState({
    costCenter: "",
    budgetNature: "",
    periode: "2025LH02",
    balance: "",
    description: "",
    qty: "",
    unitPrice: "",
    measure: "",
    currency: "",
    vendor: "",
    reason: "",
    deliveryDate: "",
  });

  const selectedCostCenter = costCenter.find(
  (cc) => cc.code === form.costCenter
  );


  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative bg-white w-[520px] max-h-[80vh] rounded-lg shadow-lg flex flex-col">

        {/* header */}
        <div className="flex justify-between items-center border-b px-5 py-3">
          <h2 className="font-semibold text-lg">List Item</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {/* BODY (scrollable) */}
        <div className="overflow-y-auto px-5 py-4 space-y-3">

          {/* GRID FORM */}
          <div className="grid grid-cols-[140px_1fr] gap-3 items-center">

            <label>Cost Center<span className="text-red-600">*</span></label>
            <select
              name="costCenter"
              value={form.costCenter}
              onChange={handleChange}
              className="border rounded-md px-3 py-2"
            >
              <option value="">Select Cost Center</option>

              {costCenter.map((cc) => (
                <option key={cc.code} value={cc.code}>
                  {cc.code}
                </option>
              ))}
            </select>
            {/* LABEL VIEW ONLY */}
            {selectedCostCenter && (
              <div className="col-span-2">
                <div className="bg-gray-100 border rounded-md px-3 py-2 text-sm text-gray-700">
                  {selectedCostCenter.label}
                </div>
              </div>
            )}
            <label>Budget/Nature</label>
            <select
              name="budgetNature"
              onChange={handleChange}
              className="border rounded-md px-3 py-2"
            >
              <option>Select One</option>
            </select>

            <label>Periode</label>
            <input
              name="periode"
              value={form.periode}
              readOnly
              className="border rounded-md px-3 py-2 bg-gray-100"
            />

            <label>Balance</label>
            <input
              name="balance"
              onChange={handleChange}
              className="border rounded-md px-3 py-2"
            />

            <label>Description</label>
            <input
              name="description"
              onChange={handleChange}
              className="border rounded-md px-3 py-2"
            />

            <label>Qty</label>
            <input
              name="qty"
              type="number"
              onChange={handleChange}
              className="border rounded-md px-3 py-2"
            />

            <label>Unit Price</label>
            <div>
              <input
                name="unitPrice"
                type="number"
                onChange={handleChange}
                className="border rounded-md px-3 py-2 w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Jangan gunakan koma. Gunakan titik untuk desimal.
              </p>
            </div>

            <label>Measure</label>
            <input
              name="measure"
              onChange={handleChange}
              className="border rounded-md px-3 py-2"
            />

            <label>Currency</label>
            <select
              name="currency"
              onChange={handleChange}
              className="border rounded-md px-3 py-2"
            >
              <option>Select One</option>
              <option>IDR</option>
              <option>JPY</option>
              <option>SGD</option>
              <option>USD</option>
            </select>

            <label>Vendor</label>
            <input
              name="vendor"
              onChange={handleChange}
              className="border rounded-md px-3 py-2"
            />

            <label>Reason</label>
            <input
              name="reason"
              onChange={handleChange}
              className="border rounded-md px-3 py-2"
            />

            <label>Estimation Delivery Date</label>
            <input
              name="deliveryDate"
              type="date"
              onChange={handleChange}
              className="border rounded-md px-3 py-2"
            />

          </div>
        </div>

        {/* footer */}
        <div className="flex justify-end gap-3 border-t px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Close
          </button>

          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddItemModal;
