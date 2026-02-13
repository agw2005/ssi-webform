import RemovableSelections from "./RemovableSelections";

interface MultifileInputProps {
  uploads: File[];
  onUploadsChange: (newUploads: File[]) => void;
}

const MultifileInput = ({ uploads, onUploadsChange }: MultifileInputProps) => {
  const handleFileUpload = (
    elementInput: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const inputFiles = elementInput.target.files;
    if (!inputFiles) return;
    const fileArray = Array.from(inputFiles);

    const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mb
    const invalid = fileArray.filter((file) => file.size > MAX_SIZE_BYTES);

    if (invalid.length > 0) {
      elementInput.target.value = "";
      alert(`One or more files exceeded the 5Mb limit.`);
      return;
    }

    onUploadsChange([...uploads, ...inputFiles]);
  };

  return (
    <>
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
            onChange={handleFileUpload}
          />
          <p className="whitespace-nowrap">
            Drag & drop files here (or click) to upload
          </p>
        </label>
      </div>
      <RemovableSelections
        variant="purple"
        array={uploads}
        arraySetter={onUploadsChange}
        getLabel={(inputFile) => inputFile.name}
      />
    </>
  );
};

export default MultifileInput;
