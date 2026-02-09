import Step5Header from "./Step5Header.tsx";
import FileUploader from "./Step5FileUploader.tsx";

interface Props {
  onBack: () => void;
}

const Step5Form = ({ onBack }: Props) => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm">
      <Step5Header />
      <FileUploader />
      <div className="flex justify-end gap-2 mt-6">
        <button type="button" onClick={onBack} className="px-6 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition duration-200 cursor-pointer">
          Back
        </button>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-sm cursor-pointer hover:bg-blue-700 transition duration-200">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Step5Form;
