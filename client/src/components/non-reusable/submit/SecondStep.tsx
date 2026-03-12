import type { SecondStepInputs } from "@scope/server";
import { createGenericChangeHandler } from "../../../helper/genericInputHandler.ts";
import TextAreaInput from "../../reusable/inputs/TextAreaInput.tsx";
import TextInput from "../../reusable/inputs/TextInput.tsx";

const STEP = 2;

const EMPTY_FIELDS_WARNING =
  "One or more required fields are empty. Please fill them out before proceeding.";

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

  const requiredFieldsAreEmpty = () => {
    if (
      secondStepInputsGetter.subject === secondStepInputsDefaultValue.subject ||
      secondStepInputsGetter.returnOnOutgoing ===
        secondStepInputsDefaultValue.returnOnOutgoing
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="rounded-2xl bg-blue-100 p-8 flex flex-col gap-4 flex-1">
      <h1 className="text-3xl font-bold text-blue-600">Step 2</h1>
      <TextInput
        label="No. Form"
        name="no-form"
        id="no-form"
        variant="blue"
        requiredInput={false}
        isDisabled
        value={secondStepInputsGetter.formNumber}
        onChangeHandler={genericChangeHandler("formNumber")}
      />
      <TextInput
        label="No. PR"
        name="no-pr"
        id="no-pr"
        variant="blue"
        requiredInput={false}
        isDisabled
        value={secondStepInputsGetter.prNumber}
        onChangeHandler={genericChangeHandler("prNumber")}
      />
      <TextInput
        label="Subject"
        name="subject"
        id="subject"
        variant="blue"
        requiredInput
        value={secondStepInputsGetter.subject}
        onChangeHandler={genericChangeHandler("subject")}
      />
      <TextAreaInput
        label="Return on Outgoing"
        name="return-on-outgoing"
        id="return-on-outgoing"
        variant="blue"
        requiredInput
        value={secondStepInputsGetter.returnOnOutgoing}
        onChangeHandler={genericChangeHandler("returnOnOutgoing")}
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
              globalThis.confirm(EMPTY_FIELDS_WARNING);
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
