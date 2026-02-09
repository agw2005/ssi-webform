import Step3Table from "./Step3Table.tsx";
import { useState } from "react";
import AddItemModal from "./AddItemModal.tsx";
import Step3Summary from "./Step3Summary.tsx";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const Step3Form = ({ onNext, onBack }: Props) => {
const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };
const [openModal, setOpenModal] = useState(false);

  return (
    <form onSubmit={handleNext} className="space-y-4">

    <div className="space-y-6">
      {/* BUTTON */}
      <button
        type="button"
        onClick={() => setOpenModal(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mb-4"
      >
      + Detail Item
      </button>
      <AddItemModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />
      {/* TABLE */}
      <Step3Table />
      <Step3Summary />
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

export default Step3Form;
