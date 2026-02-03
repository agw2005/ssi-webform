interface Props {
  formNumber: string;
  onNext: () => void;
  onBack: () => void;
}

const Step2Form = ({ formNumber, onNext, onBack }: Props) => {
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleNext} className="space-y-4">

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
          Subject <span className="text-red-500">*</span>
        </label>

        <input
          required
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

      {/* BUTTONS */}
      <div className="flex justify-end gap-2 mt-6">

        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition cursor-pointer"
        >
          Back
        </button>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition cursor-pointer"
        >
          Next
        </button>

      </div>

    </form>
  );
};

export default Step2Form;
