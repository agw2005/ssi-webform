const Step4Attention = () => {
  return (
    <div className="space-y-3 mb-6">

      {/* BLUE */}
      <div className="bg-blue-50 border border-blue-300 text-blue-700 p-3 text-sm rounded-md">
        <b>Info!</b> Special Releaser will available if you have "Red Light"
      </div>

      {/* RED */}
      <div className="bg-red-50 border border-red-400 text-red-700 p-3 text-sm rounded-md">
        <b>Beware!</b> Check again your approver before you submit your PR Form.
      </div>

    </div>
  );
};

export default Step4Attention;
