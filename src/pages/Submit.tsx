import Primitive from "../components/Primitive.tsx";
import FirstStep from "../components/FirstStep.tsx";
import SecondStep from "../components/SecondStep.tsx";
import ThirdStep from "../components/ThirdStep.tsx";
import FourthStep from "../components/FourthStep.tsx";

const Submit = () => {
  const checkFileSizeConstraint = (
    inputFiles: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = inputFiles.target.files;
    if (!files) return;

    const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mb
    const fileArray = Array.from(files);
    const invalid = fileArray.filter((file) => file.size > MAX_SIZE_BYTES);

    if (invalid.length > 0) {
      inputFiles.target.value = "";
      alert(`One or more files exceeded the 5Mb limit.`);
      return;
    }
  };

  return (
    <Primitive>
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap gap-8">
          <FirstStep />
          <SecondStep />
        </div>
        <ThirdStep />
        <div className="flex flex-wrap gap-8">
          <FourthStep />
          <div className="rounded-2xl bg-purple-100 p-8 flex flex-col gap-4 flex-1 w-full">
            <h1 className="text-3xl font-bold text-purple-600">Step 5</h1>
            <div className="flex flex-col w-full">
              <div className="h-8 lg:h-9 xl:h-10 | flex">
                <div className="text-xs lg:text-sm xl:text-base | whitespace-nowrap font-bold rounded-tl-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-purple-600 bg-purple-600 text-white select-none">
                  Attachment{" "}
                  <span className="text-xs text-white/80 ml-1 whitespace-nowrap">
                    (Max 5Mb)
                  </span>
                </div>
                <label
                  htmlFor="attachment"
                  className="text-xs lg:text-sm xl:text-base | bg-white/50 hover:bg-purple-600/20 active:bg-purple-600/30 | text-purple-600 hover:text-black active:text-black | flex-1 rounded-tr-xl h-full justify-self-center flex items-center px-2 border border-purple-600 select-none"
                >
                  <input
                    hidden
                    multiple
                    type="file"
                    name="attachment"
                    id="attachment"
                    onChange={checkFileSizeConstraint}
                  />
                  <p className="whitespace-nowrap">
                    Drag & drop files here (or click) to upload
                  </p>
                </label>
              </div>
              <div className="text-xs lg:text-sm xl:text-base | w-full flex flex-wrap gap-2 min-h-10 font-bold rounded-b-xl justify-self-center border border-purple-600 text-white select-none p-2">
                <div className="flex">
                  <div className="text-xs lg:text-sm | font-normal bg-purple-900 rounded-l-xl p-2 flex items-center | to-handle-long-filename:( min-w-0 truncate max-w-64 )">
                    L01xNTRTYUowN2FpcmVoeTZ5S3A2d3JmR2lVOTJVQldia2NUbHhBNmpZYm5kdFFTTFU3RSswS1RubENBL3Q0aVhKVzRsUDFaUkhIdVlpd0hXMDViOHc9PQ==.pdf
                  </div>
                  <div className="text-xs lg:text-sm | bg-red-900 hover:bg-red-900/85 active:bg-red-900/70 | font-normal rounded-r-xl p-2 text-white">
                    X
                  </div>
                </div>
                <div className="flex">
                  <div className="text-xs lg:text-sm | font-normal bg-purple-900 rounded-l-xl p-2 flex items-center | to-handle-long-filename:( min-w-0 truncate max-w-64 )">
                    Danial Al Ghazali Walangadi (203)
                  </div>
                  <div className="text-xs lg:text-sm | bg-red-900 hover:bg-red-900/85 active:bg-red-900/70 | font-normal rounded-r-xl p-2 text-white">
                    X
                  </div>
                </div>
                <div className="flex">
                  <div className="text-xs lg:text-sm | font-normal bg-purple-900 rounded-l-xl p-2 flex items-center | to-handle-long-filename:( min-w-0 truncate max-w-64 )">
                    L01xNTRTYUowN2FpcmVoeTZ5S3A2d3JmR2lVOTJVQldia2NUbHhBNmpZYm5kdFFTTFU3RSswS1RubENBL3Q0aVhKVzRsUDFaUkhIdVlpd0hXMDViOHc9PQ==.pdf
                  </div>
                  <div className="text-xs lg:text-sm | bg-red-900 hover:bg-red-900/85 active:bg-red-900/70 | font-normal rounded-r-xl p-2 text-white">
                    X
                  </div>
                </div>
                <div className="flex">
                  <div className="text-xs lg:text-sm | font-normal bg-purple-900 rounded-l-xl p-2 flex items-center | to-handle-long-filename:( min-w-0 truncate max-w-64 )">
                    L01xNTRTYUowN2FpcmVoeTZ5S3A2d3JmR2lVOTJVQldia2NUbHhBNmpZYm5kdFFTTFU3RSswS1RubENBL3Q0aVhKVzRsUDFaUkhIdVlpd0hXMDViOHc9PQ==.pdf
                  </div>
                  <div className="text-xs lg:text-sm | bg-red-900 hover:bg-red-900/85 active:bg-red-900/70 | font-normal rounded-r-xl p-2 text-white">
                    X
                  </div>
                </div>
                <div className="flex">
                  <div className="text-xs lg:text-sm | font-normal bg-purple-900 rounded-l-xl p-2 flex items-center | to-handle-long-filename:( min-w-0 truncate max-w-64 )">
                    L01xNTRTYUowN2FpcmVoeTZ5S3A2d3JmR2lVOTJVQldia2NUbHhBNmpZYm5kdFFTTFU3RSswS1RubENBL3Q0aVhKVzRsUDFaUkhIdVlpd0hXMDViOHc9PQ==.pdf
                  </div>
                  <div className="text-xs lg:text-sm | bg-red-900 hover:bg-red-900/85 active:bg-red-900/70 | font-normal rounded-r-xl p-2 text-white">
                    X
                  </div>
                </div>
              </div>
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
        </div>
      </div>
    </Primitive>
  );
};

export default Submit;
