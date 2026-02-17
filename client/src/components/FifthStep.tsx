import type { FifthStepInputs } from "../pages/Submit.tsx";
import MultifileInput from "./MultifileInput.tsx";

interface FifthStepProps {
  fifthStepInputsGetter: FifthStepInputs;
  fifthStepInputsSetter: React.Dispatch<React.SetStateAction<FifthStepInputs>>;
  fifthStepInputsDefaultValue: FifthStepInputs;
}

const FifthStep = ({
  fifthStepInputsGetter,
  fifthStepInputsSetter,
  fifthStepInputsDefaultValue,
}: FifthStepProps) => {
  const onChangeHandler =
    (field: keyof FifthStepInputs) => (newFiles: File[]) => {
      fifthStepInputsSetter((prev) => ({
        ...prev,
        [field]: newFiles,
      }));
    };

  return (
    <div className="rounded-2xl bg-purple-100 p-8 flex flex-col gap-4 flex-1 w-full">
      <h1 className="text-3xl font-bold text-purple-600">Step 5</h1>
      <div className="flex flex-col w-full">
        <MultifileInput
          uploads={fifthStepInputsGetter.files}
          onUploadsChange={onChangeHandler("files")}
        />
      </div>
      <div className="flex gap-2">
        <div
          className="bg-black hover:bg-black/70 active:bg-black/85 | px-4 py-2 border rounded-2xl border-black font-bold tracking-wide text-white select-none"
          onClick={() => {
            fifthStepInputsSetter(fifthStepInputsDefaultValue);
            console.log(fifthStepInputsGetter);
          }}
        >
          Clear
        </div>
        <div
          className="bg-black hover:bg-black/70 active:bg-black/85 | px-4 py-2 border rounded-2xl border-black font-bold tracking-wide text-white select-none"
          onClick={() => {
            console.log(fifthStepInputsGetter);
          }}
        >
          Submit
        </div>
      </div>
    </div>
  );
};

export default FifthStep;
