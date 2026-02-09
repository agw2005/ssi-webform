import { useState } from "react";
import ApprovalPickerModal from "./ApprovalPickerModal.tsx";

interface ApprovalItem {
  section: string;
  name: string;
}

interface Props {
  title: string;
}

const Step4RoleBox = ({ title }: Props) => {
  const [items, setItems] = useState<ApprovalItem[]>([]);
  const [open, setOpen] = useState(false);

  return (
    <div>

      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">{title}</h3>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
        >
          + Add
        </button>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50 space-y-2 text-sm">

        {items.length === 0 && (
          <p className="text-gray-500">
            No {title.toLowerCase()} added
          </p>
        )}

        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between bg-white border rounded-md px-3 py-2"
          >
            <span>
              <b>{item.name}</b>
              <span className="text-gray-500 ml-2">
                ({item.section})
              </span>
            </span>

            <button
              type="button"
              onClick={() =>
                setItems(items.filter((_, i) => i !== idx))
              }
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        ))}

      </div>

      <ApprovalPickerModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={title}
        onAdd={(data) => setItems([...items, data])}
      />

    </div>
  );
};

export default Step4RoleBox;
