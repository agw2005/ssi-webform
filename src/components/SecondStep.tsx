import { createGenericChangeHandler } from "../helper/genericInputHandler";
import type { SecondStepInputs } from "../pages/Submit";
import TextAreaInput from "./TextAreaInput";
import TextInput from "./TextInput";

const STEP = 2;

interface SecondStepProps {
  progressSetter: React.Dispatch<React.SetStateAction<number[]>>;
  secondStepInputsGetter: SecondStepInputs;
  secondStepInputsInputsSetter: React.Dispatch<
    React.SetStateAction<SecondStepInputs>
  >;
  secondStepInputsDefaultValue: SecondStepInputs;
}

const SecondStep = ({
  progressSetter,
  secondStepInputsGetter,
  secondStepInputsInputsSetter,
  secondStepInputsDefaultValue,
}: SecondStepProps) => {
  const genericChangeHandler = createGenericChangeHandler(
    secondStepInputsInputsSetter,
  );

  return (
    <div className="rounded-2xl bg-blue-100 p-8 flex flex-col gap-4 flex-1">
      <h1 className="text-3xl font-bold text-blue-600">Step 2</h1>
      <TextInput
        label="No. Form"
        name="no-form"
        id="no-form"
        variant="blue"
        requiredInput={false}
        isDisabled={true}
        value={secondStepInputsGetter.formNumber}
        onChangeHandler={genericChangeHandler("formNumber")}
      />
      <TextInput
        label="No. PR"
        name="no-pr"
        id="no-pr"
        variant="blue"
        requiredInput={false}
        isDisabled={true}
        value={secondStepInputsGetter.prNumber}
        onChangeHandler={genericChangeHandler("prNumber")}
      />
      <TextInput
        label="Subject"
        name="subject"
        id="subject"
        variant="blue"
        requiredInput={true}
        value={secondStepInputsGetter.subject}
        onChangeHandler={genericChangeHandler("subject")}
      />
      <TextAreaInput
        label="Return on Outgoing"
        name="return-on-outgoing"
        id="return-on-outgoing"
        variant="blue"
        requiredInput={true}
        value={secondStepInputsGetter.returnOnOutgoing}
        onChangeHandler={genericChangeHandler("returnOnOutgoing")}
      />
      <div className="flex gap-2">
        <div
          className="bg-black hover:bg-black/70 active:bg-black/85 | px-4 py-2 border rounded-2xl border-black font-bold tracking-wide text-white select-none"
          onClick={() => {
            progressSetter((prev) => prev.filter((num) => num !== STEP));
            secondStepInputsInputsSetter(secondStepInputsDefaultValue);
            console.log(secondStepInputsGetter);
          }}
        >
          Clear
        </div>
        <div
          className="bg-black hover:bg-black/70 active:bg-black/85 | px-4 py-2 border rounded-2xl border-black font-bold tracking-wide text-white select-none"
          onClick={() => {
            progressSetter((prev) => [...prev, STEP]);
            console.log(secondStepInputsGetter);
          }}
        >
          Next
        </div>
      </div>
    </div>
  );
};

export default SecondStep;
