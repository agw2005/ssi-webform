import MultifileInput from "./MultifileInput";

const FifthStep = () => {
  return (
    <div className="rounded-2xl bg-purple-100 p-8 flex flex-col gap-4 flex-1 w-full">
      <h1 className="text-3xl font-bold text-purple-600">Step 5</h1>
      <div className="flex flex-col w-full">
        <MultifileInput />
      </div>
      <div className="flex gap-2">
        <div className="bg-black hover:bg-black/70 active:bg-black/85 | px-4 py-2 border rounded-2xl border-black font-bold tracking-wide text-white select-none">
          Clear
        </div>
        <div className="bg-black hover:bg-black/70 active:bg-black/85 | px-4 py-2 border rounded-2xl border-black font-bold tracking-wide text-white select-none">
          Submit
        </div>
      </div>
    </div>
  );
};

export default FifthStep;
