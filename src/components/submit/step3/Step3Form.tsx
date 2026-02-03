import Step3Table from "./Step3Table";
import { useState } from "react";
import AddItemModal from "./AddItemModal";
import Step3Summary from "./Step3Summary";

const Step3Form = () => {
const [openModal, setOpenModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* BUTTON */}
      <button
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
        <button className="px-6 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition duration-200 cursor-pointer">
          Back
        </button>

        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-sm cursor-pointer hover:bg-blue-700 transition duration-200">
          Next
        </button>
      </div>
    </div>
  );
};

export default Step3Form;
