import Primitive from "../components/Primitive";
import SubmitContainer from "../components/submit/SubmitContainer";
import SubmitHeader from "../components/submit/SubmitHeader";
import SubmitAttention from "../components/submit/SubmitAttention";
import SubmitForm from "../components/submit/SubmitForm";

const Submit = () => {
  return (
    <Primitive>
      <SubmitContainer>

        {/* LEFT */}
        <div className="flex-[2] min-w-0 max-w-3xl">
          <SubmitHeader />
          <SubmitAttention />
          <SubmitForm />
        </div>

        {/* RIGHT */}
        <div className="flex-1 bg-gray-50 border rounded-xl p-6 shadow-sm h-fit sticky top-6">

          <h2 className="text-lg font-semibold mb-3">
            Header of Your PR Form{" "}
            <span className="text-gray-400 font-normal">Step 2</span>
          </h2>

          <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-md mb-5">
            <b>INFO!</b> Your PR Number is in No. PR field, and No. Form is for tracking your form
          </div>

          <div className="space-y-4">

            <div>
              <label className="text-sm text-gray-600">No. Form</label>
              <input
                className="w-full border rounded-md px-3 py-2 bg-gray-100"
                value="30012026144604"
                readOnly
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">No. PR</label>
              <input
                className="w-full border rounded-md px-3 py-2"
                placeholder="(Left Empty, will be shown after FINISHED)"
                readOnly
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Subject</label>
              <textarea
                className="w-full border rounded-md px-3 py-2"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Return On Outgoing</label>
              <input
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button className="px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-md transition">
              Back
            </button>

            <button className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-md transition">
              Next
            </button>
          </div>

        </div>

      </SubmitContainer>
    </Primitive>
  );
};

export default Submit;
