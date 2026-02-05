import { useRef, useState } from "react";

interface UploadFile {
  file: File;
  id: string;
}

const Step5FileUploader = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // open file picker
  const handleClick = () => {
    inputRef.current?.click();
  };

  // handle selected files
  const handleFiles = (selected: FileList | null) => {
    if (!selected) return;

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    const newFiles = Array.from(selected)
      .filter((file) => {
        if (file.size > MAX_SIZE) {
          alert(`${file.name} exceeds 5MB`);
          return false;
        }
        return true;
      })
      .map((file) => ({
        file,
        id: crypto.randomUUID(),
      }));

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="mt-6">
      {/* DROP ZONE */}
      <div
        onClick={handleClick}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition
          ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />

        <p className="text-gray-700 font-medium">
          Drag & drop files here
        </p>

        <p className="text-sm text-gray-500 mt-1">
          or click to upload
        </p>

        <p className="text-xs text-gray-400 mt-2">
          Max file size: 5MB
        </p>
      </div>

      {/* FILE LIST */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="font-semibold text-gray-700">
            Uploaded Files
          </p>

          {files.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between border rounded-lg px-4 py-2 bg-gray-50"
            >
              <div>
                <p className="text-sm font-medium">{f.file.name}</p>
                <p className="text-xs text-gray-500">
                  {(f.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <button
                onClick={() => removeFile(f.id)}
                className="text-red-500 hover:text-red-700 text-sm font-semibold"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Step5FileUploader;
