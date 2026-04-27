import type { SecondStepInputs } from "@scope/server";
import { createGenericChangeHandler } from "../../../helper/genericInputHandler.ts";
import TextAreaInput from "../../reusable/inputs/TextAreaInput.tsx";
import TextInput from "../../reusable/inputs/TextInput.tsx";

const STEP = 2;

interface SecondStepProps {
  progressSetter: React.Dispatch<React.SetStateAction<number[]>>;
  secondStepInputsGetter: SecondStepInputs;
  secondStepInputsInputsSetter: React.Dispatch<
    React.SetStateAction<SecondStepInputs>
  >;
  secondStepInputsDefaultValue: SecondStepInputs;
  alertUnfilledForm: () => void;
}

const SecondStep = ({
  progressSetter,
  secondStepInputsGetter,
  secondStepInputsInputsSetter,
  secondStepInputsDefaultValue,
  alertUnfilledForm,
}: SecondStepProps) => {
  const genericChangeHandler = createGenericChangeHandler(
    secondStepInputsInputsSetter,
  );

  const requiredFieldsAreEmpty = () => {
    if (
      secondStepInputsGetter.subject === secondStepInputsDefaultValue.subject
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="rounded-2xl bg-blue-100 p-8 flex flex-col gap-4 flex-1">
      <h1 className="text-3xl font-bold text-blue-600">Step 2</h1>
      <div className="flex">
        <TextInput
          label="No. Form"
          name="no-form"
          id="no-form"
          variant="blue"
          requiredInput={false}
          isDisabled
          value={secondStepInputsGetter.formNumber}
          onChangeHandler={genericChangeHandler("formNumber")}
          placeholder="Will be generated after submission"
        />
      </div>
      <div className="flex">
        <TextInput
          label="No. PR"
          name="no-pr"
          id="no-pr"
          variant="blue"
          requiredInput={false}
          isDisabled
          value={secondStepInputsGetter.prNumber}
          onChangeHandler={genericChangeHandler("prNumber")}
          placeholder="Will be generated after submission"
        />
      </div>
      <div className="flex">
        <TextInput
          label="Subject"
          name="subject"
          id="subject"
          variant="blue"
          requiredInput
          value={secondStepInputsGetter.subject}
          onChangeHandler={genericChangeHandler("subject")}
          placeholder="e.g. Graphite sheet for SL9.0 BI Box Improvement"
        />
      </div>
      <TextAreaInput
        label="Return on Outgoing"
        name="return-on-outgoing"
        id="return-on-outgoing"
        variant="blue"
        requiredInput={false}
        value={secondStepInputsGetter.returnOnOutgoing}
        onChangeHandler={genericChangeHandler("returnOnOutgoing")}
        placeholder="e.g. Used for replacement broken part at BLCT"
      />
      <div className="flex gap-2">
        <div
          className="bg-black hover:bg-black/70 active:bg-black/85 | px-4 py-2 border rounded-2xl border-black font-bold tracking-wide text-white select-none"
          onClick={() => {
            progressSetter((prev) => prev.filter((num) => num !== STEP));
            secondStepInputsInputsSetter(secondStepInputsDefaultValue);
          }}
        >
          Clear
        </div>
        <div
          className="bg-black hover:bg-black/70 active:bg-black/85 | px-4 py-2 border rounded-2xl border-black font-bold tracking-wide text-white select-none"
          onClick={() => {
            if (!requiredFieldsAreEmpty()) {
              progressSetter((prev) => [...prev, STEP]);
            } else {
              alertUnfilledForm();
            }
          }}
        >
          Next
        </div>
      </div>
    </div>
  );
};

export default SecondStep;
