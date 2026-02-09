import approvalData from "../../../dummies/Approval.json";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { section: string; name: string }) => void;
  title: string;
}

const ApprovalPickerModal = ({ isOpen, onClose, onAdd, title }: Props) => {
  const [section, setSection] = useState("");
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const selectedSection = approvalData.find(
    (s) => s.section === section
  );

  const handleAdd = () => {
    if (!section || !name) return;
    onAdd({ section, name });
    setSection("");
    setName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative bg-white w-[420px] rounded-lg shadow-lg p-6">

        <h2 className="font-semibold text-lg mb-4">
          Add {title}
        </h2>

        <div className="space-y-4">

          {/* SECTION */}
          <div>
            <label className="text-sm">Section</label>
            <select
              value={section}
              onChange={(e) => {
                setSection(e.target.value);
                setName("");
              }}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Select Section</option>
              {approvalData.map((s) => (
                <option key={s.section} value={s.section}>
                  {s.section}
                </option>
              ))}
            </select>
          </div>

          {/* NAME */}
          {selectedSection && (
            <div>
              <label className="text-sm">Name</label>
              <select
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="">Select Name</option>
                {selectedSection.members.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          )}

        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Add
          </button>
        </div>

      </div>
    </div>
  );
};

export default ApprovalPickerModal;
