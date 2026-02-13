import TextAreaInput from "./TextAreaInput";
import TextInput from "./TextInput";

interface SecondStepProps {
  progressSetter: React.Dispatch<React.SetStateAction<number[]>>;
}

const STEP = 2;

const SecondStep = ({ progressSetter }: SecondStepProps) => {
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
      />
      <TextInput
        label="No. PR"
        name="no-pr"
        id="no-pr"
        variant="blue"
        requiredInput={false}
        isDisabled={true}
      />
      <TextInput
        label="Subject"
        name="subject"
        id="subject"
        variant="blue"
        requiredInput={true}
      />
      <TextAreaInput
        label="Return on Outgoing"
        name="return-on-outgoing"
        id="return-on-outgoing"
        variant="blue"
        requiredInput={true}
      />
      <div className="flex gap-2">
        <div
          className="bg-black hover:bg-black/70 active:bg-black/85 | px-4 py-2 border rounded-2xl border-black font-bold tracking-wide text-white select-none"
          onClick={() => {
            progressSetter((prev) => prev.filter((num) => num !== STEP));
          }}
        >
          Clear
        </div>
        <div
          className="bg-black hover:bg-black/70 active:bg-black/85 | px-4 py-2 border rounded-2xl border-black font-bold tracking-wide text-white select-none"
          onClick={() => {
            progressSetter((prev) => [...prev, STEP]);
          }}
        >
          Next
        </div>
      </div>
    </div>
  );
};

export default SecondStep;
