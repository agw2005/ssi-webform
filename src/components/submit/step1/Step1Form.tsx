import SubmitUserInfo from "./Step1UserInfo.tsx";
import SubmitWorkInfo from "./Step1WorkInfo.tsx";
import SubmitFormType from "./Step1FormType.tsx";

interface Props {
  onNext: () => void;
}

const Step1Form = ({ onNext }: Props) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // cegah reload
    onNext(); // scroll ke step 2
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <SubmitUserInfo />
      <SubmitWorkInfo />
      <SubmitFormType />

      {/* HARD CODE BUTTON */}
      <div className="text-right">
        <button
          type="submit"
          className="
            bg-blue-600 
            text-white 
            px-6 
            py-2 
            rounded-lg
            shadow-sm
            cursor-pointer 
            hover:bg-blue-700
            transition
            duration-200
          "
        >
          Next
        </button>
      </div>

    </form>
  );
};

export default Step1Form;
