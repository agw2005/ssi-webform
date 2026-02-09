import Step4Header from "./Step4Header.tsx";
import Step4Attention from "./Step4Attention.tsx";
import Step4ApprovalSection from "./Step4ApprovalSection.tsx";

interface Props {
  onBack: () => void;
  onNext: () => void;
}

const Step4Form = ({ onBack, onNext }: Props) => {
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleNext} className="space-y-4">
      
    <div className="bg-white rounded-xl p-8 shadow-sm">
      <Step4Header />
      <Step4Attention />
      <Step4ApprovalSection />
      <div className="flex justify-end gap-2 mt-6">
        <button type="button" onClick={onBack} className="px-6 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition duration-200 cursor-pointer">
          Back
        </button>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-sm cursor-pointer hover:bg-blue-700 transition duration-200">
          Next
        </button>
      </div>
    </div>
    </form>
  );
};

export default Step4Form;
