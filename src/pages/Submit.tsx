import { useState } from "react";
import Primitive from "../components/Primitive";
import SubmitContainer from "../components/submit/Form1/Form1Container";
import SubmitHeader from "../components/submit/Form1/Form1Header";
import SubmitAttention from "../components/submit/Form1/Form1Attention";
import SubmitForm from "../components/submit/Form1/Form1Submit";
import { generateFormNumber } from "../components/Date";

const Submit = () => {

  const [formNumber] = useState<string>(() => generateFormNumber());

  return (
    <Primitive>
      <SubmitContainer>

        {/* FORM 1 */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <SubmitHeader />
          <SubmitAttention />
          <SubmitForm />
        </div>

        {/* FORM 2 / PREVIEW */}
        <div className="bg-gray-50 rounded-xl border p-8 shadow-sm max-w-3xl">

          <h2 className="text-lg font-semibold mb-4">
            Header of Your PR Form
            <span className="text-gray-400 ml-2 font-normal">
              Step 2
            </span>
          </h2>

          <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-md mb-6">
            <b>INFO!</b> Your PR Number is in No. PR field, and No. Form is for tracking your form
          </div>

          <div className="space-y-4">

            <div>
              <label className="text-sm text-gray-600">
                No. Form
              </label>

              <input
                className="w-full border rounded-md px-3 py-2 bg-gray-100"
                value={formNumber}
                readOnly
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                No. PR
              </label>

              <input
                className="w-full border rounded-md px-3 py-2"
                placeholder="(Left Empty, will be shown after FINISHED)"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Subject
              </label>

              <textarea
                className="w-full border rounded-md px-3 py-2"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Return On Outgoing
              </label>

              <input
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

          </div>

        </div>

      </SubmitContainer>
    </Primitive>
  );
};

export default Submit;
