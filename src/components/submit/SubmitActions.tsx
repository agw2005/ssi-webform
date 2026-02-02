interface Props {
  onNext: () => void;
}

const SubmitActions = ({ onNext }: Props) => {
  return (
    <div className="text-right">
      <button
        type="submit"
        onClick={onNext}
        className="bg-blue-600 text-white px-6 py-2 rounded cursor-pointer hover:bg-blue-700"
      >
        Next
      </button>
    </div>
  );
};

export default SubmitActions;
