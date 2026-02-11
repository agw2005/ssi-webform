const SecondStep = () => {
  return (
    <div className="rounded-2xl bg-blue-100 p-8 flex flex-col gap-4 flex-1">
      <h1 className="text-3xl font-bold text-blue-600">Step 2</h1>
      <div className="h-8 lg:h-9 xl:h-10 | flex">
        <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-blue-600 bg-blue-600 text-white select-none">
          No. Form
        </div>
        <input
          disabled
          type="text"
          name="no-form"
          id="no-form"
          className="text-xs lg:text-sm xl:text-base | h-full px-4 rounded-r-xl border border-blue-600 text-blue-600 bg-black/10 outline-none flex-1"
        />
      </div>
      <div className="h-8 lg:h-9 xl:h-10 | flex">
        <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-blue-600 bg-blue-600 text-white select-none">
          No. PR
        </div>
        <input
          disabled
          type="text"
          name="no-pr"
          id="no-pr"
          className="text-xs lg:text-sm xl:text-base | h-full px-4 rounded-r-xl border border-blue-600 text-blue-600 bg-black/10 outline-none flex-1"
        />
      </div>
      <div className="h-8 lg:h-9 xl:h-10 | flex">
        <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-l-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-blue-600 bg-blue-600 text-white select-none">
          Subject*
        </div>
        <input
          type="text"
          name="subject"
          id="subject"
          className="text-xs lg:text-sm xl:text-base | h-full px-4 rounded-r-xl border border-blue-600 text-blue-600 bg-white/50 outline-none flex-1"
        />
      </div>
      <div className="flex flex-col">
        <div className="text-xs lg:text-sm xl:text-base | h-8 lg:h-9 xl:h-10 | w-max font-bold rounded-t-xl justify-self-center border flex items-center px-2 border-r-0 border-blue-600 bg-blue-600 text-white select-none">
          Return on Outgoing
        </div>
        <textarea
          name="subject"
          id="subject"
          className="text-xs lg:text-sm xl:text-base | h-32 px-4 py-2 w-full rounded-bl-xl rounded-br-xl rounded-tr-xl border border-blue-600 text-blue-600 bg-white/50 outline-none"
        />
      </div>
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
