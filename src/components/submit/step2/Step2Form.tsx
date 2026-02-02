interface Props {
  formNumber: string;
}

const Step2Form = ({ formNumber }: Props) => {
  return (
    <div className="space-y-4">

      <div>
        <label className="text-sm text-gray-600">
          No. Form
        </label>

        <input
          className="w-full border rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
          value={formNumber}
          readOnly
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">
          No. PR
        </label>

        <input
          className="w-full border rounded-md px-3 py-2 cursor-not-allowed"
          placeholder="(Left Empty, will be shown after FINISHED)"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">
          Subject
        </label>

        <input
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">
          Return On Outgoing
        </label>

        <textarea
          className="w-full border rounded-md px-3 py-2"
          rows={3}          
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 mt-6">
        <button className="px-4 py-2 bg-orange-400 text-white rounded-md hover:bg-orange-500">
          Back
        </button>

        <button className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600">
          Next
        </button>
      </div>

    </div>
  );
};

export default Step2Form;
