import Step3Table from "./Step3Table.tsx";

const Step3Form = () => {
  return (
    <div className="space-y-6">
      {/* BUTTON */}
      <button
        type="button"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        + Detail Item
      </button>

      {/* TABLE */}
      <Step3Table />
    </div>
  );
};

export default Step3Form;
