import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

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
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {/* BODY (scrollable) */}
        <div className="overflow-y-auto px-5 py-4 space-y-3">

          {/* GRID FORM */}
          <div className="grid grid-cols-[140px_1fr] gap-3 items-center">

            <label>Cost Center</label>
            <select
              name="costCenter"
              onChange={handleChange}
              className="border rounded-md px-3 py-2"
            >
              <option>Select One</option>
              <option>104</option>
              <option>105</option>
            </select>

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
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Close
          </button>

          <button
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
