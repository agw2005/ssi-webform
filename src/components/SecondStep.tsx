import TextAreaInput from "./TextAreaInput";
import TextInput from "./TextInput";

const SecondStep = () => {
  return (
    <div className="rounded-2xl bg-blue-100 p-8 flex flex-col gap-4 flex-1">
      <h1 className="text-3xl font-bold text-blue-600">Step 2</h1>
      <TextInput
        label="No. Form"
        name="no-form"
        id="no-form"
        color="blue"
        colorIntensity="600"
        requiredInput={false}
        isDisabled={true}
      />
      <TextInput
        label="No. PR"
        name="no-pr"
        id="no-pr"
        color="blue"
        colorIntensity="600"
        requiredInput={false}
        isDisabled={true}
      />
      <TextInput
        label="Subject"
        name="subject"
        id="subject"
        color="blue"
        colorIntensity="600"
        requiredInput={true}
      />
      <TextAreaInput
        label="Return on Outgoing"
        name="return-on-outgoing"
        id="return-on-outgoing"
        color="blue"
        colorIntensity="600"
        requiredInput={true}
      />
      <div className="flex gap-2">
        <div className="bg-black hover:bg-black/70 active:bg-black/85 | px-4 py-2 border rounded-2xl border-black font-bold tracking-wide text-white select-none">
          Clear
        </div>
        <div className="bg-black hover:bg-black/70 active:bg-black/85 | px-4 py-2 border rounded-2xl border-black font-bold tracking-wide text-white select-none">
          Next
        </div>
      </div>
    </div>
  );
};

export default SecondStep;
