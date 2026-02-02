const SubmitPRHeader = () => {
  return (
    <div className="space-y-4">
      {/* Title */}
      <h2 className="text-lg font-semibold">
        Header of Your PR Form{" "}
        <span className="text-sm font-normal text-gray-500">Step 2</span>
      </h2>

      {/* Info Box */}
      <div className="bg-blue-100 text-blue-800 p-3 text-sm rounded">
        <b>INFO!</b> Your PR Number is in No. PR field, and No. Form is for
        tracking your form
      </div>

      {/* No Form */}
      <div className="flex items-center gap-4">
        <label className="w-32">No. Form :</label>
        <input
          type="text"
          readOnly
          className="p-2 bg-[#eeeeee] w-64 rounded"
          value="30012026144604"
        />
      </div>

      {/* No PR */}
      <div className="flex items-center gap-4">
        <label className="w-32">No. PR :</label>
        <input
          type="text"
          readOnly
          className="p-2 bg-[#eeeeee] w-64 rounded"
          placeholder="(Left Empty, will be shown after FINISHED)"
        />
      </div>

      {/* Subject */}
      <div className="flex items-center gap-4">
        <label className="w-32">Subject :</label>
        <input
          type="text"
          className="border p-2 w-96"
        />
      </div>

      {/* Return On / Outgoing */}
      <div className="flex items-center gap-4">
        <label className="w-32">Return On Outgoing :</label>
        <input
          type="text"
          className="border p-2 w-64"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <button className="bg-orange-500 text-white px-4 py-2 rounded cursor-pointer">
          Back
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
          Next
        </button>
      </div>
    </div>
  );
};

export default SubmitPRHeader;
