const SubmitFormType = () => {
  return (
    <div className="flex items-start gap-4">
      <label className="w-40">Select Form :</label>
      <div className="flex flex-col gap-1">
        <label><input type="radio" name="form" /> PR</label>
        <label><input type="radio" name="form" /> Cash Advance</label>
        <label><input type="radio" name="form" /> Fixed Asset</label>
      </div>
    </div>
  );
};

export default SubmitFormType;
